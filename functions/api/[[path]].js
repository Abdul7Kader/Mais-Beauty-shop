/**
 * Mais Beauty API - Cloudflare Pages Function (catch-all for /api/*).
 *
 * Replaces Appwrite. Everything (products, settings, photos, change log) lives in
 * one Cloudflare D1 database bound as `DB` (Pages project > Settings > Bindings).
 * D1 instead of KV: KV is eventually consistent (up to 60 s), so two quick admin
 * saves could overwrite each other; D1 is a real SQLite database.
 *
 * Admin logins come from secrets named PASSWORD_<NAME> (e.g. PASSWORD_MAIS,
 * PASSWORD_ABDUL); the user name is the suffix. The session cookie is an HMAC-signed
 * token whose key is derived from those passwords, so changing a password logs
 * everybody out and no extra secret is needed. Free Workers plan: 10 ms CPU per
 * request, so no PBKDF2 - passwords are compared as SHA-256 digests in constant time.
 *
 * Routes:
 *   GET  /api/catalog                 public: active products + shop settings
 *   GET  /api/img/:id                 public: product photo (immutable cache)
 *   POST /api/login {password}        sets the session cookie
 *   POST /api/logout
 *   GET  /api/me                      {user} or 401, plus setup state
 *   GET  /api/admin/catalog           all products incl. hidden ones
 *   POST /api/admin/products          create
 *   PUT  /api/admin/products/:id      update
 *   DELETE /api/admin/products/:id    delete (photo too, if no other product uses it)
 *   PUT  /api/admin/settings
 *   POST /api/admin/images            raw jpeg/png/webp body -> {id, url}
 *   GET  /api/admin/backup            JSON download (without photo bytes)
 *   POST /api/admin/restore           replace products + settings from a backup
 *   GET  /api/admin/log               last 100 changes (who, when, what)
 *   POST /api/admin/import/list       read products + settings from Appwrite
 *   POST /api/admin/import/product    import one Appwrite product incl. photo
 *                                     (one call per product: free plan allows 50
 *                                     subrequests per request)
 *
 * Local test (no account needed):
 *   npx wrangler pages dev . --d1 DB=mais-local \
 *     --binding PASSWORD_MAIS=test-mais PASSWORD_ABDUL=test-abdul
 */

const CATEGORIES = ["offers", "serums", "masks", "eyes", "creams"];
const TEXT_FIELDS = {
    name: 160,
    description: 4000,
    nameAr: 160,
    nameEn: 160,
    nameDe: 160,
    descriptionAr: 4000,
    descriptionEn: 4000,
    descriptionDe: 4000
};
const MAX_IMAGE_BYTES = 1_900_000; // D1 row limit is 2 MB
const SESSION_SECONDS = 30 * 24 * 3600;
const COOKIE_NAME = "mb_admin";
const CSRF_HEADER = "x-requested-with";
const CSRF_VALUE = "mais-admin";
const APPWRITE = {
    endpoint: "https://fra.cloud.appwrite.io/v1",
    project: "6a0d8738002fb76a4caf",
    database: "mais_beauty_db"
};

let schemaReady = false;

export async function onRequest(context) {
    const { request, env } = context;
    const segments = [].concat(context.params.path || []).filter(Boolean);
    try {
        return await route(request, env, segments);
    } catch (error) {
        if (error instanceof HttpError) return json({ error: error.code, message: error.message }, error.status);
        console.error("API error", error);
        return json({ error: "server_error", message: "Interner Fehler. Bitte später erneut versuchen." }, 500);
    }
}

async function route(request, env, segments) {
    const method = request.method;
    const [first, second, third] = segments;

    if (first === "catalog" && segments.length === 1 && method === "GET") return getPublicCatalog(env);
    if (first === "img" && second && segments.length === 2 && method === "GET") return getImage(env, second);
    if (first === "login" && method === "POST") return login(request, env);
    if (first === "logout" && method === "POST") {
        requireCsrf(request);
        return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
    }
    if (first === "me" && method === "GET") return me(request, env);

    if (first === "admin") {
        const user = await requireUser(request, env);
        if (method !== "GET") requireCsrf(request);
        const db = requireDb(env);

        if (second === "catalog" && method === "GET") return json(await readCatalog(db, { includeHidden: true, user }));
        if (second === "products" && !third && method === "POST") return createProduct(request, db, user);
        if (second === "products" && third && method === "PUT") return updateProduct(request, db, user, third);
        if (second === "products" && third && method === "DELETE") return deleteProduct(db, user, third);
        if (second === "settings" && method === "PUT") return saveSettings(request, db, user);
        if (second === "images" && method === "POST") return uploadImage(request, db);
        if (second === "backup" && method === "GET") return backup(db, user);
        if (second === "restore" && method === "POST") return restore(request, db, user);
        if (second === "log" && method === "GET") return readLog(db);
        if (second === "import" && third === "list" && method === "POST") return importList(env, db, user);
        if (second === "import" && third === "product" && method === "POST") return importProduct(request, env, db, user);
    }

    throw new HttpError(404, "not_found", "Unbekannte Adresse.");
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            ...headers
        }
    });
}

