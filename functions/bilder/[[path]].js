import { requireBucket, errorResponse } from "../_shared/lib.js";

// Liefert Produktfotos aus dem R2-Bucket aus: /bilder/produkte/<datei>
export async function onRequestGet({ request, env, params }) {
    try {
        const bucket = requireBucket(env);
        const key = (Array.isArray(params.path) ? params.path : [params.path]).join("/");
        if (!key || key.includes("..")) return new Response("Nicht gefunden", { status: 404 });

        const object = await bucket.get(key, { onlyIf: request.headers });
        if (!object) return new Response("Nicht gefunden", { status: 404 });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        // Dateinamen sind eindeutig und werden nie überschrieben → lange cachen
        headers.set("cache-control", "public, max-age=31536000, immutable");
        headers.set("x-content-type-options", "nosniff");

        if (!("body" in object) || !object.body) {
            return new Response(null, { status: 304, headers });
        }
        return new Response(object.body, { headers });
    } catch (error) {
        return errorResponse(error);
    }
}
