import { getDb, readSettings, json, errorResponse } from "../_shared/lib.js";

// Öffentlich: WhatsApp-Nummer und E-Mail-Adressen für Bestellung und Kontakt
export async function onRequestGet({ env }) {
    try {
        const db = await getDb(env);
        return json(await readSettings(db), 200, {
            "cache-control": "public, max-age=0, s-maxage=30"
        });
    } catch (error) {
        return errorResponse(error);
    }
}
