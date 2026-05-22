import { Client, Account, Databases, Storage, ID, Query } from "https://cdn.jsdelivr.net/npm/appwrite@17.0.0/+esm";

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
                        if (jpegBlob && jpegBlob.size < file.size) {
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

// Appwrite Setup
const appwriteClient = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a0d8738002fb76a4caf');
const account = new Account(appwriteClient);
const databases = new Databases(appwriteClient);
const appwriteStorage = new Storage(appwriteClient);

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
    const validCategories = ['offers', 'serums', 'masks', 'eyes', 'creams'];

    // State: welches Produkt wird gerade bearbeitet (null = neues Produkt)
    let editProductId = null;
    let editProductOldImageFileId = null;

    // Admin Login Logic (Appwrite Auth)
    const loginContainer = document.getElementById('login-container');
    const adminContent = document.getElementById('admin-content');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const emailInput = document.getElementById('admin-email');
    const passInput = document.getElementById('admin-password');
    const logoutBtn = document.getElementById('logout-btn');

    function attemptLogin() {
        const email = emailInput.value;
        const pass = passInput.value;
        
        loginBtn.textContent = 'جاري التحقق...';
        loginBtn.disabled = true;

        account.createEmailPasswordSession(email, pass)
            .then((session) => {
                loginError.style.display = 'none';
                checkAuthState(); // Appwrite doesn't have an auth state listener, so we trigger manual check
            })
            .catch((error) => {
                loginError.style.display = 'block';
                loginError.textContent = 'بيانات الدخول غير صحيحة أو الحساب غير موجود.';
                console.error(error);
            })
            .finally(() => {
                loginBtn.textContent = 'دخول';
                loginBtn.disabled = false;
            });
    }

    loginBtn.addEventListener('click', attemptLogin);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    logoutBtn.addEventListener('click', () => {
        account.deleteSession('current')
            .then(() => checkAuthState())
            .catch(console.error);
    });

    // Check Auth State manually for Appwrite
    function checkAuthState() {
        account.get()
            .then((user) => {
                loginContainer.style.display = 'none';
                adminContent.style.display = 'block';
            })
            .catch((err) => {
                // Not logged in
                loginContainer.style.display = 'block';
                adminContent.style.display = 'none';
            });
    }

    // Bearbeitungsmodus aktivieren
    function enterEditMode(product) {
        editProductId = product.id;
        editProductOldImageFileId = product.imageFileId || null;

        // Formular befüllen
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
        document.getElementById('p-image-file').value = ''; // Zurücksetzen

        // UI umschalten
        formTitle.textContent = 'تعديل منتج';
        editBanner.style.display = 'block';
        editBanner.textContent = `جاري تعديل: ${product.name}`;
        submitBtn.textContent = 'حفظ التعديلات';
        cancelBtn.style.display = 'block';

        // Zum Formular scrollen
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Bearbeitungsmodus beenden
    function exitEditMode() {
        editProductId = null;
        editProductOldImageFileId = null;
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

    // Initial check on load
    checkAuthState();

    async function loadShopSettings() {
        try {
            const settings = await databases.getDocument('mais_beauty_db', 'shop_settings', 'main');
            whatsappNumberInput.value = settings.whatsappNumber || '';
            orderEmailInput.value = settings.orderEmail || '';
            contactEmailInput.value = settings.contactEmail || '';
        } catch (error) {
            if (error.code === 404) {
                try {
                    await databases.createDocument('mais_beauty_db', 'shop_settings', 'main', {
                        whatsappNumber: '',
                        orderEmail: '',
                        contactEmail: ''
                    });
                    whatsappNumberInput.value = '';
                    orderEmailInput.value = '';
                    contactEmailInput.value = '';
                    return;
                } catch (createError) {
                    console.error('Error creating shop settings:', createError);
                }
            }

            console.error('Error fetching shop settings:', error);
        }
    }

    shopSettingsForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const whatsappNumber = whatsappNumberInput.value.trim().replace(/\s+/g, '').replace(/^\+/, '');
        const orderEmail = orderEmailInput.value.trim();
        const contactEmail = contactEmailInput.value.trim();
        saveShopSettingsBtn.disabled = true;

        try {
            const settings = await databases.updateDocument('mais_beauty_db', 'shop_settings', 'main', {
                whatsappNumber,
                orderEmail,
                contactEmail
            });
            whatsappNumberInput.value = settings.whatsappNumber || '';
            orderEmailInput.value = settings.orderEmail || '';
            contactEmailInput.value = settings.contactEmail || '';
            alert('Shop Settings gespeichert.');
        } catch (error) {
            console.error('Error saving shop settings:', error);
            alert('Shop Settings konnten nicht gespeichert werden.');
        } finally {
            saveShopSettingsBtn.disabled = false;
        }
    });

    loadShopSettings();

    // Fetch products from Appwrite
    let products = [];

    async function fetchAdminProducts() {
        try {
            const response = await databases.listDocuments('mais_beauty_db', 'products', [
                Query.limit(100),
                Query.orderAsc('sortOrder')
            ]);
            products = response.documents.map(doc => ({ id: doc.$id, ...doc }));
            renderAdminProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }
    
    // Listen to Realtime updates
    appwriteClient.subscribe('databases.mais_beauty_db.collections.products.documents', response => {
        if (response.events.includes('databases.*.collections.*.documents.*.create') ||
            response.events.includes('databases.*.collections.*.documents.*.update') ||
            response.events.includes('databases.*.collections.*.documents.*.delete')) {
            fetchAdminProducts();
        }
    });

    // initial fetch
    fetchAdminProducts();

    // Render existing products
    function renderAdminProducts() {
        productList.innerHTML = '';
        productCount.textContent = products.length;

        if (products.length === 0) {
            productList.innerHTML = '<p style="text-align:center; color:#888;">\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0646\u062a\u062c\u0627\u062a \u0645\u0636\u0627\u0641\u0629 \u0628\u0639\u062f.</p>';
            return;
        }

        // Reverse array to show newest first
        [...products].reverse().forEach((p) => {
            const div = document.createElement('div');
            div.className = 'product-item';

            const activeLabel = p.active !== false ? '\u2705 \u0646\u0634\u0637' : '\u274C \u0645\u062e\u0641\u064a';
            const categoryLabel = validCategories.includes(p.category) ? p.category : 'offers';

            div.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <img src="${p.imageUrl}" alt="Product Image" onerror="this.onerror=null;this.style.display='none';">
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <p>$${((p.priceUsdCents || 0) / 100).toFixed(2)} | SYP ${p.priceSyp} | Kategorie: ${categoryLabel} | Sortierung: ${p.sortOrder ?? 0} | ${activeLabel}</p>
                    </div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-edit" data-edit-id="${p.id}">\u062a\u0639\u062f\u064a\u0644</button>
                    <button class="btn btn-danger" data-delete-id="${p.id}" data-image-id="${p.imageFileId}">\u062d\u0630\u0641</button>
                </div>
            `;

            // Bearbeiten-Button
            div.querySelector('[data-edit-id]').addEventListener('click', () => enterEditMode(p));

            // Löschen-Button
            div.querySelector('[data-delete-id]').addEventListener('click', () => {
                deleteProduct(p.id, p.imageFileId);
            });

            productList.appendChild(div);
        });
    }

    // Handle Form Submission (Create & Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- Validierung ---
        const name = document.getElementById('p-name').value.trim();
        if (!name) { alert('\u0627\u0644\u0627\u0633\u0645 \u0644\u0627 \u064a\u0645\u0643\u0646 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0641\u0627\u0631\u063a\u0627\u064b.'); return; }

        const priceUSD = parseFloat(document.getElementById('p-price-usd').value);
        if (isNaN(priceUSD) || priceUSD < 0) { alert('\u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062f\u0648\u0644\u0627\u0631 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d.'); return; }

        const priceUsdCents = Math.round(priceUSD * 100);
        const priceSyp = parseInt(document.getElementById('p-price-syp').value, 10) || 0;
        const sortOrder = parseInt(document.getElementById('p-sort-order').value, 10) || 0;
        const category = validCategories.includes(categorySelect.value) ? categorySelect.value : 'offers';
        const active = document.getElementById('p-active').checked;
        const description = document.getElementById('p-desc').value.trim();
        const nameAr = document.getElementById('p-name-ar').value.trim();
        const descriptionAr = document.getElementById('p-desc-ar').value.trim();
        const nameEn = document.getElementById('p-name-en').value.trim();
        const descriptionEn = document.getElementById('p-desc-en').value.trim();
        const nameDe = document.getElementById('p-name-de').value.trim();
        const descriptionDe = document.getElementById('p-desc-de').value.trim();
        const fileInput = document.getElementById('p-image-file');
        const file = fileInput.files[0] || null;

        // Im Erstellmodus muss ein Bild gewählt sein
        if (!editProductId && !file) {
            alert('\u0627\u0644\u0631\u062c\u0627\u0621 \u0627\u062e\u062a\u0627\u0631 \u0635\u0648\u0631\u0629!');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '\u062c\u0627\u0631\u064a... \u064a\u064f\u0631\u062c\u0649 \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631';

        try {
            if (editProductId) {
                // === BEARBEITEN-MODUS ===
                const updateData = {
                    name,
                    description,
                    nameAr,
                    descriptionAr,
                    nameEn,
                    descriptionEn,
                    nameDe,
                    descriptionDe,
                    priceUsdCents,
                    priceSyp,
                    sortOrder,
                    category,
                    active
                };

                if (file) {
                    // Neues Bild: komprimieren, hochladen, URLs aktualisieren
                    const compressedFile = await compressImage(file);
                    const upload = await appwriteStorage.createFile('product_images', ID.unique(), compressedFile);
                    const newImageUrl = appwriteStorage.getFileView('product_images', upload.$id);
                    updateData.imageFileId = upload.$id;
                    updateData.imageUrl = newImageUrl.toString();

                    // Dokument aktualisieren
                    await databases.updateDocument('mais_beauty_db', 'products', editProductId, updateData);

                    // Altes Bild erst NACH erfolgreichem Update löschen
                    if (editProductOldImageFileId && editProductOldImageFileId !== 'undefined') {
                        try {
                            await appwriteStorage.deleteFile('product_images', editProductOldImageFileId);
                        } catch (imgErr) {
                            console.warn('[Edit] Altes Bild konnte nicht gelöscht werden:', imgErr);
                        }
                    }
                } else {
                    // Kein neues Bild: Dokument ohne Bild-Änderung aktualisieren
                    await databases.updateDocument('mais_beauty_db', 'products', editProductId, updateData);
                }

                exitEditMode();
                alert('\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0646\u062a\u062c \u0628\u0646\u062c\u0627\u062d!');

            } else {
                // === ERSTELLEN-MODUS ===
                const compressedFile = await compressImage(file);
                const upload = await appwriteStorage.createFile('product_images', ID.unique(), compressedFile);
                const imageUrl = appwriteStorage.getFileView('product_images', upload.$id);

                const newProduct = {
                    name,
                    description,
                    nameAr,
                    descriptionAr,
                    nameEn,
                    descriptionEn,
                    nameDe,
                    descriptionDe,
                    priceUsdCents,
                    priceSyp,
                    imageFileId: upload.$id,
                    imageUrl: imageUrl.toString(),
                    category,
                    active,
                    sortOrder
                };

                await databases.createDocument('mais_beauty_db', 'products', ID.unique(), newProduct);
                form.reset();
                document.getElementById('p-active').checked = true;
                document.getElementById('p-sort-order').value = 0;
                categorySelect.value = 'offers';
                alert('\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062a\u062c \u0628\u0646\u062c\u0627\u062d!');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            alert('\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062d\u0641\u0638. (Fehler beim Speichern)');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Delete Product Function
    async function deleteProduct(id, imageFileId) {
        if (confirm('\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f \u0645\u0646 \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062a\u062c\u061f \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646 \u0647\u0630\u0647 \u0627\u0644\u062e\u0637\u0648\u0629!')) {
            // Bearbeitungsmodus abbrechen falls das gelöschte Produkt gerade bearbeitet wird
            if (editProductId === id) exitEditMode();
            try {
                if (imageFileId && imageFileId !== 'undefined') {
                    await appwriteStorage.deleteFile('product_images', imageFileId);
                }
                await databases.deleteDocument('mais_beauty_db', 'products', id);
            } catch (error) {
                console.error('Error removing document:', error);
                alert('\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062d\u0630\u0641.');
            }
        }
    }

    // Initial render
    renderAdminProducts();
});
