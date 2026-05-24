import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@16.1.0/+esm";

const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "6a0d8738002fb76a4caf";
const APPWRITE_DATABASE_ID = "mais_beauty_db";
const APPWRITE_PRODUCTS_COLLECTION_ID = "products";
const APPWRITE_SETTINGS_COLLECTION_ID = "shop_settings";
const APPWRITE_SETTINGS_DOCUMENT_ID = "main";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const appData = {
    translations: {
        ar: {
            logo: "Mais Beauty",
            hero_tagline: "جمالك يبدأ من هنا - منتجات ألمانية أصلية",
            offers_title: "العروض الخاصة",
            serums_title: "السيرومات والأمبولات",
            masks_title: "ماسكات الوجه",
            eyes_title: "لزقات العين",
            creams_title: "كريمات الوجه",
            contact_us: "تواصل معنا",
            about_us_title: "من نحن",
            about_us_text: "Mais Beauty يقدم منتجات عناية بالبشرة أصلية مختارة بعناية من علامات ألمانية وأوروبية.",
            contact_form_title: "تواصل معنا",
            contact_name: "الاسم",
            contact_customer_email: "البريد الإلكتروني",
            contact_message: "الرسالة",
            contact_name_placeholder: "اكتب اسمك",
            contact_customer_email_placeholder: "name@example.com",
            contact_message_placeholder: "اكتب رسالتك",
            contact_submit: "إرسال الرسالة",
            contact_missing_email_alert: "بريد التواصل غير مضبوط بعد.",
            contact_required_alert: "يرجى إدخال الاسم والبريد الإلكتروني والرسالة.",
            contact_subject: "استفسار تواصل - Mais Beauty",
            empty_category: "سيتم إضافة المنتجات قريباً…",
            add_to_cart: "إضافة للسلة",
            cart_added: "تمت الإضافة إلى السلة",
            go_to_cart: "الذهاب إلى السلة",
            delete_item: "حذف",
            your_cart: "سلة المشتريات",
            total: "الإجمالي:",
            checkout: "اطلب الآن عبر واتساب",
            customer_name: "اسم العميل",
            customer_phone: "رقم هاتف العميل",
            order_note: "ملاحظات أو رغبات",
            customer_name_placeholder: "اكتب اسمك",
            customer_phone_placeholder_syria: "9XXXXXXXX",
            customer_phone_placeholder_germany: "17XXXXXXXX",
            customer_phone_placeholder_other: "+4917XXXXXXXX",
            customer_phone_help_syria: "اكتب رقمك المحلي فقط، مثال: 9XXXXXXXX",
            customer_phone_help_germany: "اكتب رقمك المحلي فقط، مثال: 17XXXXXXXX",
            customer_phone_help_other: "اكتب الرقم الكامل مع رمز البلد، مثال: +4917XXXXXXXX",
            customer_country_other: "بلد آخر",
            order_note_placeholder: "اختياري",
            empty_cart_alert: "سلة المشتريات فارغة.",
            missing_name_alert: "يرجى إدخال اسم العميل.",
            missing_phone_alert: "يرجى إدخال رقم هاتف العميل.",
            invalid_phone_alert: "يرجى إدخال رقم هاتف صحيح.",
            missing_whatsapp_alert: "رقم واتساب المتجر غير مضبوط بعد.",
            missing_email_alert: "بريد الطلبات غير مضبوط بعد.",
            email_checkout: "اطلب عبر البريد الإلكتروني",
            whatsapp_order_title: "طلب جديد - Mais Beauty",
            whatsapp_customer_name: "اسم العميل",
            whatsapp_customer_phone: "هاتف العميل",
            whatsapp_customer_section: "العميل",
            whatsapp_products: "المنتجات",
            whatsapp_note: "ملاحظة العميل",
            whatsapp_order_number: "رقم",
            whatsapp_product: "المنتج",
            whatsapp_quantity: "الكمية",
            whatsapp_unit_price: "سعر القطعة",
            whatsapp_line_total: "الإجمالي",
            remove_cart_confirm: "هل تريد إزالة هذا المنتج من سلة المشتريات؟",
            quantity: "الكمية:",
            view_details: "عرض التفاصيل"
        },
        en: {
            logo: "Mais Beauty",
            hero_tagline: "Your beauty starts here - Original German products",
            offers_title: "Special Offers",
            serums_title: "Serums & Ampoules",
            masks_title: "Face Masks",
            eyes_title: "Eye Pads",
            creams_title: "Face Creams",
            contact_us: "Contact Us",
            about_us_title: "About us",
            about_us_text: "Mais Beauty offers carefully selected original skincare products from German and European brands.",
            contact_form_title: "Contact",
            contact_name: "Name",
            contact_customer_email: "Your email",
            contact_message: "Message",
            contact_name_placeholder: "Enter your name",
            contact_customer_email_placeholder: "name@example.com",
            contact_message_placeholder: "Write your message",
            contact_submit: "Send message",
            contact_missing_email_alert: "The shop contact email is not configured yet.",
            contact_required_alert: "Please enter your name, email and message.",
            contact_subject: "Contact request - Mais Beauty",
            empty_category: "Products coming soon…",
            add_to_cart: "Add to Cart",
            cart_added: "Added to cart",
            go_to_cart: "Go to cart",
            delete_item: "Remove",
            your_cart: "Your Cart",
            total: "Total:",
            checkout: "Order now via WhatsApp",
            customer_name: "Customer name",
            customer_phone: "Customer phone",
            order_note: "Notes or requests",
            customer_name_placeholder: "Enter your name",
            customer_phone_placeholder_syria: "9XXXXXXXX",
            customer_phone_placeholder_germany: "17XXXXXXXX",
            customer_phone_placeholder_other: "+4917XXXXXXXX",
            customer_phone_help_syria: "Enter local number only, e.g. 9XXXXXXXX",
            customer_phone_help_germany: "Enter local number only, e.g. 17XXXXXXXX",
            customer_phone_help_other: "Enter full number with country code, e.g. +4917XXXXXXXX",
            customer_country_other: "Other",
            order_note_placeholder: "Optional",
            empty_cart_alert: "Your cart is empty.",
            missing_name_alert: "Please enter the customer name.",
            missing_phone_alert: "Please enter the customer phone number.",
            invalid_phone_alert: "Please enter a valid phone number.",
            missing_whatsapp_alert: "The shop WhatsApp number is not configured yet.",
            missing_email_alert: "The shop order email is not configured yet.",
            email_checkout: "Order via email",
            whatsapp_order_title: "New order - Mais Beauty",
            whatsapp_customer_name: "Customer name",
            whatsapp_customer_phone: "Customer phone",
            whatsapp_customer_section: "Customer",
            whatsapp_products: "Products",
            whatsapp_note: "Customer note",
            whatsapp_order_number: "No.",
            whatsapp_product: "Product",
            whatsapp_quantity: "Qty",
            whatsapp_unit_price: "Unit price",
            whatsapp_line_total: "Total",
            remove_cart_confirm: "Remove this product from your cart?",
            quantity: "Quantity:",
            view_details: "View Details"
        },
        de: {
            logo: "Mais Beauty",
            hero_tagline: "Ihre Schönheit beginnt hier - Original deutsche Produkte",
            offers_title: "Angebote",
            serums_title: "Seren",
            masks_title: "Masken",
            eyes_title: "Augenpads",
            creams_title: "Cremes",
            contact_us: "Kontaktiere uns",
            about_us_title: "Über uns",
            about_us_text: "Mais Beauty bietet sorgfältig ausgewählte originale Hautpflegeprodukte deutscher und europäischer Marken.",
            contact_form_title: "Kontakt",
            contact_name: "Name",
            contact_customer_email: "Ihre E-Mail",
            contact_message: "Nachricht",
            contact_name_placeholder: "Namen eingeben",
            contact_customer_email_placeholder: "name@example.com",
            contact_message_placeholder: "Nachricht eingeben",
            contact_submit: "Nachricht senden",
            contact_missing_email_alert: "Die Kontakt-E-Mail-Adresse des Shops ist noch nicht eingetragen.",
            contact_required_alert: "Bitte Name, E-Mail und Nachricht eingeben.",
            contact_subject: "Kontaktanfrage - Mais Beauty",
            empty_category: "Produkte folgen in Kürze…",
            add_to_cart: "In den Warenkorb",
            cart_added: "Zum Warenkorb hinzugefügt",
            go_to_cart: "Zum Warenkorb",
            delete_item: "Entfernen",
            your_cart: "Warenkorb",
            total: "Gesamt:",
            checkout: "Jetzt per WhatsApp bestellen",
            customer_name: "Kundenname",
            customer_phone: "Telefonnummer",
            order_note: "Notiz oder Wünsche",
            customer_name_placeholder: "Namen eingeben",
            customer_phone_placeholder_syria: "9XXXXXXXX",
            customer_phone_placeholder_germany: "17XXXXXXXX",
            customer_phone_placeholder_other: "+4917XXXXXXXX",
            customer_phone_help_syria: "Nur lokale Nummer eingeben, z. B. 9XXXXXXXX",
            customer_phone_help_germany: "Nur lokale Nummer eingeben, z. B. 17XXXXXXXX",
            customer_phone_help_other: "Vollständige Nummer mit Landesvorwahl eingeben, z. B. +4917XXXXXXXX",
            customer_country_other: "Anderes Land",
            order_note_placeholder: "Optional",
            empty_cart_alert: "Der Warenkorb ist leer.",
            missing_name_alert: "Bitte den Kundennamen eingeben.",
            missing_phone_alert: "Bitte die Telefonnummer eingeben.",
            invalid_phone_alert: "Bitte eine gültige Telefonnummer eingeben.",
            missing_whatsapp_alert: "Die WhatsApp-Nummer des Shops ist noch nicht eingetragen.",
            missing_email_alert: "Die Bestell-E-Mail-Adresse des Shops ist noch nicht eingetragen.",
            email_checkout: "Per E-Mail bestellen",
            whatsapp_order_title: "Neue Bestellung - Mais Beauty",
            whatsapp_customer_name: "Kundenname",
            whatsapp_customer_phone: "Kundentelefon",
            whatsapp_customer_section: "Kunde",
            whatsapp_products: "Produkte",
            whatsapp_note: "Kundennotiz",
            whatsapp_order_number: "Nr",
            whatsapp_product: "Produkt",
            whatsapp_quantity: "Menge",
            whatsapp_unit_price: "Einzelpreis",
            whatsapp_line_total: "Gesamt",
            remove_cart_confirm: "Dieses Produkt aus dem Warenkorb entfernen?",
            quantity: "Menge:",
            view_details: "Details anzeigen"
        }
    },
    products: []
};

