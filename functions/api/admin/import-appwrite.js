import {
    getDb, requireBucket, normalizeProduct, readSettings, writeSettings, IMAGE_TYPES,
    HttpError, json, errorResponse
} from "../../_shared/lib.js";

// Einmaliger Umzug: liest die öffentlich lesbaren Daten der alten Appwrite-Datenbank
// (ohne API-Schlüssel) und schreibt sie in D1 und R2.
// Wird vom Admin in Paketen aufgerufen (POST { offset }), damit jede Anfrage klein bleibt.
// Bereits vorhandene Produkte werden nicht überschrieben, der Import kann also gefahrlos wiederholt werden.

const DEFAULT_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
// Nur für lokale Tests überschreibbar (Variable APPWRITE_ENDPOINT); in Cloudflare nicht setzen.
let APPWRITE_ENDPOINT = DEFAULT_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = "6a0d8738002fb76a4caf";
const APPWRITE_DATABASE_ID = "mais_beauty_db";
const APPWRITE_BUCKET_ID = "product_images";
const BATCH_SIZE = 8;

async function appwriteGet(path, queries = []) {
    const url = new URL(APPWRITE_ENDPOINT + path);
    queries.forEach((query, index) => url.searchParams.set(`queries[${index}]`, JSON.stringify(query)));
    const response = await fetch(url, { headers: { "X-Appwrite-Project": APPWRITE_PROJECT_ID } });
    if (!response.ok) {
        throw new HttpError(502, `Appwrite antwortet mit ${response.status} für ${path}`);
    }
    return response.json();
}

async function importImage(bucket, fileId) {
    if (!fileId || !/^[A-Za-z0-9._-]{1,64}$/.test(fileId)) return { key: null, status: "ohne Bild" };

    const prefix = `produkte/appwrite-${fileId}.`;
    const existing = await bucket.list({ prefix, limit: 1 });
    if (existing.objects.length) return { key: existing.objects[0].key, status: "Bild vorhanden" };

    const url = `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
    const response = await fetch(url);
    if (!response.ok) return { key: null, status: `Bild fehlt (${response.status})` };

    const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const ext = IMAGE_TYPES[contentType];
    if (!ext) return { key: null, status: `kein Bildformat (${contentType})` };

    const key = prefix + ext;
    await bucket.put(key, await response.arrayBuffer(), { httpMetadata: { contentType } });
    return { key, status: "Bild kopiert" };
}

export async function onRequestPost({ request, env }) {
    try {
        APPWRITE_ENDPOINT = env.APPWRITE_ENDPOINT || DEFAULT_APPWRITE_ENDPOINT;
        const db = await getDb(env);
        const bucket = requireBucket(env);
        const body = await request.json().catch(() => ({}));
        const offset = Math.max(0, Number.parseInt(body.offset, 10) || 0);
        const log = [];

        // Einstellungen nur beim ersten Paket und nur, wenn noch keine eingetragen sind
        if (offset === 0) {
            const current = await readSettings(db);
            if (!current.whatsappNumber && !current.orderEmail && !current.contactEmail) {
                try {
                    const old = await appwriteGet(`/databases/${APPWRITE_DATABASE_ID}/collections/shop_settings/documents/main`);
                    await writeSettings(db, old);
                    log.push("Shop-Einstellungen übernommen");
                } catch (error) {
                    log.push("Shop-Einstellungen nicht übernommen: " + error.message);
                }
            } else {
                log.push("Shop-Einstellungen schon vorhanden, nicht überschrieben");
            }
        }

        const page = await appwriteGet(`/databases/${APPWRITE_DATABASE_ID}/collections/products/documents`, [
            { method: "limit", values: [BATCH_SIZE] },
            { method: "offset", values: [offset] }
        ]);
        const documents = page.documents || [];

        const insert = db.prepare(`INSERT INTO products (
                id, name, description, nameAr, descriptionAr, nameEn, descriptionEn, nameDe, descriptionDe,
                priceUsdCents, priceSyp, category, sortOrder, active, imageKey, createdAt, updatedAt
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)
            ON CONFLICT(id) DO NOTHING`);

        let imported = 0;
        let skipped = 0;
        for (const doc of documents) {
            const id = String(doc.$id || "");
            if (!/^[A-Za-z0-9._-]{1,64}$/.test(id)) {
                log.push(`Übersprungen (ungültige ID): ${doc.name || "?"}`);
                skipped++;
                continue;
            }
            const exists = await db.prepare("SELECT id FROM products WHERE id = ?1").bind(id).first();
            if (exists) {
                log.push(`Schon vorhanden: ${doc.name}`);
                skipped++;
                continue;
            }

            let product;
            try {
                product = normalizeProduct({ ...doc, active: doc.active !== false });
            } catch (error) {
                log.push(`Übersprungen (${error.message}): ${id}`);
                skipped++;
                continue;
            }
            const image = await importImage(bucket, doc.imageFileId);
            const now = new Date().toISOString();
            await insert.bind(
                id, product.name, product.description, product.nameAr, product.descriptionAr,
                product.nameEn, product.descriptionEn, product.nameDe, product.descriptionDe,
                product.priceUsdCents, product.priceSyp, product.category, product.sortOrder,
                product.active, image.key, doc.$createdAt || now, doc.$updatedAt || now
            ).run();
            log.push(`Übernommen: ${product.name} (${image.status})`);
            imported++;
        }

        const total = Number(page.total) || 0;
        const nextOffset = offset + documents.length;
        return json({
            imported,
            skipped,
            total,
            nextOffset,
            done: documents.length === 0 || nextOffset >= total,
            log
        });
    } catch (error) {
        return errorResponse(error);
    }
}
