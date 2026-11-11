// Gemeinsame Hilfsfunktionen für die Cloudflare Pages Functions.
// Bindings (im Cloudflare-Dashboard unter Pages-Projekt → Settings → Bindings):
//   DB      → D1-Datenbank (Produkte und Shop-Einstellungen)
//   BILDER  → R2-Bucket (Produktfotos)
// Secret (Settings → Variables and Secrets):
//   ADMIN_PASSWORD → Passwort für den Admin-Bereich
//   SESSION_SECRET → optional; ohne wird der Sitzungsschlüssel aus ADMIN_PASSWORD abgeleitet

export const CATEGORIES = ["offers", "serums", "masks", "eyes", "creams"];
export const SETTINGS_KEYS = ["whatsappNumber", "orderEmail", "contactEmail"];
export const TEXT_FIELDS = [
    "name", "description",
    "nameAr", "descriptionAr",
    "nameEn", "descriptionEn",
    "nameDe", "descriptionDe"
];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const IMAGE_TYPES = {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/avif": "avif"
};

const SCHEMA = [
    `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        nameAr TEXT NOT NULL DEFAULT '',
        descriptionAr TEXT NOT NULL DEFAULT '',
        nameEn TEXT NOT NULL DEFAULT '',
        descriptionEn TEXT NOT NULL DEFAULT '',
        nameDe TEXT NOT NULL DEFAULT '',
        descriptionDe TEXT NOT NULL DEFAULT '',
        priceUsdCents INTEGER NOT NULL DEFAULT 0,
        priceSyp INTEGER NOT NULL DEFAULT 0,
        category TEXT NOT NULL DEFAULT 'offers',
        sortOrder INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        imageKey TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS products_sort ON products (sortOrder)`,
    `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT ''
    )`
];

let schemaReady = false;

export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
            ...headers
        }
    });
}

export function errorResponse(error) {
    if (error instanceof HttpError) {
        return json({ error: error.message }, error.status);
    }
    console.error(error);
    return json({ error: "Interner Fehler" }, 500);
}

export function requireDb(env) {
    if (!env.DB) {
        throw new HttpError(503, "D1-Binding \"DB\" fehlt. Bitte im Cloudflare-Dashboard unter Pages → Settings → Bindings verknüpfen.");
    }
    return env.DB;
}

export function requireBucket(env) {
    if (!env.BILDER) {
        throw new HttpError(503, "R2-Binding \"BILDER\" fehlt. Bitte im Cloudflare-Dashboard unter Pages → Settings → Bindings verknüpfen.");
    }
    return env.BILDER;
}

export async function getDb(env) {
    const db = requireDb(env);
    if (!schemaReady) {
        await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
        schemaReady = true;
    }
    return db;
}

export function imageUrlFor(key) {
    if (!key) return "";
    return "/bilder/" + key.split("/").map(encodeURIComponent).join("/");
}

// Datenbankzeile → Format, das script.js und admin.js erwarten
export function rowToProduct(row) {
    return {
        $id: row.id,
        id: row.id,
        name: row.name,
        description: row.description,
        nameAr: row.nameAr,
        descriptionAr: row.descriptionAr,
        nameEn: row.nameEn,
        descriptionEn: row.descriptionEn,
        nameDe: row.nameDe,
        descriptionDe: row.descriptionDe,
        priceUsdCents: row.priceUsdCents,
        priceSyp: row.priceSyp,
        category: row.category,
        sortOrder: row.sortOrder,
        active: row.active === 1,
        imageKey: row.imageKey || "",
        imageUrl: imageUrlFor(row.imageKey)
    };
}

function toInt(value, fallback = 0) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
}

function toBool(value) {
    if (typeof value === "boolean") return value;
    return value === "true" || value === "1" || value === "on" || value === 1;
}

// Prüft und normalisiert Produktdaten aus dem Admin-Formular oder dem Import
export function normalizeProduct(input) {
    const product = {};
    for (const field of TEXT_FIELDS) {
        product[field] = String(input[field] ?? "").trim().slice(0, 5000);
    }
    if (!product.name) {
        throw new HttpError(400, "Name darf nicht leer sein.");
    }
    product.priceUsdCents = Math.max(0, toInt(input.priceUsdCents));
    product.priceSyp = Math.max(0, toInt(input.priceSyp));
    product.sortOrder = Math.max(0, toInt(input.sortOrder));
    product.category = CATEGORIES.includes(input.category) ? input.category : "offers";
    product.active = toBool(input.active) ? 1 : 0;
    return product;
}