let currentLang = "ar";
let cart = [];
let activeProduct = null;
let shopWhatsAppNumber = "";
let shopOrderEmail = "";
let shopContactEmail = "";
let cartQuantityInputTimer = null;

const productGridIds = ["offers", "serums", "masks", "eyes", "creams"];
const langSwitcher = document.getElementById("lang-switcher");
const modal = document.getElementById("product-modal");
const cartSidebar = document.getElementById("cart-sidebar");
const floatingCartBtn = document.getElementById("floating-cart-btn");
const imageLightbox = document.getElementById("image-lightbox");

function init() {
    initTheme();
    setupEventListeners();
    updateTranslations();
    loadShopSettings();
    loadProducts();
}

async function loadShopSettings() {
    try {
        const settings = await databases.getDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_SETTINGS_COLLECTION_ID,
            APPWRITE_SETTINGS_DOCUMENT_ID
        );
        shopWhatsAppNumber = settings.whatsappNumber || "";
        shopOrderEmail = settings.orderEmail || "";
        shopContactEmail = settings.contactEmail || "";
    } catch (error) {
        console.error("Appwrite shop settings load failed:", error);
        shopWhatsAppNumber = "";
        shopOrderEmail = "";
        shopContactEmail = "";
    }

    updateCheckoutState();
    updateContactState();
}

