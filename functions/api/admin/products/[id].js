import {
    getDb, requireBucket, normalizeProduct, rowToProduct, storeImage, deleteImage,
    HttpError, json, errorResponse
} from "../../../_shared/lib.js";

async function findProduct(db, id) {
    const row = await db.prepare("SELECT * FROM products WHERE id = ?1").bind(id).first();
    if (!row) throw new HttpError(404, "Produkt nicht gefunden.");
    return row;
}

// Admin: Produkt bearbeiten, optional mit neuem Foto (multipart/form-data)
export async function onRequestPut({ request, env, params }) {
    let newKey = null;
    const bucket = env.BILDER;
    try {
        const db = await getDb(env);
        const existing = await findProduct(db, params.id);
        const form = await request.formData();
        const product = normalizeProduct(Object.fromEntries(form));

        const file = form.get("image");
        if (file && typeof file !== "string" && file.size) {
            newKey = await storeImage(requireBucket(env), file);
        }

        await db.prepare(`UPDATE products SET
                name = ?2, description = ?3, nameAr = ?4, descriptionAr = ?5, nameEn = ?6, descriptionEn = ?7,
                nameDe = ?8, descriptionDe = ?9, priceUsdCents = ?10, priceSyp = ?11, category = ?12,
                sortOrder = ?13, active = ?14, imageKey = ?15, updatedAt = ?16
            WHERE id = ?1`)
            .bind(
                params.id, product.name, product.description, product.nameAr, product.descriptionAr,
                product.nameEn, product.descriptionEn, product.nameDe, product.descriptionDe,
                product.priceUsdCents, product.priceSyp, product.category, product.sortOrder,
                product.active, newKey || existing.imageKey, new Date().toISOString()
            )
            .run();

        // Altes Foto erst nach erfolgreichem Speichern löschen
        if (newKey && existing.imageKey) await deleteImage(bucket, existing.imageKey);

        return json({ product: rowToProduct(await findProduct(db, params.id)) });
    } catch (error) {
        if (newKey) await deleteImage(bucket, newKey);
        return errorResponse(error);
    }
}

// Admin: Produkt und sein Foto löschen
export async function onRequestDelete({ env, params }) {
    try {
        const db = await getDb(env);
        const existing = await findProduct(db, params.id);
        await db.prepare("DELETE FROM products WHERE id = ?1").bind(params.id).run();
        if (existing.imageKey && env.BILDER) await deleteImage(env.BILDER, existing.imageKey);
        return json({ ok: true });
    } catch (error) {
        return errorResponse(error);
    }
}
