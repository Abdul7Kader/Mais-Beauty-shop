/**
 * Komprimiert ein Bild clientseitig per Canvas API.
 * Max. 1200x1200px, Qualität ~0.80, WebP wenn möglich sonst JPEG.
 * @param {File} file - Das Originalbild
 * @returns {Promise<Blob>} - Das komprimierte Blob
 */
async function compressImage(file) {
    return new Promise((resolve) => {
        const MAX_SIZE = 1200;
        const QUALITY = 0.80;

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;
            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) {
                    height = Math.round((height / width) * MAX_SIZE);
                    width = MAX_SIZE;
                } else {
                    width = Math.round((width / height) * MAX_SIZE);
                    height = MAX_SIZE;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // WebP versuchen
            canvas.toBlob((webpBlob) => {
                if (webpBlob && webpBlob.size < file.size) {
                    // WebP erfolgreich und kleiner als Original
                    const baseName = file.name.replace(/\.[^.]+$/, '');
                    const compressedFile = new File([webpBlob], `${baseName}.webp`, { type: 'image/webp' });
                    console.log(`[Kompression] Original: ${(file.size / 1024).toFixed(1)} KB -> Komprimiert (WebP): ${(webpBlob.size / 1024).toFixed(1)} KB`);
                    resolve(compressedFile);
                } else {
                    // WebP fehlgeschlagen oder nicht kleiner -> JPEG Fallback
                    canvas.toBlob((jpegBlob) => {
                        // Formate, die der Server nicht annimmt (z. B. HEIC), immer als JPEG speichern
                        const originalAllowed = ['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif'].includes(file.type);
                        if (jpegBlob && (jpegBlob.size < file.size || !originalAllowed)) {
                            const baseName = file.name.replace(/\.[^.]+$/, '');
                            const compressedFile = new File([jpegBlob], `${baseName}.jpg`, { type: 'image/jpeg' });
                            console.log(`[Kompression] Original: ${(file.size / 1024).toFixed(1)} KB -> Komprimiert (JPEG): ${(jpegBlob.size / 1024).toFixed(1)} KB`);
                            resolve(compressedFile);
                        } else {
                            // Kompression lohnt sich nicht oder fehlgeschlagen -> Original verwenden
                            console.log(`[Kompression] Original beibehalten (${(file.size / 1024).toFixed(1)} KB) - keine Verbesserung durch Kompression.`);
                            resolve(file);
                        }
                    }, 'image/jpeg', QUALITY);
                }
            }, 'image/webp', QUALITY);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            console.warn('[Kompression] Bild konnte nicht geladen werden, verwende Original.');
            resolve(file);
        };

        img.src = objectUrl;
    });
}

// Admin-Schnittstellen in Cloudflare (functions/api/admin/*)
async function api(path, options = {}) {
    const response = await fetch(path, {
        credentials: 'same-origin',
        ...options,
        headers: { accept: 'application/json', ...(options.headers || {}) }
    });
    let data = {};
    try {
        data = await response.json();
    } catch (parseError) {
        data = {};
    }
    if (!response.ok) {
        const error = new Error(data.error || `Fehler ${response.status}`);
        error.status = response.status;
        throw error;
    }
    return data;
}