async function loadProducts() {
    const offersGrid = document.getElementById("offers-grid");
    if (offersGrid) {
        offersGrid.innerHTML = `<p class="empty-msg">${appData.translations[currentLang].empty_category}</p>`;
    }

    try {
        const response = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION_ID,
            [
                Query.limit(100),
                Query.select([
                    "name",
                    "description",
                    "nameAr",
                    "nameEn",
                    "nameDe",
                    "descriptionAr",
                    "descriptionEn",
                    "descriptionDe",
                    "priceUsdCents",
                    "imageUrl",
                    "active",
                    "sortOrder",
                    "category"
                ])
            ]
        );

        appData.products = response.documents || [];
        renderProducts();
    } catch (error) {
        console.error("Appwrite products load failed:", error);
        appData.products = [];
        renderProducts();
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("beauty_store_theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(theme);
}

function setTheme(theme) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem("beauty_store_theme", normalizedTheme);

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.textContent = normalizedTheme === "dark" ? "☀️" : "🌙";
    }
}

function setupEventListeners() {
    if (langSwitcher) {
        langSwitcher.addEventListener("change", (event) => {
            currentLang = event.target.value;
            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
            updateTranslations();
            renderProducts();
            updateOpenModalLanguage();
            updateCartUI();
        });
    }

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            setTheme(currentTheme === "dark" ? "light" : "dark");
        });
    }

    floatingCartBtn?.addEventListener("click", () => {
        cartSidebar?.classList.add("active");
    });

    document.querySelector(".close-cart")?.addEventListener("click", () => {
        cartSidebar?.classList.remove("active");
    });

    document.querySelector(".close-modal")?.addEventListener("click", () => {
        if (modal) modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
        if (event.target === imageLightbox) closeImageLightbox();
    });

    document.querySelector(".close-lightbox")?.addEventListener("click", closeImageLightbox);
    document.getElementById("modal-img")?.addEventListener("click", openImageLightbox);
    document.getElementById("modal-img")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openImageLightbox();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeImageLightbox();
    });

    document.querySelector(".qty-btn.plus")?.addEventListener("click", () => {
        const input = document.getElementById("modal-qty");
        if (input) input.value = String(parseInt(input.value || "1", 10) + 1);
    });

    document.querySelector(".qty-btn.minus")?.addEventListener("click", () => {
        const input = document.getElementById("modal-qty");
        if (input && parseInt(input.value || "1", 10) > 1) {
            input.value = String(parseInt(input.value, 10) - 1);
        }
    });

    document.getElementById("modal-add-to-cart")?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!activeProduct) return;
        const qty = parseInt(document.getElementById("modal-qty")?.value || "1", 10);
        addToCart(activeProduct, qty);
        showModalCartFeedback();
    });
    document.getElementById("modal-go-to-cart")?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (modal) modal.style.display = "none";
        cartSidebar?.classList.add("active");
    });

    document.getElementById("checkout-btn")?.addEventListener("click", submitOrder);
    document.getElementById("email-checkout-btn")?.addEventListener("click", submitEmailOrder);
    document.getElementById("customer-country")?.addEventListener("change", updateCustomerPhoneHelp);
    document.getElementById("footer-contact-form")?.addEventListener("submit", submitContactMessage);
    document.getElementById("cart-items")?.addEventListener("click", handleCartItemClick);
    document.getElementById("cart-items")?.addEventListener("input", handleCartQuantityInput);
    document.getElementById("cart-items")?.addEventListener("change", handleCartQuantityInput);

    let lastScrollTop = 0;
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            navbar?.classList.add("nav-hidden");
        } else {
            navbar?.classList.remove("nav-hidden");
        }
        lastScrollTop = Math.max(scrollTop, 0);
    });
}

