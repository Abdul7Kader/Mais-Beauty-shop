import { getDb, rowToProduct, json, errorResponse } from "../_shared/lib.js";

// Öffentlich: alle aktiven Produkte für den Shop
export async function onRequestGet({ env }) {
    try {
        const db = await getDb(env);
        const { results } = await db
            .prepare("SELECT * FROM products WHERE active = 1 ORDER BY sortOrder ASC, createdAt ASC")
            .all();
        return json({ products: results.map(rowToProduct) }, 200, {
            "cache-control": "public, max-age=0, s-maxage=30"
        });
    } catch (error) {
        return errorResponse(error);
    }
}
