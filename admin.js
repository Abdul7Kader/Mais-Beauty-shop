/**
 * Mais Beauty admin - talks to the Cloudflare Pages Function in functions/api/.
 * Login with a password only (secrets PASSWORD_<NAME> in Cloudflare); the session
 * is an HttpOnly cookie, so this script never sees a token. Every write sends the
 * X-Requested-With header the API requires.
 */

const API = "/api";
const CATEGORY_LABELS = {
    offers: "العروض · Angebote",
    serums: "سيرومات · Seren",
    masks: "ماسكات · Masken",
    eyes: "لزقات عين · Augenpads",
    creams: "كريمات · Cremes"
};
const ACTION_LABELS = {
    login: "تسجيل دخول · Anmeldung",
    product_create: "منتج جديد · Neues Produkt",
    product_update: "تعديل منتج · Produkt geändert",
    product_delete: "حذف منتج · Produkt gelöscht",
    settings_update: "تعديل الإعدادات · Einstellungen geändert",
    backup: "نسخة احتياطية · Sicherung erstellt",
    restore: "استعادة · Wiederhergestellt",
    import_start: "بدء الاستيراد · Import gestartet",
    import_product: "استيراد منتج · Produkt importiert"
};
const MAX_UPLOAD_BYTES = 1_800_000;

const state = {
    user: "",
    products: [],
    settings: {},
    editId: null,
    editImageUrl: "",
    pendingFile: null
};

const $ = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

class ApiError extends Error {
    constructor(message, status, code) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

async function api(path, { method = "GET", body, raw = null, type = "" } = {}) {
    const headers = { "X-Requested-With": "mais-admin", Accept: "application/json" };
    let payload;
    if (raw) {
        headers["Content-Type"] = type || "application/octet-stream";
        payload = raw;
    } else if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        payload = JSON.stringify(body);
    }
    let response;
    try {
        response = await fetch(`${API}${path}`, { method, headers, body: payload, credentials: "same-origin" });
    } catch (error) {
        throw new ApiError("لا يوجد اتصال بالإنترنت · Keine Verbindung. Bitte erneut versuchen.", 0, "offline");
    }
    let data = null;
    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }
    if (!response.ok) {
        if (response.status === 401 && path !== "/login" && path !== "/me") showLogin("انتهت الجلسة · Sitzung abgelaufen, bitte neu anmelden.");
        throw new ApiError(data?.message || `Fehler ${response.status}`, response.status, data?.error);
    }
    return data;
}

function showMsg(element, text, isError = false) {
    if (!element) return;
    element.textContent = text;
    element.classList.toggle("msg-error", isError);
    element.hidden = !text;
}

let toastTimer = null;
function toast(text) {
    const element = $("toast");
    element.textContent = text;
    element.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { element.hidden = true; }, 3500);
}

function formatUsd(cents) {
    return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function reducedCents(cents, discount) {
    return Math.round(Number(cents || 0) * (100 - Number(discount || 0)) / 100);
}

function formatTime(iso) {
    try {
        return new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
    } catch (error) {
        return iso || "";
    }
}

/* ------------------------------------------------------------------ */
/* Image compression (canvas): max 1200 px, WebP or JPEG              */
/* ------------------------------------------------------------------ */

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image")); };
        image.src = url;
    });
}

function canvasBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/* Shrinks until the photo fits the database row limit; never sends the raw camera file. */
async function compressImage(file) {
    const image = await loadImage(file);
    const attempts = [[1200, 0.82], [1000, 0.75], [800, 0.7], [640, 0.65]];
    for (const [maxSide, quality] of attempts) {
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        let blob = await canvasBlob(canvas, "image/webp", quality);
        if (!blob || blob.type !== "image/webp") blob = await canvasBlob(canvas, "image/jpeg", quality);
        if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob;
    }
    throw new Error("Das Foto ist auch verkleinert noch zu groß.");
}

async function uploadPhoto(file) {
    let blob;
    try {
        blob = await compressImage(file);
    } catch (error) {
        throw new ApiError("تعذر قراءة الصورة · Foto konnte nicht gelesen werden. Bitte ein JPG/PNG wählen.", 0, "image");
    }
    return api("/admin/images", { method: "POST", raw: blob, type: blob.type });
}

/* ------------------------------------------------------------------ */
/* Login                                                              */
/* ------------------------------------------------------------------ */

function showLogin(message = "") {
    $("admin-view").hidden = true;
    $("login-view").hidden = false;
    showMsg($("login-error"), message, true);
    $("login-password").value = "";
    $("login-password").focus();
}