function formatPrice(usd) {
    return `$${Number(usd || 0).toFixed(2)}`;
}

function getProductPriceUsd(product) {
    return Number(product.priceUsdCents || 0) / 100;
}

function getLocalizedProductText(product, field) {
    const langSuffix = currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
    return product[`${field}${langSuffix}`] || product[field] || "";
}

function updateTranslations() {
    const texts = appData.translations[currentLang];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key && texts[key]) element.textContent = texts[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (key && texts[key]) element.setAttribute("placeholder", texts[key]);
    });
    updateCustomerPhoneHelp();
    updateCheckoutState();
    updateContactState();
}

function createEmptyMessage() {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-msg";
    emptyMsg.textContent = appData.translations[currentLang].empty_category;
    return emptyMsg;
}

function getProductCategory(product) {
    return productGridIds.includes(product.category) ? product.category : "offers";
}

function renderProducts() {
    productGridIds.forEach((category) => {
        const grid = document.getElementById(`${category}-grid`);
        if (!grid) return;

        grid.innerHTML = "";
    });

    const visibleProducts = appData.products
        .filter((product) => product.active !== false)
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

    if (visibleProducts.length === 0) {
        productGridIds.forEach((category) => {
            document.getElementById(`${category}-grid`)?.appendChild(createEmptyMessage());
        });
        return;
    }

    visibleProducts.forEach((product) => {
        const category = getProductCategory(product);
        const grid = document.getElementById(`${category}-grid`);
        if (!grid) return;

        const name = getLocalizedProductText(product, "name") || "Mais Beauty";
        const description = getLocalizedProductText(product, "description");
        const imageUrl = product.imageUrl || "";
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-image-wrap">
                ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="product-image" loading="lazy">` : ""}
            </div>
            <div class="product-info">
                <h3 class="product-title">${name}</h3>
                <p class="product-desc">${description}</p>
                <p class="product-price">${formatPrice(getProductPriceUsd(product))}</p>
                <button class="view-btn" type="button">${appData.translations[currentLang].view_details}</button>
            </div>
        `;

        const image = card.querySelector(".product-image");
        if (image) {
            image.addEventListener("error", () => {
                image.remove();
            });
        }

        card.addEventListener("click", () => openModal(product));
        card.querySelector(".view-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            openModal(product);
        });
        grid.appendChild(card);
    });

    productGridIds.forEach((category) => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid && grid.children.length === 0) {
            grid.appendChild(createEmptyMessage());
        }
    });
}