export async function readSettings(db) {
    const { results } = await db.prepare("SELECT key, value FROM settings").all();
    const settings = Object.fromEntries(SETTINGS_KEYS.map((key) => [key, ""]));
    for (const row of results) {
        if (SETTINGS_KEYS.includes(row.key)) settings[row.key] = row.value;
    }
    return settings;
}

export async function writeSettings(db, input) {
    const settings = {
        whatsappNumber: String(input.whatsappNumber ?? "").trim().replace(/\s+/g, "").replace(/^\+/, "").slice(0, 30),
        orderEmail: String(input.orderEmail ?? "").trim().slice(0, 200),
        contactEmail: String(input.contactEmail ?? "").trim().slice(0, 200)
    };
    if (settings.whatsappNumber && !/^\d{6,20}$/.test(settings.whatsappNumber)) {
        throw new HttpError(400, "WhatsApp-Nummer: nur Ziffern, international ohne +.");
    }
    const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
    await db.batch(SETTINGS_KEYS.map((key) => stmt.bind(key, settings[key])));
    return settings;
}

// ---------- Admin-Anmeldung ----------

const COOKIE_NAME = "mb_admin";
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const encoder = new TextEncoder();

function toHex(buffer) {
    return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text) {
    return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
}

async function hmacKey(env) {
    const secret = env.SESSION_SECRET || ("mais-beauty-session:" + env.ADMIN_PASSWORD);
    return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

async function sign(env, payload) {
    const key = await hmacKey(env);
    return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function safeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function requirePasswordConfigured(env) {
    if (!env.ADMIN_PASSWORD) {
        throw new HttpError(503, "ADMIN_PASSWORD ist nicht gesetzt. Bitte im Cloudflare-Dashboard unter Pages → Settings → Variables and Secrets anlegen.");
    }
}

export async function checkPassword(env, password) {
    requirePasswordConfigured(env);
    const [given, expected] = await Promise.all([sha256(String(password ?? "")), sha256(env.ADMIN_PASSWORD)]);
    return safeEqual(given, expected);
}

function isSecure(request) {
    return new URL(request.url).protocol === "https:";
}

export async function sessionCookie(env, request) {
    const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
    const value = `${expires}.${await sign(env, String(expires))}`;
    return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${isSecure(request) ? "; Secure" : ""}`;
}

export function clearSessionCookie(request) {
    return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isSecure(request) ? "; Secure" : ""}`;
}

export async function isLoggedIn(env, request) {
    if (!env.ADMIN_PASSWORD) return false;
    const cookies = request.headers.get("cookie") || "";
    const match = cookies.split(/;\s*/).find((c) => c.startsWith(COOKIE_NAME + "="));
    if (!match) return false;
    const [expires, signature] = match.slice(COOKIE_NAME.length + 1).split(".");
    if (!expires || !signature) return false;
    if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
    return safeEqual(signature, await sign(env, expires));
}

// Schutz gegen fremde Seiten, die Formulare an den Admin schicken
export function checkSameOrigin(request) {
    if (request.method === "GET" || request.method === "HEAD") return;
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
        throw new HttpError(403, "Fremde Herkunft abgelehnt.");
    }
}

// ---------- Bilder ----------

export function newImageKey(contentType) {
    const ext = IMAGE_TYPES[contentType] || "bin";
    return `produkte/${crypto.randomUUID().replace(/-/g, "")}.${ext}`;
}

export async function storeImage(bucket, file) {
    if (!file || typeof file === "string" || !file.size) return null;
    const contentType = (file.type || "").toLowerCase();
    if (!IMAGE_TYPES[contentType]) {
        throw new HttpError(400, "Nur Bilder (WebP, JPEG, PNG, GIF, AVIF) sind erlaubt.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
        throw new HttpError(400, "Bild ist zu groß (max. 10 MB).");
    }
    const key = newImageKey(contentType);
    await bucket.put(key, file.stream(), { httpMetadata: { contentType } });
    return key;
}

export async function deleteImage(bucket, key) {
    if (!key) return;
    try {
        await bucket.delete(key);
    } catch (error) {
        console.warn("Bild konnte nicht gelöscht werden:", key, error);
    }
}