async function showAdmin(user, setup) {
    state.user = user;
    $("current-user").textContent = user;
    $("login-view").hidden = true;
    $("admin-view").hidden = false;
    renderSetup(setup);
    if (setup?.database) {
        await Promise.all([loadCatalog(), loadLog()]);
    }
}

function renderSetup(setup) {
    const card = $("setup-card");
    if (!setup || setup.database) {
        card.hidden = true;
        return;
    }
    card.hidden = false;
    $("setup-text").textContent = "قاعدة البيانات غير مربوطة بعد. · Die Datenbank ist noch nicht verbunden: In Cloudflare unter Workers & Pages > mais-beauty-shop > Settings > Bindings eine D1-Datenbank mit dem Namen DB hinzufügen (für Production und Preview) und danach neu bereitstellen. Anleitung: docs/cloudflare-einrichten.md";
}

async function checkSession() {
    try {
        const data = await api("/me");
        await showAdmin(data.user, data.setup);
    } catch (error) {
        if (error.code === "login_required") showLogin("");
        else showLogin(error.message);
    }
}

async function login(event) {
    event.preventDefault();
    const button = $("login-btn");
    const password = $("login-password").value;
    if (!password) {
        showMsg($("login-error"), "أدخل كلمة السر · Bitte Passwort eingeben.", true);
        return;
    }
    button.disabled = true;
    showMsg($("login-error"), "");
    try {
        await api("/login", { method: "POST", body: { password } });
        const data = await api("/me");
        await showAdmin(data.user, data.setup);
    } catch (error) {
        const text = error.code === "wrong_password"
            ? "كلمة السر غير صحيحة · Falsches Passwort."
            : error.message;
        showMsg($("login-error"), text, true);
    } finally {
        button.disabled = false;
    }
}

async function logout() {
    try {
        await api("/logout", { method: "POST" });
    } finally {
        showLogin("");
    }
}

/* ------------------------------------------------------------------ */
/* Catalog + product list                                             */
/* ------------------------------------------------------------------ */

async function loadCatalog() {
    try {
        const data = await api("/admin/catalog");
        state.products = data.products || [];
        state.settings = data.settings || {};
        renderProducts();
        renderSettings();
    } catch (error) {
        if (error.code === "no_db") renderSetup({ database: false });
        else toast(error.message);
    }
}

function renderProducts() {
    const list = $("product-list");
    const filter = $("product-filter").value.trim().toLowerCase();
    $("product-count").textContent = String(state.products.length);
    const items = state.products.filter((product) => {
        if (!filter) return true;
        return [product.name, product.nameAr, product.nameEn, product.nameDe]
            .some((text) => String(text || "").toLowerCase().includes(filter));
    });
    if (!items.length) {
        list.innerHTML = `<li class="empty">${state.products.length
            ? "لا توجد نتائج · Keine Treffer"
            : "لا توجد منتجات بعد. أضف منتجاً أو استورد من Appwrite. · Noch keine Produkte: oben anlegen oder unten aus Appwrite importieren."}</li>`;
        return;
    }
    list.innerHTML = items.map((product) => {
        const discount = Number(product.discountPercent || 0);
        const price = discount
            ? `<b>${formatUsd(reducedCents(product.priceUsdCents, discount))}</b> <s>${formatUsd(product.priceUsdCents)}</s>`
            : `<b>${formatUsd(product.priceUsdCents)}</b>`;
        const hidden = product.active === false;
        return `
            <li class="product-item${hidden ? " is-hidden" : ""}" data-id="${escapeHtml(product.id)}">
                <div class="product-thumb">${product.imageUrl ? `<img src="${escapeHtml(product.imageUrl)}" alt="" loading="lazy">` : ""}</div>
                <div class="product-main">
                    <h3>${escapeHtml(product.nameAr || product.name)}</h3>
                    <div class="product-meta">
                        <span dir="ltr">${price}</span>
                        <span class="pill">${escapeHtml(CATEGORY_LABELS[product.category] || product.category)}</span>
                        ${discount ? `<span class="pill pill-sale" dir="ltr">-${discount}%</span>` : ""}
                        ${hidden ? `<span class="pill pill-hidden">مخفي · versteckt</span>` : ""}
                    </div>
                    ${product.updatedBy ? `<span class="muted small">${escapeHtml(product.updatedBy)} · ${escapeHtml(formatTime(product.updatedAt))}</span>` : ""}
                </div>
                <div class="product-actions">
                    <button type="button" class="btn btn-ghost btn-sm" data-edit>تعديل <span class="de">Bearbeiten</span></button>
                    <button type="button" class="btn btn-danger btn-sm" data-delete>حذف <span class="de">Löschen</span></button>
                </div>
            </li>
        `;
    }).join("");
    list.querySelectorAll(".product-thumb img").forEach((image) => {
        image.addEventListener("error", () => image.remove(), { once: true });
    });
}