function openModal(product, resetFeedback = true) {
    activeProduct = product;
    if (resetFeedback) hideModalCartFeedback();
    const image = document.getElementById("modal-img");
    const imageUrl = product.imageUrl || "";

    if (image) {
        image.src = imageUrl;
        image.alt = getLocalizedProductText(product, "name");
        image.style.display = imageUrl ? "block" : "none";
        image.onerror = () => {
            image.style.display = "none";
        };
    }

    const title = document.getElementById("modal-title");
    const price = document.getElementById("modal-price");
    const desc = document.getElementById("modal-desc");
    const qty = document.getElementById("modal-qty");

    if (title) title.textContent = getLocalizedProductText(product, "name") || "Mais Beauty";
    if (price) price.textContent = formatPrice(getProductPriceUsd(product));
    if (desc) desc.textContent = getLocalizedProductText(product, "description");
    if (qty) qty.value = 1;
    if (modal) modal.style.display = "block";
}

function showModalCartFeedback() {
    const feedback = document.getElementById("modal-cart-feedback");
    if (feedback) feedback.hidden = false;
}

function hideModalCartFeedback() {
    const feedback = document.getElementById("modal-cart-feedback");
    if (feedback) feedback.hidden = true;
}

function updateOpenModalLanguage() {
    if (!activeProduct || !modal || modal.style.display === "none") return;
    openModal(activeProduct, false);
}

function openImageLightbox() {
    const modalImage = document.getElementById("modal-img");
    const lightboxImage = document.getElementById("lightbox-img");
    if (!modalImage?.src || !lightboxImage || !imageLightbox) return;

    lightboxImage.src = modalImage.src;
    lightboxImage.alt = modalImage.alt;
    imageLightbox.classList.add("active");
    imageLightbox.setAttribute("aria-hidden", "false");
}

function closeImageLightbox() {
    if (!imageLightbox) return;
    imageLightbox.classList.remove("active");
    imageLightbox.setAttribute("aria-hidden", "true");
}

