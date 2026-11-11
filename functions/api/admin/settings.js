import { getDb, readSettings, writeSettings, json, errorResponse } from "../../_shared/lib.js";

export async function onRequestGet({ env }) {
    try {
        return json(await readSettings(await getDb(env)));
    } catch (error) {
        return errorResponse(error);
    }
}

export async function onRequestPut({ request, env }) {
    try {
        const db = await getDb(env);
        const body = await request.json().catch(() => ({}));
        return json(await writeSettings(db, body));
    } catch (error) {
        return errorResponse(error);
    }
}