function onListClick(event) {
    const item = event.target.closest(".product-item");
    if (!item) return;
    const product = state.products.find((entry) => entry.id === item.dataset.id);
    if (!product) return;
    if (event.target.closest("[data-edit]")) enterEditMode(product);
    if (event.target.closest("[data-delete]")) deleteProduct(product);
}

async function deleteProduct(product) {
    const name = product.nameAr || product.name;
    if (!window.confirm(`حذف "${name}"؟ لا يمكن التراجع.\nProdukt "${product.name}" wirklich löschen?`)) return;
    try {
        await api(`/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
        if (state.editId === product.id) exitEditMode();
        toast("تم الحذف · Gelöscht");
        await Promise.all([loadCatalog(), loadLog()]);
    } catch (error) {
        toast(error.message);
    }
}

/* ------------------------------------------------------------------ */
/* Product form                                                       */
/* ------------------------------------------------------------------ */

const FIELD_MAP = {
    "p-name": "name",
    "p-desc": "description",
    "p-name-ar": "nameAr",
    "p-desc-ar": "descriptionAr",
    "p-name-en": "nameEn",
    "p-desc-en": "descriptionEn",
    "p-name-de": "nameDe",
    "p-desc-de": "descriptionDe"
};

function setPreviewImage(url) {
    const preview = $("image-preview");
    preview.innerHTML = url
        ? `<img src="${escapeHtml(url)}" alt="">`
        : "<span>صورة<br><small>Foto</small></span>";
}

function readDiscount() {
    return Math.min(90, Math.max(0, Math.round(Number($("p-discount").value) || 0)));
}

function updateDiscountPreview() {
    const price = parseFloat($("p-price-usd").value);
    const discount = readDiscount();
    if (!Number.isFinite(price) || price <= 0) {
        $("p-discount-preview").textContent = "-";
        return;
    }
    const cents = Math.round(price * 100);
    $("p-discount-preview").textContent = discount
        ? `${formatUsd(reducedCents(cents, discount))}  (-${discount}%, بدلاً من ${formatUsd(cents)})`
        : `${formatUsd(cents)} (بدون خصم · kein Rabatt)`;
}

function enterEditMode(product) {
    state.editId = product.id;
    state.editImageUrl = product.imageUrl || "";
    state.pendingFile = null;
    Object.entries(FIELD_MAP).forEach(([id, field]) => { $(id).value = product[field] || ""; });
    $("p-price-usd").value = ((product.priceUsdCents || 0) / 100).toFixed(2);
    $("p-price-syp").value = product.priceSyp || "";
    $("p-discount").value = product.discountPercent || 0;
    $("p-category").value = CATEGORY_LABELS[product.category] ? product.category : "offers";
    $("p-sort-order").value = product.sortOrder ?? 0;
    $("p-active").checked = product.active !== false;
    $("p-image-file").value = "";
    $("lang-details").open = Boolean(product.nameAr || product.nameEn || product.nameDe);
    setPreviewImage(product.imageUrl);
    updateDiscountPreview();

    $("form-title").innerHTML = 'تعديل منتج <span class="de">Produkt bearbeiten</span>';
    $("edit-banner").textContent = `جاري تعديل · Du bearbeitest: ${product.nameAr || product.name}`;
    $("edit-banner").hidden = false;
    $("cancel-edit-btn").hidden = false;
    $("product-submit-btn").innerHTML = 'حفظ التعديلات <span class="de">Änderungen speichern</span>';
    showMsg($("product-msg"), "");
    $("product-form-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

function exitEditMode() {
    state.editId = null;
    state.editImageUrl = "";
    state.pendingFile = null;
    $("product-form").reset();
    $("p-active").checked = true;
    $("p-sort-order").value = 0;
    $("p-discount").value = 0;
    $("lang-details").open = false;
    setPreviewImage("");
    updateDiscountPreview();
    $("form-title").innerHTML = 'إضافة منتج جديد <span class="de">Neues Produkt</span>';
    $("edit-banner").hidden = true;
    $("cancel-edit-btn").hidden = true;
    $("product-submit-btn").innerHTML = 'إضافة المنتج <span class="de">Produkt speichern</span>';
}

function onFileChosen() {
    const file = $("p-image-file").files[0] || null;
    state.pendingFile = file;
    if (file) {
        const url = URL.createObjectURL(file);
        setPreviewImage(url);
    } else {
        setPreviewImage(state.editImageUrl);
    }
}

async function saveProduct(event) {
    event.preventDefault();
    const message = $("product-msg");
    const name = $("p-name").value.trim();
    const price = parseFloat($("p-price-usd").value);
    if (!name) {
        showMsg(message, "اسم المنتج مطلوب · Bitte einen Namen eingeben.", true);
        $("p-name").focus();
        return;
    }
    if (!Number.isFinite(price) || price < 0) {
        showMsg(message, "السعر غير صالح · Bitte einen gültigen Preis eingeben.", true);
        $("p-price-usd").focus();
        return;
    }
    if (!state.editId && !state.pendingFile && !window.confirm("بدون صورة؟ · Ohne Foto speichern?")) return;

    const button = $("product-submit-btn");
    button.disabled = true;
    showMsg(message, "جاري الحفظ... · Wird gespeichert...");
    try {
        let imageUrl = state.editImageUrl;
        if (state.pendingFile) {
            const uploaded = await uploadPhoto(state.pendingFile);
            imageUrl = uploaded.url;
        }
        const product = {
            priceUsdCents: Math.round(price * 100),
            priceSyp: parseInt($("p-price-syp").value, 10) || 0,
            discountPercent: readDiscount(),
            category: $("p-category").value,
            sortOrder: parseInt($("p-sort-order").value, 10) || 0,
            active: $("p-active").checked,
            imageUrl
        };
        Object.entries(FIELD_MAP).forEach(([id, field]) => { product[field] = $(id).value.trim(); });

        if (state.editId) {
            await api(`/admin/products/${encodeURIComponent(state.editId)}`, { method: "PUT", body: product });
            toast("تم حفظ التعديلات · Änderungen gespeichert");
        } else {
            await api("/admin/products", { method: "POST", body: product });
            toast("تمت إضافة المنتج · Produkt angelegt");
        }
        exitEditMode();
        showMsg(message, "");
        await Promise.all([loadCatalog(), loadLog()]);
    } catch (error) {
        showMsg(message, error.message, true);
    } finally {
        button.disabled = false;
    }
}

/* ------------------------------------------------------------------ */
/* Settings                                                           */
/* ------------------------------------------------------------------ */

function renderSettings() {
    $("s-whatsapp").value = state.settings.whatsappNumber || "";
    $("s-order-email").value = state.settings.orderEmail || "";
    $("s-contact-email").value = state.settings.contactEmail || "";
}

async function saveSettings(event) {
    event.preventDefault();
    const button = $("settings-btn");
    button.disabled = true;
    try {
        const data = await api("/admin/settings", {
            method: "PUT",
            body: {
                whatsappNumber: $("s-whatsapp").value,
                orderEmail: $("s-order-email").value,
                contactEmail: $("s-contact-email").value
            }
        });
        state.settings = data.settings;
        renderSettings();
        showMsg($("settings-msg"), "تم الحفظ · Gespeichert");
        loadLog();
    } catch (error) {
        showMsg($("settings-msg"), error.message, true);
    } finally {
        button.disabled = false;
    }
}

/* ------------------------------------------------------------------ */
/* Import from Appwrite                                               */
/* ------------------------------------------------------------------ */

async function runImport() {
    const button = $("import-btn");
    const log = $("import-log");
    const bar = $("import-bar");
    if (!window.confirm("استيراد كل المنتجات من Appwrite؟ · Alle Produkte aus Appwrite übernehmen?")) return;
    button.disabled = true;
    log.innerHTML = "";
    $("import-progress").hidden = false;
    bar.style.width = "0%";
    showMsg($("import-msg"), "جاري قراءة Appwrite... · Appwrite wird gelesen...");
    let done = 0;
    let warnings = 0;
    try {
        const list = await api("/admin/import/list", { method: "POST", body: {} });
        const total = list.products.length;
        if (!total) {
            showMsg($("import-msg"), "لا توجد منتجات في Appwrite · In Appwrite wurden keine Produkte gefunden.", true);
            return;
        }
        for (const item of list.products) {
            const entry = document.createElement("li");
            try {
                const result = await api("/admin/import/product", { method: "POST", body: { doc: item.doc } });
                entry.textContent = `✓ ${result.name}${result.warning ? ` - ${result.warning}` : ""}`;
                if (result.warning) {
                    entry.classList.add("is-warning");
                    warnings += 1;
                }
            } catch (error) {
                entry.textContent = `✗ ${item.name || item.sourceId}: ${error.message}`;
                entry.classList.add("is-warning");
                warnings += 1;
            }
            log.prepend(entry);
            done += 1;
            bar.style.width = `${Math.round((done / total) * 100)}%`;
            showMsg($("import-msg"), `${done} / ${total}`);
        }
        showMsg($("import-msg"),
            `تم استيراد ${done} منتج${list.settingsImported ? " والإعدادات" : ""} · ${done} Produkte übernommen${list.settingsImported ? ", Einstellungen auch" : ""}${warnings ? ` · ${warnings} Hinweise, siehe Liste` : ""}.`,
            warnings > 0);
    } catch (error) {
        showMsg($("import-msg"), error.message, true);
    } finally {
        button.disabled = false;
        await Promise.all([loadCatalog(), loadLog()]);
    }
}

/* ------------------------------------------------------------------ */
/* Backup + restore                                                   */
/* ------------------------------------------------------------------ */

async function downloadBackup() {
    const button = $("backup-btn");
    button.disabled = true;
    try {
        const data = await api("/admin/backup");
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `mais-beauty-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 2000);
        showMsg($("backup-msg"), `تم التنزيل · ${data.products.length} Produkte gesichert.`);
        loadLog();
    } catch (error) {
        showMsg($("backup-msg"), error.message, true);
    } finally {
        button.disabled = false;
    }
}

