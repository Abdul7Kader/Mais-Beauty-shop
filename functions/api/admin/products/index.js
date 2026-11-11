import {
    getDb, requireBucket, normalizeProduct, rowToProduct, storeImage, deleteImage,
    HttpError, json, errorResponse
} from "../../../_shared/lib.js";

// Admin: alle Produkte (auch ausgeblendete)
export async function onRequestGet({ env }) {
    try {
        const db = await getDb(env);
        const { results } = await db
            .prepare("SELECT * FROM products ORDER BY sortOrder ASC, createdAt ASC")
            .all();
        return json({ products: results.map(rowToProduct) });
    } catch (error) {
        return errorResponse(error);
    }
}

// Admin: neues Produkt mit Foto anlegen (multipart/form-data)
export async function onRequestPost({ request, env }) {
    let imageKey = null;
    const bucket = env.BILDER;
    try {
        const db = await getDb(env);
        requireBucket(env);
        const form = await request.formData();
        const product = normalizeProduct(Object.fromEntries(form));
        imageKey = await storeImage(bucket, form.get("image"));
        if (!imageKey) throw new HttpError(400, "Bitte ein Foto auswählen.");

        const id = crypto.randomUUID().replace(/-/g, "");
        const now = new Date().toISOString();
        await db.prepare(`INSERT INTO products (
                id, name, description, nameAr, descriptionAr, nameEn, descriptionEn, nameDe, descriptionDe,
                priceUsdCents, priceSyp, category, sortOrder, active, imageKey, createdAt, updatedAt
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?16)`)
            .bind(
                id, product.name, product.description, product.nameAr, product.descriptionAr,
                product.nameEn, product.descriptionEn, product.nameDe, product.descriptionDe,
                product.priceUsdCents, product.priceSyp, product.category, product.sortOrder,
                product.active, imageKey, now
            )
            .run();

        const row = await db.prepare("SELECT * FROM products WHERE id = ?1").bind(id).first();
        return json({ product: rowToProduct(row) }, 201);
    } catch (error) {
        if (imageKey) await deleteImage(bucket, imageKey);
        return errorResponse(error);
    }
}
