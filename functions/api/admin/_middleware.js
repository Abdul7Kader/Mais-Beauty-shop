import { isLoggedIn, checkSameOrigin, json, errorResponse } from "../../_shared/lib.js";

const PUBLIC_PATHS = ["/api/admin/login", "/api/admin/me"];

// Alle Admin-Schnittstellen nur mit gültiger Anmeldung
export async function onRequest(context) {
    try {
        checkSameOrigin(context.request);
        const path = new URL(context.request.url).pathname.replace(/\/$/, "");
        if (!PUBLIC_PATHS.includes(path) && !(await isLoggedIn(context.env, context.request))) {
            return json({ error: "Nicht angemeldet." }, 401);
        }
        return await context.next();
    } catch (error) {
        return errorResponse(error);
    }
}