async function restoreBackup() {
    const input = $("restore-file");
    const file = input.files[0];
    input.value = "";
    if (!file) return;
    let data;
    try {
        data = JSON.parse(await file.text());
    } catch (error) {
        showMsg($("backup-msg"), "الملف غير صالح · Die Datei ist keine gültige Sicherung.", true);
        return;
    }
    const count = Array.isArray(data.products) ? data.products.length : 0;
    if (!window.confirm(`استبدال كل المنتجات الحالية بـ ${count} منتج من النسخة؟\nAlle aktuellen Produkte durch ${count} Produkte aus der Sicherung ersetzen?`)) return;
    try {
        const result = await api("/admin/restore", { method: "POST", body: data });
        showMsg($("backup-msg"), `تمت الاستعادة · ${result.products} Produkte wiederhergestellt.`);
        await Promise.all([loadCatalog(), loadLog()]);
    } catch (error) {
        showMsg($("backup-msg"), error.message, true);
    }
}

/* ------------------------------------------------------------------ */
/* Change log                                                         */
/* ------------------------------------------------------------------ */

async function loadLog() {
    try {
        const data = await api("/admin/log");
        const list = $("log-list");
        if (!data.log.length) {
            list.innerHTML = '<li class="empty">لا توجد تغييرات بعد · Noch keine Änderungen</li>';
            return;
        }
        list.innerHTML = data.log.map((entry) => `
            <li>
                <span><b>${escapeHtml(entry.user)}</b> · ${escapeHtml(ACTION_LABELS[entry.action] || entry.action)}</span>
                ${entry.detail ? `<span class="muted small">${escapeHtml(entry.detail)}</span>` : ""}
                <span class="log-time">${escapeHtml(formatTime(entry.at))}</span>
            </li>
        `).join("");
    } catch (error) {
        /* log is optional */
    }
}

/* ------------------------------------------------------------------ */
/* Wire up                                                            */
/* ------------------------------------------------------------------ */

function init() {
    $("login-form").addEventListener("submit", login);
    $("logout-btn").addEventListener("click", logout);
    $("product-form").addEventListener("submit", saveProduct);
    $("cancel-edit-btn").addEventListener("click", exitEditMode);
    $("p-image-file").addEventListener("change", onFileChosen);
    ["p-discount", "p-price-usd"].forEach((id) => $(id).addEventListener("input", updateDiscountPreview));
    $("product-list").addEventListener("click", onListClick);
    $("product-filter").addEventListener("input", renderProducts);
    $("settings-form").addEventListener("submit", saveSettings);
    $("import-btn").addEventListener("click", runImport);
    $("backup-btn").addEventListener("click", downloadBackup);
    $("restore-file").addEventListener("change", restoreBackup);
    $("log-refresh").addEventListener("click", loadLog);
    updateDiscountPreview();
    checkSession();
}

init();