function sendJson(path, method, body) {
    return api(path, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    });
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');
    const productCount = document.getElementById('product-count');
    const formTitle = document.getElementById('form-title');
    const editBanner = document.getElementById('edit-mode-banner');
    const submitBtn = document.getElementById('form-submit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const categorySelect = document.getElementById('p-category');
    const shopSettingsForm = document.getElementById('shop-settings-form');
    const whatsappNumberInput = document.getElementById('shop-whatsapp-number');
    const orderEmailInput = document.getElementById('shop-order-email');
    const contactEmailInput = document.getElementById('shop-contact-email');
    const saveShopSettingsBtn = document.getElementById('save-shop-settings-btn');
    const importBtn = document.getElementById('import-appwrite-btn');
    const importLog = document.getElementById('import-log');
    const validCategories = ['offers', 'serums', 'masks', 'eyes', 'creams'];

    // State: welches Produkt wird gerade bearbeitet (null = neues Produkt)
    let editProductId = null;
    let products = [];

    // Admin-Anmeldung (Passwort aus dem Cloudflare-Secret ADMIN_PASSWORD)
    const loginContainer = document.getElementById('login-container');
    const adminContent = document.getElementById('admin-content');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const setupHint = document.getElementById('setup-hint');
    const passInput = document.getElementById('admin-password');
    const logoutBtn = document.getElementById('logout-btn');

    function showLogin(message) {
        loginContainer.style.display = 'block';
        adminContent.style.display = 'none';
        if (message) {
            loginError.style.display = 'block';
            loginError.textContent = message;
        }
    }

    function showAdmin() {
        loginContainer.style.display = 'none';
        adminContent.style.display = 'block';
        loadShopSettings();
        fetchAdminProducts();
    }

    function handleApiError(error, fallbackText) {
        console.error(error);
        if (error.status === 401) {
            showLogin('انتهت الجلسة، الرجاء تسجيل الدخول من جديد. (Sitzung abgelaufen)');
            return;
        }
        alert(`${fallbackText}\n${error.message}`);
    }

    async function checkAuthState() {
        try {
            const state = await api('/api/admin/me');
            const missing = [];
            if (!state.passwordConfigured) missing.push('Secret ADMIN_PASSWORD');
            if (!state.databaseConfigured) missing.push('D1-Binding DB');
            if (!state.imagesConfigured) missing.push('R2-Binding BILDER');
            if (missing.length) {
                setupHint.style.display = 'block';
                setupHint.textContent = `Einrichtung in Cloudflare unvollständig, es fehlt: ${missing.join(', ')}`;
            } else {
                setupHint.style.display = 'none';
            }
            if (state.loggedIn) showAdmin();
            else showLogin();
        } catch (error) {
            console.error(error);
            showLogin('الخادم غير متاح. (Server nicht erreichbar)');
        }
    }

    async function attemptLogin() {
        loginBtn.textContent = 'جاري التحقق...';
        loginBtn.disabled = true;
        try {
            await sendJson('/api/admin/login', 'POST', { password: passInput.value });
            loginError.style.display = 'none';
            passInput.value = '';
            showAdmin();
        } catch (error) {
            loginError.style.display = 'block';
            loginError.textContent = error.status === 401
                ? 'كلمة السر غير صحيحة. (Passwort falsch)'
                : error.message;
        } finally {
            loginBtn.textContent = 'دخول';
            loginBtn.disabled = false;
        }
    }

    loginBtn.addEventListener('click', attemptLogin);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await api('/api/admin/logout', { method: 'POST' });
        } catch (error) {
            console.error(error);
        }
        showLogin();
    });

    // Bearbeitungsmodus aktivieren
    function enterEditMode(product) {
        editProductId = product.id;

        document.getElementById('p-name').value = product.name || '';
        document.getElementById('p-desc').value = product.description || '';
        document.getElementById('p-name-ar').value = product.nameAr || '';
        document.getElementById('p-desc-ar').value = product.descriptionAr || '';
        document.getElementById('p-name-en').value = product.nameEn || '';
        document.getElementById('p-desc-en').value = product.descriptionEn || '';
        document.getElementById('p-name-de').value = product.nameDe || '';
        document.getElementById('p-desc-de').value = product.descriptionDe || '';
        document.getElementById('p-price-usd').value = ((product.priceUsdCents || 0) / 100).toFixed(2);
        document.getElementById('p-price-syp').value = product.priceSyp || 0;
        document.getElementById('p-sort-order').value = product.sortOrder ?? 0;
        categorySelect.value = validCategories.includes(product.category) ? product.category : 'offers';
        document.getElementById('p-active').checked = product.active !== false;
        document.getElementById('p-image-file').value = '';

        formTitle.textContent = 'تعديل منتج';
        editBanner.style.display = 'block';
        editBanner.textContent = `جاري تعديل: ${product.name}`;
        submitBtn.textContent = 'حفظ التعديلات';
        cancelBtn.style.display = 'block';

        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Bearbeitungsmodus beenden
    function exitEditMode() {
        editProductId = null;
        form.reset();
        document.getElementById('p-active').checked = true;
        document.getElementById('p-sort-order').value = 0;
        categorySelect.value = 'offers';
        formTitle.textContent = 'إضافة منتج جديد';
        editBanner.style.display = 'none';
        editBanner.textContent = '';
        submitBtn.textContent = 'إضافة المنتج';
        cancelBtn.style.display = 'none';
    }

    cancelBtn.addEventListener('click', exitEditMode);

    // Shop-Einstellungen
    async function loadShopSettings() {
        try {
            const settings = await api('/api/admin/settings');
            whatsappNumberInput.value = settings.whatsappNumber || '';
            orderEmailInput.value = settings.orderEmail || '';
            contactEmailInput.value = settings.contactEmail || '';
        } catch (error) {
            handleApiError(error, 'Shop Settings konnten nicht geladen werden.');
        }
    }

    shopSettingsForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        saveShopSettingsBtn.disabled = true;
        try {
            const settings = await sendJson('/api/admin/settings', 'PUT', {
                whatsappNumber: whatsappNumberInput.value,
                orderEmail: orderEmailInput.value,
                contactEmail: contactEmailInput.value
            });
            whatsappNumberInput.value = settings.whatsappNumber || '';
            orderEmailInput.value = settings.orderEmail || '';
            contactEmailInput.value = settings.contactEmail || '';
            alert('Shop Settings gespeichert.');
        } catch (error) {
            handleApiError(error, 'Shop Settings konnten nicht gespeichert werden.');
        } finally {
            saveShopSettingsBtn.disabled = false;
        }
    });

    // Produkte laden
    async function fetchAdminProducts() {
        try {
            const response = await api('/api/admin/products');
            products = response.products || [];
            renderAdminProducts();
        } catch (error) {
            handleApiError(error, 'Produkte konnten nicht geladen werden.');
        }
    }

    function renderAdminProducts() {
        productList.innerHTML = '';
        productCount.textContent = products.length;

        if (products.length === 0) {
            productList.innerHTML = '<p style="text-align:center; color:#888;">لا يوجد منتجات مضافة بعد.</p>';
            return;
        }

        // Neueste zuerst
        [...products].reverse().forEach((p) => {
            const div = document.createElement('div');
            div.className = 'product-item';

            const activeLabel = p.active !== false ? '✅ نشط' : '❌ مخفي';
            const categoryLabel = validCategories.includes(p.category) ? p.category : 'offers';

            div.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <img src="${escapeHtml(p.imageUrl)}" alt="Product Image" onerror="this.onerror=null;this.style.display='none';">
                    <div class="product-info">
                        <h3>${escapeHtml(p.name)}</h3>
                        <p>$${((p.priceUsdCents || 0) / 100).toFixed(2)} | SYP ${escapeHtml(p.priceSyp)} | Kategorie: ${categoryLabel} | Sortierung: ${escapeHtml(p.sortOrder ?? 0)} | ${activeLabel}</p>
                    </div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-edit" type="button" data-edit>تعديل</button>
                    <button class="btn btn-danger" type="button" data-delete>حذف</button>
                </div>
            `;

            div.querySelector('[data-edit]').addEventListener('click', () => enterEditMode(p));
            div.querySelector('[data-delete]').addEventListener('click', () => deleteProduct(p.id));

            productList.appendChild(div);
        });
    }

    // Produkt anlegen oder bearbeiten
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('p-name').value.trim();
        if (!name) { alert('الاسم لا يمكن أن يكون فارغاً.'); return; }

        const priceUSD = parseFloat(document.getElementById('p-price-usd').value);
        if (isNaN(priceUSD) || priceUSD < 0) { alert('السعر بالدولار غير صالح.'); return; }

        const file = document.getElementById('p-image-file').files[0] || null;
        if (!editProductId && !file) {
            alert('الرجاء اختار صورة!');
            return;
        }

        const data = new FormData();
        data.set('name', name);
        data.set('description', document.getElementById('p-desc').value.trim());
        data.set('nameAr', document.getElementById('p-name-ar').value.trim());
        data.set('descriptionAr', document.getElementById('p-desc-ar').value.trim());
        data.set('nameEn', document.getElementById('p-name-en').value.trim());
        data.set('descriptionEn', document.getElementById('p-desc-en').value.trim());
        data.set('nameDe', document.getElementById('p-name-de').value.trim());
        data.set('descriptionDe', document.getElementById('p-desc-de').value.trim());
        data.set('priceUsdCents', String(Math.round(priceUSD * 100)));
        data.set('priceSyp', String(parseInt(document.getElementById('p-price-syp').value, 10) || 0));
        data.set('sortOrder', String(parseInt(document.getElementById('p-sort-order').value, 10) || 0));
        data.set('category', validCategories.includes(categorySelect.value) ? categorySelect.value : 'offers');
        data.set('active', document.getElementById('p-active').checked ? 'true' : 'false');

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري... يُرجى الانتظار';

        try {
            if (file) {
                const compressedFile = await compressImage(file);
                data.set('image', compressedFile, compressedFile.name);
            }

            if (editProductId) {
                await api(`/api/admin/products/${encodeURIComponent(editProductId)}`, { method: 'PUT', body: data });
                exitEditMode();
                alert('تم تحديث المنتج بنجاح!');
            } else {
                await api('/api/admin/products', { method: 'POST', body: data });
                exitEditMode();
                alert('تم إضافة المنتج بنجاح!');
            }
            await fetchAdminProducts();
        } catch (error) {
            handleApiError(error, 'حدث خطأ أثناء الحفظ. (Fehler beim Speichern)');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Produkt löschen
    async function deleteProduct(id) {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذه الخطوة!')) return;
        if (editProductId === id) exitEditMode();
        try {
            await api(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
            await fetchAdminProducts();
        } catch (error) {
            handleApiError(error, 'حدث خطأ أثناء الحذف.');
        }
    }

    // Einmaliger Umzug der alten Appwrite-Daten nach Cloudflare
    importBtn.addEventListener('click', async () => {
        if (!confirm('Produkte, Fotos und Shop-Einstellungen aus Appwrite übernehmen? Bereits vorhandene Produkte bleiben unverändert.')) return;
        importBtn.disabled = true;
        importLog.style.display = 'block';
        importLog.textContent = 'Import läuft …\n';
        let offset = 0;
        let imported = 0;
        let skipped = 0;
        try {
            for (let round = 0; round < 100; round++) {
                const result = await sendJson('/api/admin/import-appwrite', 'POST', { offset });
                imported += result.imported;
                skipped += result.skipped;
                importLog.textContent += result.log.join('\n') + '\n';
                importLog.scrollTop = importLog.scrollHeight;
                if (result.done) break;
                offset = result.nextOffset;
            }
            importLog.textContent += `\nFertig: ${imported} übernommen, ${skipped} übersprungen.`;
            await Promise.all([loadShopSettings(), fetchAdminProducts()]);
        } catch (error) {
            importLog.textContent += `\nAbgebrochen: ${error.message}\nDer Import kann gefahrlos noch einmal gestartet werden.`;
            if (error.status === 401) handleApiError(error, '');
        } finally {
            importBtn.disabled = false;
        }
    });

    checkAuthState();
});