function addToCart(product, qty) {
    const existing = cart.find((item) => item.$id === product.$id);
    const safeQty = Math.max(1, Number(qty) || 1);
    if (existing) {
        existing.qty += safeQty;
    } else {
        cart.push(Object.assign({}, product, { qty: safeQty }));
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const totalValue = document.getElementById("cart-total-value");
    if (!cartItems || !cartCount || !totalValue) return;

    cartItems.innerHTML = "";
    let totalUSD = 0;
    let count = 0;

    cart.forEach((item) => {
        const itemPrice = getProductPriceUsd(item);
        const itemTotal = itemPrice * item.qty;
        const productName = getLocalizedProductText(item, "name") || "Mais Beauty";
        totalUSD += itemPrice * item.qty;
        count += item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-image">
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${productName}">` : "<span></span>"}
            </div>
            <div class="cart-item-details">
                <h4>${productName}</h4>
                <p class="cart-unit-price">${appData.translations[currentLang].whatsapp_unit_price}: ${formatPrice(itemPrice)}</p>
                <div class="cart-item-actions">
                    <div class="cart-qty-controls" aria-label="${appData.translations[currentLang].whatsapp_quantity}">
                        <button class="cart-qty-btn" type="button" data-cart-action="decrease" data-product-id="${item.$id}" aria-label="Decrease quantity">-</button>
                        <input class="cart-qty-input" type="number" min="1" value="${item.qty}" inputmode="numeric" data-product-id="${item.$id}">
                        <button class="cart-qty-btn" type="button" data-cart-action="increase" data-product-id="${item.$id}" aria-label="Increase quantity">+</button>
                    </div>
                    <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${item.$id}">${appData.translations[currentLang].delete_item}</button>
                </div>
                <p class="cart-line-total">${appData.translations[currentLang].whatsapp_line_total}: <strong>${formatPrice(itemTotal)}</strong></p>
            </div>
        `;
        cartItems.appendChild(div);
    });

    cartCount.textContent = String(count);
    totalValue.textContent = formatPrice(totalUSD);
}

function setCartQuantity(id, value) {
    const item = cart.find((cartItem) => cartItem.$id === id);
    if (!item) return;
    item.qty = Math.max(1, Number.parseInt(value, 10) || 1);
    updateCartUI();
}

function changeCartQuantity(id, delta) {
    const item = cart.find((cartItem) => cartItem.$id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    updateCartUI();
}

function handleCartItemClick(event) {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    const action = button.dataset.cartAction;
    if (action === "remove") {
        removeFromCart(button.dataset.productId);
        return;
    }

    const delta = action === "increase" ? 1 : -1;
    changeCartQuantity(button.dataset.productId, delta);
}

function handleCartQuantityInput(event) {
    const input = event.target.closest(".cart-qty-input");
    if (!input) return;
    if (input.value.trim() === "") return;

    if (event.type === "input") {
        clearTimeout(cartQuantityInputTimer);
        cartQuantityInputTimer = setTimeout(() => {
            setCartQuantity(input.dataset.productId, input.value);
        }, 250);
        return;
    }

    clearTimeout(cartQuantityInputTimer);
    setCartQuantity(input.dataset.productId, input.value);
}

function removeFromCart(id) {
    if (!confirm(appData.translations[currentLang].remove_cart_confirm)) return;
    cart = cart.filter((item) => item.$id !== id);
    updateCartUI();
}

function updateCheckoutState() {
    const checkoutBtn = document.getElementById("checkout-btn");
    const emailCheckoutBtn = document.getElementById("email-checkout-btn");

    if (checkoutBtn) {
        checkoutBtn.disabled = !shopWhatsAppNumber;
        checkoutBtn.title = shopWhatsAppNumber
            ? ""
            : appData.translations[currentLang].missing_whatsapp_alert;
    }

    if (emailCheckoutBtn) {
        emailCheckoutBtn.disabled = !shopOrderEmail;
        emailCheckoutBtn.title = shopOrderEmail
            ? ""
            : appData.translations[currentLang].missing_email_alert;
    }
}

function updateContactState() {
    const contactSubmit = document.getElementById("footer-contact-submit");
    if (!contactSubmit) return;

    contactSubmit.disabled = !shopContactEmail;
    contactSubmit.title = shopContactEmail
        ? ""
        : appData.translations[currentLang].contact_missing_email_alert;
}

function submitContactMessage(event) {
    event.preventDefault();
    const texts = appData.translations[currentLang];
    const customerName = document.getElementById("footer-contact-name")?.value.trim() || "";
    const customerEmail = document.getElementById("footer-contact-customer-email")?.value.trim() || "";
    const message = document.getElementById("footer-contact-message")?.value.trim() || "";

    if (!shopContactEmail) {
        alert(texts.contact_missing_email_alert);
        return;
    }
    if (!customerName || !customerEmail || !message) {
        alert(texts.contact_required_alert);
        return;
    }

    const body = [
        `${texts.contact_name}: ${customerName}`,
        `${texts.contact_customer_email}: ${customerEmail}`,
        "",
        `${texts.contact_message}:`,
        message
    ].join("\n");

    window.location.href = `mailto:${shopContactEmail}?subject=${encodeURIComponent(texts.contact_subject)}&body=${encodeURIComponent(body)}`;
}

function getCustomerPhoneMode() {
    const selectedCountry = document.getElementById("customer-country")?.value || "";
    if (selectedCountry === "+963") return "syria";
    if (selectedCountry === "+49") return "germany";
    return "other";
}

function updateCustomerPhoneHelp() {
    const texts = appData.translations[currentLang];
    const mode = getCustomerPhoneMode();
    const phoneInput = document.getElementById("customer-phone");
    const phoneHelp = document.getElementById("customer-phone-help");

    if (phoneInput) {
        phoneInput.placeholder = texts[`customer_phone_placeholder_${mode}`];
    }
    if (phoneHelp) {
        phoneHelp.textContent = texts[`customer_phone_help_${mode}`];
    }
}

function normalizeCustomerPhone(phoneValue) {
    const selectedCountry = document.getElementById("customer-country")?.value || "";
    let phone = phoneValue.replace(/\s+/g, "");

    if (selectedCountry) {
        const countryDigits = selectedCountry.slice(1);
        phone = phone.replace(/^\+/, "");

        if (phone.startsWith(countryDigits)) {
            phone = phone.slice(countryDigits.length);
        }

        phone = phone.replace(/^0+/, "");
        if (!phone) return "";
        return `${selectedCountry}${phone}`;
    }

    if (phone.startsWith("00")) {
        phone = `+${phone.slice(2)}`;
    }

    return phone.startsWith("+") && phone.length > 1 ? phone : "";
}

function createOrderMessage(customerName, customerPhone, note) {
    const texts = appData.translations[currentLang];
    const orderLines = cart.map((item, index) => {
        const unitPrice = getProductPriceUsd(item);
        const lineTotal = unitPrice * item.qty;
        const productName = getLocalizedProductText(item, "name") || "Mais Beauty";
        return [
            `${index + 1}. ${productName}`,
            `   ${texts.whatsapp_quantity}: ${item.qty}`,
            `   ${texts.whatsapp_unit_price}: ${formatPrice(unitPrice)}`,
            `   ${texts.whatsapp_line_total}: ${formatPrice(lineTotal)}`
        ].join("\n");
    });
    const total = cart.reduce((sum, item) => sum + getProductPriceUsd(item) * item.qty, 0);
    const messageParts = [
        texts.whatsapp_order_title,
        "",
        `${texts.whatsapp_customer_section}:`,
        `${texts.whatsapp_customer_name}: ${customerName}`,
        `${texts.whatsapp_customer_phone}: ${customerPhone}`,
        "",
        `${texts.whatsapp_products}:`,
        "",
        orderLines.join("\n\n"),
        "",
        `${texts.total} ${formatPrice(total)}`
    ];

    if (note) {
        messageParts.push("", `${texts.whatsapp_note}: ${note}`);
    }

    return messageParts.join("\n");
}

function submitOrder() {
    const texts = appData.translations[currentLang];
    const customerName = document.getElementById("customer-name")?.value.trim() || "";
    const customerPhoneValue = document.getElementById("customer-phone")?.value.trim() || "";
    const note = document.getElementById("customer-note")?.value.trim() || "";

    if (cart.length === 0) {
        alert(texts.empty_cart_alert);
        return;
    }
    if (!customerName) {
        alert(texts.missing_name_alert);
        return;
    }
    if (!customerPhoneValue) {
        alert(texts.missing_phone_alert);
        return;
    }
    if (!shopWhatsAppNumber) {
        alert(texts.missing_whatsapp_alert);
        return;
    }

    const customerPhone = normalizeCustomerPhone(customerPhoneValue);
    if (!customerPhone) {
        alert(texts.invalid_phone_alert);
        return;
    }

    const message = createOrderMessage(customerName, customerPhone, note);
    const whatsappUrl = `https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    console.log("WhatsApp order link generated");
    const opened = window.open(whatsappUrl, "_blank", "noopener");
    if (!opened) {
        window.location.href = whatsappUrl;
    }
}

function submitEmailOrder() {
    const texts = appData.translations[currentLang];
    const customerName = document.getElementById("customer-name")?.value.trim() || "";
    const customerPhoneValue = document.getElementById("customer-phone")?.value.trim() || "";
    const note = document.getElementById("customer-note")?.value.trim() || "";

    if (cart.length === 0) {
        alert(texts.empty_cart_alert);
        return;
    }
    if (!customerName) {
        alert(texts.missing_name_alert);
        return;
    }
    if (!customerPhoneValue) {
        alert(texts.missing_phone_alert);
        return;
    }
    if (!shopOrderEmail) {
        alert(texts.missing_email_alert);
        return;
    }

    const subject = "Neue Bestellung - Mais Beauty";
    const customerPhone = normalizeCustomerPhone(customerPhoneValue);
    if (!customerPhone) {
        alert(texts.invalid_phone_alert);
        return;
    }

    const message = createOrderMessage(customerName, customerPhone, note);
    window.location.href = `mailto:${shopOrderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", init);