function nowIso() {
    return new Date().toISOString();
}

function clampInt(value, min, max) {
    const number = Math.round(Number(value));
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
}

async function readJson(request, maxBytes = 200_000) {
    const text = await request.text();
    if (text.length > maxBytes) throw new HttpError(413, "too_large", "Die Anfrage ist zu groß.");
    try {
        return JSON.parse(text || "{}");
    } catch (error) {
        throw new HttpError(400, "bad_json", "Ungültige Daten.");
    }
}

function requireDb(env) {
    if (!env.DB) {
        throw new HttpError(503, "no_db",
            "Die Datenbank ist noch nicht verbunden. In Cloudflare: Pages-Projekt > Settings > Bindings > D1 database mit dem Namen DB hinzufügen.");
    }
    return env.DB;
}

async function ensureSchema(db) {
    if (schemaReady) return;
    await db.batch([
        db.prepare("CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, updated_at TEXT, updated_by TEXT)"),
        db.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"),
        db.prepare("CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL, size INTEGER NOT NULL, created_at TEXT)"),
        db.prepare("CREATE TABLE IF NOT EXISTS log (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, user TEXT NOT NULL, action TEXT NOT NULL, detail TEXT)")
    ]);
    schemaReady = true;
}

async function addLog(db, user, action, detail) {
    await db.prepare("INSERT INTO log (at, user, action, detail) VALUES (?, ?, ?, ?)")
        .bind(nowIso(), user, action, String(detail || "").slice(0, 300)).run();
    /* keep the table small */
    await db.prepare("DELETE FROM log WHERE id <= (SELECT MAX(id) FROM log) - 500").run();
}

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */

const encoder = new TextEncoder();

function adminUsers(env) {
    return Object.keys(env)
        .filter((key) => key.startsWith("PASSWORD_") && typeof env[key] === "string" && env[key].length > 0)
        .sort()
        .map((key) => {
            const raw = key.slice("PASSWORD_".length).toLowerCase();
            return { name: raw.charAt(0).toUpperCase() + raw.slice(1), password: env[key] };
        });
}

async function sha256(text) {
    return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
}

function equalBytes(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
    return diff === 0;
}

