import { checkPassword, sessionCookie, json, errorResponse } from "../../_shared/lib.js";

export async function onRequestPost({ request, env }) {
    try {
        const body = await request.json().catch(() => ({}));
        if (!(await checkPassword(env, body.password))) {
            return json({ error: "Passwort falsch." }, 401);
        }
        return json({ ok: true }, 200, { "set-cookie": await sessionCookie(env, request) });
    } catch (error) {
        return errorResponse(error);
    }
}
