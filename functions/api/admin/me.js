import { isLoggedIn, json } from "../../_shared/lib.js";

export async function onRequestGet({ request, env }) {
    return json({
        loggedIn: await isLoggedIn(env, request),
        passwordConfigured: Boolean(env.ADMIN_PASSWORD),
        databaseConfigured: Boolean(env.DB),
        imagesConfigured: Boolean(env.BILDER)
    });
}