function base64url(bytes) {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(text) {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
    return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function sessionKey(users) {
    const material = "mais-beauty-session-v1\n" + users.map((u) => `${u.name}=${u.password}`).join("\n");
    return crypto.subtle.importKey("raw", await sha256(material), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

async function signToken(users, payload) {
    const body = base64url(encoder.encode(JSON.stringify(payload)));
    const key = await sessionKey(users);
    const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
    return `${body}.${base64url(signature)}`;
}

async function readSession(request, env) {
    const users = adminUsers(env);
    if (!users.length) return null;
    const cookie = request.headers.get("Cookie") || "";
    const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (!match) return null;
    const [body, signature] = match[1].split(".");
    if (!body || !signature) return null;
    try {
        const key = await sessionKey(users);
        const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
        if (!equalBytes(expected, fromBase64url(signature))) return null;
        const payload = JSON.parse(new TextDecoder().decode(fromBase64url(body)));
        if (!payload || typeof payload.u !== "string" || payload.exp < Date.now() / 1000) return null;
        if (!users.some((u) => u.name === payload.u)) return null;
        return payload.u;
    } catch (error) {
        return null;
    }
}

function sessionCookie(token) {
    return `${COOKIE_NAME}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

function clearCookie() {
    return `${COOKIE_NAME}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function requireCsrf(request) {
    /* A custom header cannot be sent cross-site without CORS approval. */
    if (request.headers.get(CSRF_HEADER) !== CSRF_VALUE) {
        throw new HttpError(403, "csrf", "Anfrage abgelehnt.");
    }
}

async function requireUser(request, env) {
    const user = await readSession(request, env);
    if (!user) throw new HttpError(401, "login_required", "Bitte erneut anmelden.");
    return user;
}

async function login(request, env) {
    requireCsrf(request);
    const users = adminUsers(env);
    if (!users.length) {
        throw new HttpError(503, "no_passwords",
            "Es ist noch kein Admin-Passwort eingerichtet. In Cloudflare: Settings > Variables and Secrets > Secret PASSWORD_MAIS anlegen.");
    }
    const body = await readJson(request, 2000);
    const given = await sha256(String(body.password || ""));
    let found = null;
    for (const user of users) {
        /* compare against every user so timing does not reveal which one matched */
        if (equalBytes(given, await sha256(user.password)) && !found) found = user;
    }
    if (!found) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        throw new HttpError(401, "wrong_password", "Falsches Passwort.");
    }
    const token = await signToken(users, { u: found.name, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS });
    if (env.DB) {
        await ensureSchema(env.DB);
        await addLog(env.DB, found.name, "login", "");
    }
    return json({ user: found.name }, 200, { "Set-Cookie": sessionCookie(token) });
}

async function me(request, env) {
    const setup = { database: Boolean(env.DB), passwords: adminUsers(env).length };
    const user = await readSession(request, env);
    if (!user) return json({ error: "login_required", setup }, 401);
    return json({ user, setup });
}

/* ------------------------------------------------------------------ */
/* Catalog                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_SETTINGS = { whatsappNumber: "", orderEmail: "", contactEmail: "" };

async function readSettings(db) {
    const row = await db.prepare("SELECT value FROM settings WHERE key = 'shop'").first();
    if (!row) return { ...DEFAULT_SETTINGS };
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(row.value) };
    } catch (error) {
        return { ...DEFAULT_SETTINGS };
    }
}

async function readProducts(db) {
    const { results } = await db.prepare("SELECT id, data, updated_at, updated_by FROM products ORDER BY sort_order, rowid").all();
    return results.map((row) => {
        const data = JSON.parse(row.data);
        return { ...data, id: row.id, $id: row.id, updatedAt: row.updated_at, updatedBy: row.updated_by };
    });
}

async function readCatalog(db, { includeHidden = false, user = null } = {}) {
    await ensureSchema(db);
    const [products, settings] = await Promise.all([readProducts(db), readSettings(db)]);
    const visible = includeHidden ? products : products.filter((product) => product.active !== false)
        .map(({ updatedBy, ...rest }) => rest);
    return { products: visible, settings, ...(user ? { user } : {}) };
}

async function getPublicCatalog(env) {
    const db = requireDb(env);
    return json(await readCatalog(db));
}

/* ------------------------------------------------------------------ */
/* Products                                                           */
/* ------------------------------------------------------------------ */

function imageIdFromUrl(url) {
    const match = /^\/api\/img\/([A-Za-z0-9_-]{8,64})$/.exec(String(url || ""));
    return match ? match[1] : null;
}

function safeImageUrl(url) {
    const value = String(url || "").trim();
    if (!value) return "";
    if (imageIdFromUrl(value)) return value;
    if (/^https:\/\/[^\s"'<>]{1,500}$/.test(value)) return value;
    if (/^assets\/[A-Za-z0-9._\-/]{1,200}$/.test(value)) return value;
    return "";
}

/* Copies only known fields, with limits. `base` is the stored product on update. */
function cleanProduct(input, base = {}) {
    if (!input || typeof input !== "object") throw new HttpError(400, "bad_product", "Ungültige Produktdaten.");
    const product = { ...base };
    for (const [field, max] of Object.entries(TEXT_FIELDS)) {
        if (field in input) product[field] = String(input[field] ?? "").trim().slice(0, max);
    }
    if ("priceUsdCents" in input) product.priceUsdCents = clampInt(input.priceUsdCents, 0, 100_000_000);
    if ("priceSyp" in input) product.priceSyp = clampInt(input.priceSyp, 0, 2_000_000_000);
    if ("discountPercent" in input) product.discountPercent = clampInt(input.discountPercent, 0, 90);
    if ("sortOrder" in input) product.sortOrder = clampInt(input.sortOrder, -1_000_000, 1_000_000);
    if ("category" in input) product.category = CATEGORIES.includes(input.category) ? input.category : "offers";
    if ("active" in input) product.active = input.active !== false;
    if ("imageUrl" in input) product.imageUrl = safeImageUrl(input.imageUrl);

    product.priceUsdCents ??= 0;
    product.discountPercent ??= 0;
    product.sortOrder ??= 0;
    product.category ??= "offers";
    product.active ??= true;
    product.imageUrl ??= "";
    if (!product.name) throw new HttpError(400, "name_missing", "Der Produktname fehlt.");
    delete product.id;
    delete product.$id;
    delete product.updatedAt;
    delete product.updatedBy;
    return product;
}

async function getProductRow(db, id) {
    return db.prepare("SELECT id, data FROM products WHERE id = ?").bind(id).first();
}

async function writeProduct(db, id, product, user) {
    await db.prepare(
        "INSERT INTO products (id, data, sort_order, updated_at, updated_by) VALUES (?, ?, ?, ?, ?) " +
        "ON CONFLICT(id) DO UPDATE SET data = excluded.data, sort_order = excluded.sort_order, updated_at = excluded.updated_at, updated_by = excluded.updated_by"
    ).bind(id, JSON.stringify(product), product.sortOrder || 0, nowIso(), user).run();
}

/* Removes a stored photo once no product points to it any more. */
async function deleteImageIfUnused(db, imageUrl) {
    const imageId = imageIdFromUrl(imageUrl);
    if (!imageId) return;
    const { results } = await db.prepare("SELECT data FROM products").all();
    const stillUsed = results.some((row) => {
        try {
            return JSON.parse(row.data).imageUrl === imageUrl;
        } catch (error) {
            return false;
        }
    });
    if (!stillUsed) await db.prepare("DELETE FROM images WHERE id = ?").bind(imageId).run();
}

function validId(id) {
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) throw new HttpError(400, "bad_id", "Ungültige Produkt-ID.");
    return id;
}

async function createProduct(request, db, user) {
    await ensureSchema(db);
    const product = cleanProduct(await readJson(request));
    const id = crypto.randomUUID().replace(/-/g, "");
    await writeProduct(db, id, product, user);
    await addLog(db, user, "product_create", product.name);
    return json({ product: { ...product, id, $id: id } }, 201);
}

async function updateProduct(request, db, user, rawId) {
    await ensureSchema(db);
    const id = validId(rawId);
    const row = await getProductRow(db, id);
    if (!row) throw new HttpError(404, "product_missing", "Produkt nicht gefunden.");
    const before = JSON.parse(row.data);
    const product = cleanProduct(await readJson(request), before);
    await writeProduct(db, id, product, user);
    if (before.imageUrl && before.imageUrl !== product.imageUrl) await deleteImageIfUnused(db, before.imageUrl);
    const changes = describeChanges(before, product);
    await addLog(db, user, "product_update", `${product.name}${changes ? `: ${changes}` : ""}`);
    return json({ product: { ...product, id, $id: id } });
}

function describeChanges(before, after) {
    const labels = {
        priceUsdCents: "Preis", discountPercent: "Rabatt", active: "Sichtbarkeit", category: "Kategorie",
        imageUrl: "Foto", sortOrder: "Reihenfolge", name: "Name"
    };
    const changed = Object.keys(labels).filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
    const textChanged = Object.keys(TEXT_FIELDS).some((key) => key !== "name" && (before[key] || "") !== (after[key] || ""));
    return [...changed.map((key) => labels[key]), ...(textChanged ? ["Texte"] : [])].join(", ");
}

async function deleteProduct(db, user, rawId) {
    await ensureSchema(db);
    const id = validId(rawId);
    const row = await getProductRow(db, id);
    if (!row) throw new HttpError(404, "product_missing", "Produkt nicht gefunden.");
    const product = JSON.parse(row.data);
    await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    if (product.imageUrl) await deleteImageIfUnused(db, product.imageUrl);
    await addLog(db, user, "product_delete", product.name);
    return json({ ok: true });
}

/* ------------------------------------------------------------------ */
/* Settings                                                           */
/* ------------------------------------------------------------------ */

function cleanEmail(value) {
    const email = String(value || "").trim().slice(0, 160);
    if (!email) return "";
    if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email)) {
        throw new HttpError(400, "bad_email", `Ungültige E-Mail-Adresse: ${email}`);
    }
    return email;
}

function cleanSettings(input) {
    return {
        whatsappNumber: String(input.whatsappNumber || "").replace(/\D+/g, "").slice(0, 20),
        orderEmail: cleanEmail(input.orderEmail),
        contactEmail: cleanEmail(input.contactEmail)
    };
}

async function writeSettings(db, settings) {
    await db.prepare("INSERT INTO settings (key, value) VALUES ('shop', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
        .bind(JSON.stringify(settings)).run();
}

async function saveSettings(request, db, user) {
    await ensureSchema(db);
    const settings = cleanSettings(await readJson(request, 5000));
    await writeSettings(db, settings);
    await addLog(db, user, "settings_update", "");
    return json({ settings });
}

/* ------------------------------------------------------------------ */
/* Images                                                             */
/* ------------------------------------------------------------------ */

function sniffImageType(bytes) {
    if (bytes.length > 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return "image/jpeg";
    if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return "image/png";
    if (bytes.length > 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
        && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
    return null;
}

async function storeImage(db, bytes) {
    if (!bytes.length) throw new HttpError(400, "image_empty", "Das Foto ist leer.");
    if (bytes.length > MAX_IMAGE_BYTES) {
        throw new HttpError(413, "image_too_large", "Das Foto ist zu groß (max. 1,9 MB). Bitte ein kleineres Foto wählen.");
    }
    const type = sniffImageType(bytes);
    if (!type) throw new HttpError(415, "image_type", "Nur JPG-, PNG- oder WebP-Fotos sind erlaubt.");
    const id = crypto.randomUUID().replace(/-/g, "");
    await db.prepare("INSERT INTO images (id, type, data, size, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(id, type, bytes, bytes.length, nowIso()).run();
    return { id, url: `/api/img/${id}`, type, size: bytes.length };
}

async function uploadImage(request, db) {
    await ensureSchema(db);
    const declared = Number(request.headers.get("Content-Length") || 0);
    if (declared > MAX_IMAGE_BYTES) throw new HttpError(413, "image_too_large", "Das Foto ist zu groß (max. 1,9 MB).");
    const bytes = new Uint8Array(await request.arrayBuffer());
    return json(await storeImage(db, bytes), 201);
}

async function getImage(env, rawId) {
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(rawId)) throw new HttpError(404, "not_found", "Foto nicht gefunden.");
    const db = requireDb(env);
    await ensureSchema(db);
    const row = await db.prepare("SELECT type, data FROM images WHERE id = ?").bind(rawId).first();
    if (!row) throw new HttpError(404, "not_found", "Foto nicht gefunden.");
    return new Response(new Uint8Array(row.data), {
        headers: {
            "Content-Type": row.type,
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff"
        }
    });
}

/* ------------------------------------------------------------------ */
/* Backup, restore, log                                               */
/* ------------------------------------------------------------------ */

async function backup(db, user) {
    const catalog = await readCatalog(db, { includeHidden: true });
    const date = nowIso().slice(0, 10);
    await addLog(db, user, "backup", `${catalog.products.length} Produkte`);
    return json({
        format: "mais-beauty-backup",
        version: 1,
        exportedAt: nowIso(),
        note: "Fotos sind nicht enthalten, nur ihre Adressen (/api/img/...). Sie bleiben in der Datenbank.",
        products: catalog.products,
        settings: catalog.settings
    }, 200, { "Content-Disposition": `attachment; filename="mais-beauty-backup-${date}.json"` });
}

async function restore(request, db, user) {
    await ensureSchema(db);
    const data = await readJson(request, 5_000_000);
    if (data.format !== "mais-beauty-backup" || !Array.isArray(data.products)) {
        throw new HttpError(400, "bad_backup", "Das ist keine Mais-Beauty-Sicherung.");
    }
    if (data.products.length > 1000) throw new HttpError(400, "bad_backup", "Zu viele Produkte in der Sicherung.");
    const rows = data.products.map((item) => ({
        id: validId(String(item.id || item.$id || crypto.randomUUID().replace(/-/g, ""))),
        product: cleanProduct(item)
    }));
    const settings = cleanSettings(data.settings || {});
    const at = nowIso();
    const statements = [db.prepare("DELETE FROM products")];
    rows.forEach(({ id, product }) => {
        statements.push(db.prepare("INSERT INTO products (id, data, sort_order, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)")
            .bind(id, JSON.stringify(product), product.sortOrder || 0, at, user));
    });
    statements.push(db.prepare("INSERT INTO settings (key, value) VALUES ('shop', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
        .bind(JSON.stringify(settings)));
    await db.batch(statements);
    await addLog(db, user, "restore", `${rows.length} Produkte aus Sicherung vom ${String(data.exportedAt || "").slice(0, 10)}`);
    return json({ ok: true, products: rows.length });
}

async function readLog(db) {
    await ensureSchema(db);
    const { results } = await db.prepare("SELECT at, user, action, detail FROM log ORDER BY id DESC LIMIT 100").all();
    return json({ log: results });
}

/* ------------------------------------------------------------------ */
/* Import from Appwrite (one-time move)                               */
/* ------------------------------------------------------------------ */

/* APPWRITE_ENDPOINT only exists for local tests with a fake Appwrite; production uses the real one. */
function appwriteEndpoint(env) {
    return String(env.APPWRITE_ENDPOINT || APPWRITE.endpoint).replace(/\/+$/, "");
}

async function appwriteGet(env, path) {
    const response = await fetch(`${appwriteEndpoint(env)}${path}`, {
        headers: { "X-Appwrite-Project": APPWRITE.project, "Accept": "application/json" }
    });
    if (!response.ok) {
        throw new HttpError(502, "appwrite_unreachable",
            `Appwrite antwortet nicht (Status ${response.status}). Ist das Appwrite-Projekt pausiert? In der Appwrite-Konsole wieder aktivieren und erneut versuchen.`);
    }
    return response.json();
}

async function importList(env, db, user) {
    await ensureSchema(db);
    const query = encodeURIComponent(JSON.stringify({ method: "limit", values: [100] }));
    const list = await appwriteGet(env, `/databases/${APPWRITE.database}/collections/products/documents?queries[]=${query}`);
    const documents = Array.isArray(list.documents) ? list.documents : [];

    let settingsImported = false;
    try {
        const settings = await appwriteGet(env, `/databases/${APPWRITE.database}/collections/shop_settings/documents/main`);
        await writeSettings(db, cleanSettings(settings));
        settingsImported = true;
    } catch (error) {
        settingsImported = false;
    }
    await addLog(db, user, "import_start", `${documents.length} Produkte in Appwrite gefunden`);
    return json({
        settingsImported,
        products: documents.map((doc) => ({
            sourceId: String(doc.$id || ""),
            name: String(doc.name || doc.nameDe || doc.nameEn || doc.nameAr || ""),
            doc
        }))
    });
}

async function importProduct(request, env, db, user) {
    await ensureSchema(db);
    const { doc } = await readJson(request, 100_000);
    if (!doc || !doc.$id) throw new HttpError(400, "bad_import", "Ungültige Import-Daten.");
    const id = validId(`aw-${String(doc.$id).replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60)}`);
    const existing = await getProductRow(db, id);
    const before = existing ? JSON.parse(existing.data) : null;
    const sourceImage = String(doc.imageUrl || "");

    const product = cleanProduct({
        name: doc.name || doc.nameDe || doc.nameEn || doc.nameAr || "Mais Beauty",
        description: doc.description,
        nameAr: doc.nameAr, nameEn: doc.nameEn, nameDe: doc.nameDe,
        descriptionAr: doc.descriptionAr, descriptionEn: doc.descriptionEn, descriptionDe: doc.descriptionDe,
        priceUsdCents: doc.priceUsdCents,
        priceSyp: doc.priceSyp,
        discountPercent: doc.discountPercent || 0,
        category: doc.category,
        active: doc.active !== false,
        sortOrder: doc.sortOrder || 0
    }, before || {});
    product.importedFrom = sourceImage.slice(0, 500);

    let warning = "";
    if (before && before.importedFrom === sourceImage && imageIdFromUrl(before.imageUrl)) {
        product.imageUrl = before.imageUrl; /* photo already imported earlier */
    } else if (sourceImage.startsWith(`${appwriteEndpoint(env)}/`)) {
        try {
            const response = await fetch(sourceImage, { headers: { "X-Appwrite-Project": APPWRITE.project } });
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const stored = await storeImage(db, new Uint8Array(await response.arrayBuffer()));
            product.imageUrl = stored.url;
        } catch (error) {
            product.imageUrl = before?.imageUrl || "";
            warning = `Foto konnte nicht übernommen werden (${error.message || error}).`;
        }
    } else {
        product.imageUrl = safeImageUrl(sourceImage);
    }

    await writeProduct(db, id, product, user);
    await addLog(db, user, "import_product", `${product.name}${warning ? ` - ${warning}` : ""}`);
    return json({ id, name: product.name, image: Boolean(product.imageUrl), warning });
}
