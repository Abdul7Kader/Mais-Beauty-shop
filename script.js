import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@16.1.0/+esm";

const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "6a0d8738002fb76a4caf";
const APPWRITE_DATABASE_ID = "mais_beauty_db";
const APPWRITE_PRODUCTS_COLLECTION_ID = "products";
const APPWRITE_SETTINGS_COLLECTION_ID = "shop_settings";
const APPWRITE_SETTINGS_DOCUMENT_ID = "main";
const CART_STORAGE_KEY = "maisBeautyCart";
const CUSTOMER_STORAGE_KEY = "maisBeautyCustomer";
const THEME_STORAGE_KEY = "beauty_store_theme";
const LANG_STORAGE_KEY = "beauty_store_lang";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const appData = {
    translations: {
        ar: {
            logo: "Mais Beauty",
            skip_to_products: "تخطي إلى المنتجات",
            cart_short: "السلة",
            hero_eyebrow: "عناية بالبشرة · منتجات ألمانية أصلية",
            hero_title: "بشرة صحية تبدأ بمنتجات تثق بها",
            hero_tagline: "جمالك يبدأ من هنا - منتجات ألمانية أصلية",
            hero_cta: "تسوق الآن",
            hero_cta_secondary: "كيف أطلب؟",
            usp_original_title: "منتجات أصلية 100%",
            usp_original_text: "مختارة بعناية من علامات ألمانية وأوروبية",
            usp_order_title: "طلب خلال دقيقة",
            usp_order_text: "عبر واتساب أو البريد الإلكتروني، بدون تسجيل",
            usp_personal_title: "تواصل شخصي",
            usp_personal_text: "بدون دفع إلكتروني - نؤكد طلبك معك مباشرة",
            steps_eyebrow: "بسيط وسريع",
            steps_title: "اطلب في 3 خطوات",
            step1_title: "اختر منتجاتك",
            step1_text: "أضف المنتجات إلى السلة بنقرة واحدة.",
            step2_title: "أدخل اسمك ورقمك",
            step2_text: "الاسم ورقم الهاتف فقط - بدون حساب أو تسجيل.",
            step3_title: "أرسل الطلب",
            step3_text: "عبر واتساب أو البريد الإلكتروني - رسالة الطلب جاهزة تلقائياً.",
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
            quick_add: "أضف للسلة",
            offer_badge: "عرض",
            in_cart_badge: "في السلة",
            in_cart_count: "في سلتك: {n}",
            cart_added: "تمت الإضافة إلى السلة",
            go_to_cart: "إتمام الطلب",
            view_cart: "عرض السلة",
            continue_shopping: "متابعة التسوق",
            checkout_now: "إتمام الطلب",
            item_removed: "تمت إزالة المنتج",
            undo: "تراجع",
            delete_item: "حذف",
            your_cart: "سلة المشتريات",
            cart_empty_title: "سلتك فارغة",
            cart_empty_text: "اكتشف منتجاتنا وأضف ما يعجبك بنقرة واحدة.",
            start_shopping: "ابدأ التسوق",
            your_details: "بياناتك للطلب",
            add_note: "إضافة ملاحظة (اختياري)",
            checkout_hint: "لا يوجد دفع إلكتروني. ستُفتح رسالة الطلب جاهزة، فقط اضغط إرسال.",
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
            quantity: "الكمية:",
            view_details: "عرض التفاصيل",
            decrease_qty: "إنقاص الكمية",
            increase_qty: "زيادة الكمية",
            close: "إغلاق",
            open_cart: "فتح السلة",
            toggle_theme: "تبديل الوضع الداكن",
            plural: {
                zero: "لا منتجات",
                one: "منتج واحد",
                two: "منتجان",
                few: "{n} منتجات",
                many: "{n} منتجاً",
                other: "{n} منتج"
            }
        },
        en: {
            logo: "Mais Beauty",
            skip_to_products: "Skip to products",
            cart_short: "Cart",
            hero_eyebrow: "Skincare · Original German products",
            hero_title: "Healthy skin starts with products you trust",
            hero_tagline: "Your beauty starts here - Original German products",
            hero_cta: "Shop now",
            hero_cta_secondary: "How to order",
            usp_original_title: "100% original",
            usp_original_text: "Carefully selected German & European brands",
            usp_order_title: "Ordered in a minute",
            usp_order_text: "Via WhatsApp or email - no account needed",
            usp_personal_title: "Personal service",
            usp_personal_text: "No online payment - we confirm your order with you directly",
            steps_eyebrow: "Simple & fast",
            steps_title: "Order in 3 steps",
            step1_title: "Pick your products",
            step1_text: "Add products to your cart with a single tap.",
            step2_title: "Enter name & phone",
            step2_text: "Just your name and phone number - no account, no sign-up.",
            step3_title: "Send your order",
            step3_text: "Via WhatsApp or email - your order message is prepared automatically.",
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
            quick_add: "Add to cart",
            offer_badge: "Offer",
            in_cart_badge: "In cart",
            in_cart_count: "In your cart: {n}",
            cart_added: "Added to cart",
            go_to_cart: "Checkout",
            view_cart: "View cart",
            continue_shopping: "Keep shopping",
            checkout_now: "Checkout",
            item_removed: "Item removed",
            undo: "Undo",
            delete_item: "Remove",
            your_cart: "Your Cart",
            cart_empty_title: "Your cart is empty",
            cart_empty_text: "Discover our products and add your favourites with one tap.",
            start_shopping: "Start shopping",
            your_details: "Your details",
            add_note: "Add a note (optional)",
            checkout_hint: "No online payment. Your order message opens ready to send.",
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
            quantity: "Quantity:",
            view_details: "View Details",
            decrease_qty: "Decrease quantity",
            increase_qty: "Increase quantity",
            close: "Close",
            open_cart: "Open cart",
            toggle_theme: "Toggle dark mode",
            plural: {
                one: "1 item",
                other: "{n} items"
            }
        },
        de: {
            logo: "Mais Beauty",
            skip_to_products: "Zu den Produkten",
            cart_short: "Warenkorb",
            hero_eyebrow: "Hautpflege · Original aus Deutschland",
            hero_title: "Schöne Haut beginnt mit Pflege, der du vertraust",
            hero_tagline: "Ihre Schönheit beginnt hier - Original deutsche Produkte",
            hero_cta: "Jetzt entdecken",
            hero_cta_secondary: "So bestellst du",
            usp_original_title: "100 % Originalware",
            usp_original_text: "Sorgfältig ausgewählte deutsche & europäische Marken",
            usp_order_title: "In einer Minute bestellt",
            usp_order_text: "Per WhatsApp oder E-Mail - ohne Kundenkonto",
            usp_personal_title: "Persönlicher Service",
            usp_personal_text: "Keine Online-Zahlung - wir bestätigen deine Bestellung direkt mit dir",
            steps_eyebrow: "Einfach & schnell",
            steps_title: "In 3 Schritten bestellt",
            step1_title: "Produkte auswählen",
            step1_text: "Mit einem Klick in den Warenkorb legen.",
            step2_title: "Name & Nummer eingeben",
            step2_text: "Nur Name und Telefonnummer - kein Konto, keine Registrierung.",
            step3_title: "Bestellung senden",
            step3_text: "Per WhatsApp oder E-Mail - die Bestellnachricht ist automatisch fertig.",
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
            quick_add: "Hinzufügen",
            offer_badge: "Angebot",
            in_cart_badge: "Im Warenkorb",
            in_cart_count: "Im Warenkorb: {n}",
            cart_added: "Zum Warenkorb hinzugefügt",
            go_to_cart: "Zur Bestellung",
            view_cart: "Warenkorb",
            continue_shopping: "Weiter einkaufen",
            checkout_now: "Zur Bestellung",
            item_removed: "Artikel entfernt",
            undo: "Rückgängig",
            delete_item: "Entfernen",
            your_cart: "Warenkorb",
            cart_empty_title: "Dein Warenkorb ist leer",
            cart_empty_text: "Entdecke unsere Produkte und lege deine Favoriten mit einem Klick hinein.",
            start_shopping: "Jetzt stöbern",
            your_details: "Deine Angaben",
            add_note: "Notiz hinzufügen (optional)",
            checkout_hint: "Keine Online-Zahlung. Deine Bestellnachricht öffnet sich fertig zum Absenden.",
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
            quantity: "Menge:",
            view_details: "Details anzeigen",
            decrease_qty: "Menge verringern",
            increase_qty: "Menge erhöhen",
            close: "Schließen",
            open_cart: "Warenkorb öffnen",
            toggle_theme: "Dunkelmodus umschalten",
            plural: {
                one: "1 Artikel",
                other: "{n} Artikel"
            }
        }
    },
    products: []
};

let currentLang = "ar";
let cart = [];
let activeProduct = null;
let productsLoaded = false;
let shopWhatsAppNumber = "";
let shopOrderEmail = "";
let shopContactEmail = "";
let cartQuantityInputTimer = null;
let lastFocusedElement = null;
let toastTimer = null;
let usingKeyboard = false;

const productGridIds = ["offers", "serums", "masks", "eyes", "creams"];
const langSwitcher = document.getElementById("lang-switcher");
const modal = document.getElementById("product-modal");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const floatingCartBtn = document.getElementById("floating-cart-btn");
const imageLightbox = document.getElementById("image-lightbox");
const mobileCartBar = document.getElementById("mobile-cart-bar");
const toastRegion = document.getElementById("toast-region");

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function t(key) {
    return appData.translations[currentLang][key] ?? appData.translations.en[key] ?? key;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function countLabel(n) {
    const forms = t("plural");
    let rule = "other";
    try {
        rule = new Intl.PluralRules(currentLang).select(n);
    } catch (error) {
        rule = n === 1 ? "one" : "other";
    }
    if (n === 0 && forms.zero) rule = "zero";
    const template = forms[rule] || forms.other;
    return template.replace("{n}", String(n));
}

function icon(name, extraClass = "") {
    return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function storageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        /* storage unavailable (private mode) - ignore */
    }
}

function getProductId(product) {
    return product?.$id || product?.id || "";
}

function findProduct(id) {
    return appData.products.find((product) => getProductId(product) === id)
        || cart.find((item) => item.$id === id)
        || null;
}

function getCartItem(id) {
    return cart.find((item) => item.$id === id) || null;
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + getProductPriceUsd(item) * item.qty, 0);
}

/* ------------------------------------------------------------------ */
/* Init + data                                                        */
/* ------------------------------------------------------------------ */

function init() {
    initLanguage();
    initTheme();
    setupEventListeners();
    updateTranslations();
    loadCartFromStorage();
    loadCustomerDetails();
    renderSkeletons();
    updateCartUI();
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
    } catch (error) {
        console.error("Appwrite products load failed:", error);
        appData.products = [];
    }

    productsLoaded = true;
    renderProducts();
}

/* ------------------------------------------------------------------ */
/* Theme + language                                                   */
/* ------------------------------------------------------------------ */

function initTheme() {
    const savedTheme = storageGet(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "dark" : "light"), false);
}

function setTheme(theme, persist = true) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    if (persist) storageSet(THEME_STORAGE_KEY, normalizedTheme);

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle?.setAttribute("aria-pressed", String(normalizedTheme === "dark"));
    document.querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", normalizedTheme === "dark" ? "#161110" : "#FBF7F3");
}

function initLanguage() {
    const savedLang = storageGet(LANG_STORAGE_KEY);
    if (savedLang && appData.translations[savedLang]) currentLang = savedLang;
    applyLanguage();
}

function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    if (langSwitcher) langSwitcher.value = currentLang;
}

function updateTranslations() {
    const texts = appData.translations[currentLang];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key && typeof texts[key] === "string") element.textContent = texts[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (key && texts[key]) element.setAttribute("placeholder", texts[key]);
    });

    floatingCartBtn?.setAttribute("aria-label", t("open_cart"));
    document.getElementById("theme-toggle")?.setAttribute("aria-label", t("toggle_theme"));
    document.querySelectorAll(".close-modal, .close-cart, .close-lightbox").forEach((button) => {
        button.setAttribute("aria-label", t("close"));
    });
    document.querySelector(".qty-btn.minus")?.setAttribute("aria-label", t("decrease_qty"));
    document.querySelector(".qty-btn.plus")?.setAttribute("aria-label", t("increase_qty"));

    updateCustomerPhoneHelp();
    updateCheckoutState();
    updateContactState();
}

/* ------------------------------------------------------------------ */
/* Events                                                             */
/* ------------------------------------------------------------------ */

function setupEventListeners() {
    langSwitcher?.addEventListener("change", (event) => {
        currentLang = event.target.value;
        storageSet(LANG_STORAGE_KEY, currentLang);
        applyLanguage();
        updateTranslations();
        if (productsLoaded) renderProducts();
        updateOpenModalLanguage();
        updateCartUI();
    });

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });

    floatingCartBtn?.addEventListener("click", openCart);
    mobileCartBar?.addEventListener("click", openCart);
    document.querySelector(".close-cart")?.addEventListener("click", closeCart);
    cartOverlay?.addEventListener("click", closeCart);
    document.getElementById("cart-start-shopping")?.addEventListener("click", () => {
        closeCart();
        document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });

    /* Product grid: one delegated handler for all cards */
    document.getElementById("shop")?.addEventListener("click", handleShopClick);

    /* Modal */
    modal?.querySelectorAll("[data-close-modal]").forEach((element) => {
        element.addEventListener("click", closeModal);
    });

    imageLightbox?.addEventListener("click", (event) => {
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

    document.addEventListener("keydown", handleGlobalKeydown);
    document.addEventListener("pointerdown", () => {
        usingKeyboard = false;
    }, { passive: true });

    const modalQty = document.getElementById("modal-qty");
    document.querySelector(".qty-btn.plus")?.addEventListener("click", () => {
        if (modalQty) modalQty.value = String(Math.max(1, parseInt(modalQty.value || "1", 10) + 1));
        updateModalPrice();
    });
    document.querySelector(".qty-btn.minus")?.addEventListener("click", () => {
        if (modalQty && parseInt(modalQty.value || "1", 10) > 1) {
            modalQty.value = String(parseInt(modalQty.value, 10) - 1);
        }
        updateModalPrice();
    });
    modalQty?.addEventListener("input", updateModalPrice);
    modalQty?.addEventListener("change", () => {
        modalQty.value = String(Math.max(1, parseInt(modalQty.value || "1", 10) || 1));
        updateModalPrice();
    });

    document.getElementById("modal-add-to-cart")?.addEventListener("click", (event) => {
        event.preventDefault();
        if (!activeProduct) return;
        const qty = Math.max(1, parseInt(modalQty?.value || "1", 10) || 1);
        addToCart(activeProduct, qty);
        showModalCartFeedback();
    });
    document.getElementById("modal-go-to-cart")?.addEventListener("click", (event) => {
        event.preventDefault();
        closeModal({ restoreFocus: false });
        openCart();
    });
    document.getElementById("modal-continue")?.addEventListener("click", () => closeModal());

    /* Cart + checkout */
    document.getElementById("checkout-btn")?.addEventListener("click", submitOrder);
    document.getElementById("email-checkout-btn")?.addEventListener("click", submitEmailOrder);
    document.getElementById("checkout-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        submitOrder();
    });
    document.getElementById("customer-country")?.addEventListener("change", () => {
        updateCustomerPhoneHelp();
        saveCustomerDetails();
    });
    ["customer-name", "customer-phone"].forEach((id) => {
        document.getElementById(id)?.addEventListener("input", (event) => {
            clearFieldError(event.target);
            saveCustomerDetails();
        });
    });
    document.getElementById("footer-contact-form")?.addEventListener("submit", submitContactMessage);
    document.getElementById("cart-items")?.addEventListener("click", handleCartItemClick);
    document.getElementById("cart-items")?.addEventListener("input", handleCartQuantityInput);
    document.getElementById("cart-items")?.addEventListener("change", handleCartQuantityInput);

    /* Header shadow on scroll */
    const header = document.getElementById("site-header");
    const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    setupScrollSpy();
}

function restoreFocus() {
    if (usingKeyboard && lastFocusedElement?.isConnected) {
        lastFocusedElement.focus({ preventScroll: true });
    }
}

function handleGlobalKeydown(event) {
    usingKeyboard = true;
    if (event.key === "Escape") {
        if (imageLightbox?.classList.contains("active")) {
            closeImageLightbox();
        } else if (modal && !modal.hidden) {
            closeModal();
        } else if (cartSidebar?.classList.contains("active")) {
            closeCart();
        }
        return;
    }

    if (event.key === "Tab") {
        const container = imageLightbox?.classList.contains("active")
            ? imageLightbox
            : modal && !modal.hidden
                ? modal.querySelector(".modal-content")
                : cartSidebar?.classList.contains("active") ? cartSidebar : null;
        if (container) trapFocus(container, event);
    }
}

function trapFocus(container, event) {
    const focusable = [...container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
    )].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function setupScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const chips = [...document.querySelectorAll("#category-chips a")];
    const visible = new Map();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let activeId = "";
        let best = 0;
        visible.forEach((ratio, id) => {
            if (ratio > best) {
                best = ratio;
                activeId = id;
            }
        });
        chips.forEach((chip) => {
            const isActive = chip.getAttribute("href") === `#${activeId}`;
            if (isActive && !chip.classList.contains("is-active")) {
                chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
            }
            chip.classList.toggle("is-active", isActive);
            if (isActive) chip.setAttribute("aria-current", "true");
            else chip.removeAttribute("aria-current");
        });
    }, { rootMargin: "-120px 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

    productGridIds.forEach((category) => {
        const section = document.getElementById(`${category}-section`);
        if (section) observer.observe(section);
    });
}

/* ------------------------------------------------------------------ */
/* Product rendering                                                  */
/* ------------------------------------------------------------------ */

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

function getProductCategory(product) {
    return productGridIds.includes(product.category) ? product.category : "offers";
}

function renderSkeletons() {
    productGridIds.forEach((category, index) => {
        const grid = document.getElementById(`${category}-grid`);
        const section = grid?.closest(".products-section");
        if (!grid || !section) return;
        if (index === 0) {
            section.hidden = false;
            grid.innerHTML = Array.from({ length: 4 }, () => `
                <div class="skeleton-card" aria-hidden="true">
                    <div class="sk-media"></div>
                    <div class="sk-line"></div>
                    <div class="sk-line short"></div>
                </div>
            `).join("");
        } else {
            section.hidden = true;
        }
    });
}

function renderCardAction(product) {
    const id = getProductId(product);
    const item = getCartItem(id);
    const name = escapeHtml(getLocalizedProductText(product, "name") || "Mais Beauty");

    if (!item) {
        return `
            <button class="btn btn-primary quick-add" type="button" data-action="quick-add" data-product-id="${escapeHtml(id)}" aria-label="${escapeHtml(t("add_to_cart"))}: ${name}">
                ${icon("bag")}
                <span>${escapeHtml(t("quick_add"))}</span>
            </button>
        `;
    }

    const isLast = item.qty <= 1;
    return `
        <div class="stepper card-stepper" role="group" aria-label="${escapeHtml(t("whatsapp_quantity"))}: ${name}">
            <button type="button" data-action="${isLast ? "card-remove" : "card-decrease"}" data-product-id="${escapeHtml(id)}" aria-label="${escapeHtml(isLast ? t("delete_item") : t("decrease_qty"))}">
                ${icon(isLast ? "trash" : "minus")}
            </button>
            <span class="stepper-value" aria-live="polite">${item.qty}</span>
            <button type="button" data-action="card-increase" data-product-id="${escapeHtml(id)}" aria-label="${escapeHtml(t("increase_qty"))}">
                ${icon("plus")}
            </button>
        </div>
    `;
}

function renderProducts() {
    const counts = {};
    productGridIds.forEach((category) => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid) grid.innerHTML = "";
        counts[category] = 0;
    });

    const visibleProducts = appData.products
        .filter((product) => product.active !== false)
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

    if (visibleProducts.length === 0) {
        productGridIds.forEach((category, index) => {
            const grid = document.getElementById(`${category}-grid`);
            const section = grid?.closest(".products-section");
            if (!grid || !section) return;
            section.hidden = index !== 0;
            if (index === 0) {
                const emptyMsg = document.createElement("p");
                emptyMsg.className = "empty-msg";
                emptyMsg.textContent = t("empty_category");
                grid.appendChild(emptyMsg);
            }
        });
        updateCategoryVisibility(counts);
        return;
    }

    visibleProducts.forEach((product, index) => {
        const category = getProductCategory(product);
        const grid = document.getElementById(`${category}-grid`);
        if (!grid) return;
        counts[category] += 1;

        const id = getProductId(product);
        const name = getLocalizedProductText(product, "name") || "Mais Beauty";
        const description = getLocalizedProductText(product, "description");
        const imageUrl = product.imageUrl || "";
        const inCart = Boolean(getCartItem(id));

        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.productId = id;
        card.style.animationDelay = `${Math.min(index % 8, 7) * 40}ms`;
        card.innerHTML = `
            <button class="product-media" type="button" data-action="open" aria-label="${escapeHtml(t("view_details"))}: ${escapeHtml(name)}">
                ${imageUrl
                    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" class="product-image" loading="lazy" decoding="async">`
                    : `<span class="product-media-fallback">MB</span>`}
                ${category === "offers" ? `<span class="badge">${icon("sparkle")}${escapeHtml(t("offer_badge"))}</span>` : ""}
                <span class="badge badge-in-cart" data-in-cart-badge ${inCart ? "" : "hidden"}>${icon("check")}${escapeHtml(t("in_cart_badge"))}</span>
            </button>
            <div class="product-info">
                <h3 class="product-title"><button type="button" data-action="open">${escapeHtml(name)}</button></h3>
                ${description ? `<p class="product-desc">${escapeHtml(description)}</p>` : ""}
                <div class="product-bottom">
                    <p class="product-price">${formatPrice(getProductPriceUsd(product))}</p>
                    <div class="card-action" data-card-action="${escapeHtml(id)}">${renderCardAction(product)}</div>
                </div>
            </div>
        `;

        const image = card.querySelector(".product-image");
        image?.addEventListener("error", () => {
            image.replaceWith(Object.assign(document.createElement("span"), {
                className: "product-media-fallback",
                textContent: "MB"
            }));
        });

        grid.appendChild(card);
    });

    productGridIds.forEach((category) => {
        const grid = document.getElementById(`${category}-grid`);
        const section = grid?.closest(".products-section");
        if (section) section.hidden = counts[category] === 0;
    });
    updateCategoryVisibility(counts);
}

function updateCategoryVisibility(counts) {
    productGridIds.forEach((category) => {
        const count = counts[category] || 0;
        const chip = document.querySelector(`#category-chips a[data-section="${category}"]`);
        if (chip) chip.parentElement.hidden = productsLoaded && count === 0;
        document.querySelectorAll(`.footer-links a[href="#${category}-section"]`).forEach((link) => {
            link.parentElement.hidden = productsLoaded && count === 0;
        });
        const countEl = document.querySelector(`[data-count-for="${category}"]`);
        if (countEl) countEl.textContent = count ? countLabel(count) : "";
    });
}

/* Refresh only the add/stepper area of cards (keeps scroll + images untouched). */
function updateCardActions() {
    document.querySelectorAll(".product-card[data-product-id]").forEach((card) => {
        const id = card.dataset.productId;
        const product = findProduct(id);
        if (!product) return;
        const actionArea = card.querySelector(".card-action");
        const hadFocus = actionArea?.contains(document.activeElement);
        if (actionArea) actionArea.innerHTML = renderCardAction(product);
        const badge = card.querySelector("[data-in-cart-badge]");
        if (badge) badge.hidden = !getCartItem(id);
        if (hadFocus) {
            (actionArea.querySelector("[data-action='card-increase']") || actionArea.querySelector("button"))?.focus();
        }
    });
}

function handleShopClick(event) {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const id = card.dataset.productId;
    const product = findProduct(id);
    if (!product) return;

    const actionEl = event.target.closest("[data-action]");
    const action = actionEl?.dataset.action;

    if (action === "quick-add") {
        addToCart(product, 1);
        showAddedToast(product);
        return;
    }
    if (action === "card-increase") {
        changeCartQuantity(id, 1);
        return;
    }
    if (action === "card-decrease") {
        changeCartQuantity(id, -1);
        return;
    }
    if (action === "card-remove") {
        removeFromCart(id);
        return;
    }
    if (event.target.closest(".card-action")) return;

    openModal(product);
}

/* ------------------------------------------------------------------ */
/* Product modal                                                      */
/* ------------------------------------------------------------------ */

function lockScroll() {
    document.body.classList.add("no-scroll");
}

function unlockScroll() {
    const anyOpen = (modal && !modal.hidden) || cartSidebar?.classList.contains("active");
    if (!anyOpen) document.body.classList.remove("no-scroll");
}

function openModal(product, resetFeedback = true) {
    const wasOpen = modal && !modal.hidden;
    activeProduct = product;
    if (resetFeedback) hideModalCartFeedback();

    const image = document.getElementById("modal-img");
    const imageContainer = image?.closest(".modal-image-container");
    const imageUrl = product.imageUrl || "";
    const name = getLocalizedProductText(product, "name") || "Mais Beauty";

    if (image) {
        image.src = imageUrl;
        image.alt = name;
        image.style.display = imageUrl ? "block" : "none";
        image.onerror = () => {
            image.style.display = "none";
        };
    }
    if (imageContainer) imageContainer.querySelector(".zoom-hint").hidden = !imageUrl;

    const category = document.getElementById("modal-category");
    const title = document.getElementById("modal-title");
    const price = document.getElementById("modal-price");
    const desc = document.getElementById("modal-desc");
    const qty = document.getElementById("modal-qty");

    if (category) category.textContent = t(`${getProductCategory(product)}_title`);
    if (title) title.textContent = name;
    if (price) price.textContent = formatPrice(getProductPriceUsd(product));
    if (desc) {
        const description = getLocalizedProductText(product, "description");
        desc.textContent = description;
        desc.hidden = !description;
    }
    if (qty && resetFeedback) qty.value = 1;
    updateModalPrice();
    updateModalInCart();

    if (modal && !wasOpen) {
        dismissAllToasts();
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        modal.querySelector(".modal-details")?.scrollTo(0, 0);
        modal.querySelector(".modal-body")?.scrollTo(0, 0);
        lockScroll();
        updateMobileCartBar();
        requestAnimationFrame(() => modal.querySelector(".close-modal")?.focus({ preventScroll: true }));
    }
}

function closeModal(options = {}) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    closeImageLightbox();
    unlockScroll();
    updateMobileCartBar();
    if (options.restoreFocus !== false) restoreFocus();
}

function updateModalPrice() {
    const target = document.getElementById("modal-add-price");
    if (!target || !activeProduct) return;
    const qty = Math.max(1, parseInt(document.getElementById("modal-qty")?.value || "1", 10) || 1);
    target.textContent = formatPrice(getProductPriceUsd(activeProduct) * qty);
}

function updateModalInCart() {
    const target = document.getElementById("modal-in-cart");
    if (!target) return;
    const item = activeProduct ? getCartItem(getProductId(activeProduct)) : null;
    target.hidden = !item;
    if (item) target.textContent = t("in_cart_count").replace("{n}", String(item.qty));
}

function showModalCartFeedback() {
    const feedback = document.getElementById("modal-cart-feedback");
    const buy = modal?.querySelector(".modal-buy");
    if (feedback) feedback.hidden = false;
    if (buy) buy.hidden = true;
    updateModalInCart();
    document.getElementById("modal-go-to-cart")?.focus({ preventScroll: true });
}

function hideModalCartFeedback() {
    const feedback = document.getElementById("modal-cart-feedback");
    const buy = modal?.querySelector(".modal-buy");
    if (feedback) feedback.hidden = true;
    if (buy) buy.hidden = false;
}

function updateOpenModalLanguage() {
    if (!activeProduct || !modal || modal.hidden) return;
    openModal(activeProduct, false);
}

function openImageLightbox() {
    const modalImage = document.getElementById("modal-img");
    const lightboxImage = document.getElementById("lightbox-img");
    if (!modalImage?.getAttribute("src") || !lightboxImage || !imageLightbox) return;

    lightboxImage.src = modalImage.src;
    lightboxImage.alt = modalImage.alt;
    imageLightbox.classList.add("active");
    imageLightbox.setAttribute("aria-hidden", "false");
    imageLightbox.querySelector(".close-lightbox")?.focus({ preventScroll: true });
}

function closeImageLightbox() {
    if (!imageLightbox || !imageLightbox.classList.contains("active")) return;
    imageLightbox.classList.remove("active");
    imageLightbox.setAttribute("aria-hidden", "true");
    document.getElementById("modal-img")?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* Cart drawer                                                        */
/* ------------------------------------------------------------------ */

function openCart() {
    if (!cartSidebar) return;
    closeModal({ restoreFocus: false });
    lastFocusedElement = document.activeElement;
    cartSidebar.classList.add("active");
    cartSidebar.setAttribute("aria-hidden", "false");
    if (cartOverlay) cartOverlay.hidden = false;
    floatingCartBtn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("cart-open");
    dismissAllToasts();
    lockScroll();
    updateMobileCartBar();
    requestAnimationFrame(() => cartSidebar.querySelector(".close-cart")?.focus({ preventScroll: true }));
}

function closeCart() {
    if (!cartSidebar?.classList.contains("active")) return;
    cartSidebar.classList.remove("active");
    cartSidebar.setAttribute("aria-hidden", "true");
    if (cartOverlay) cartOverlay.hidden = true;
    floatingCartBtn?.setAttribute("aria-expanded", "false");
    unlockScroll();
    document.body.classList.remove("cart-open");
    updateMobileCartBar();
    restoreFocus();
}

function getCartStorageItem(product) {
    const productId = product?.$id || product?.id || "";
    if (!productId) return null;

    return {
        $id: productId,
        name: product.name || "",
        description: product.description || "",
        nameAr: product.nameAr || "",
        nameEn: product.nameEn || "",
        nameDe: product.nameDe || "",
        descriptionAr: product.descriptionAr || "",
        descriptionEn: product.descriptionEn || "",
        descriptionDe: product.descriptionDe || "",
        priceUsdCents: Number(product.priceUsdCents) || 0,
        imageUrl: product.imageUrl || "",
        category: product.category || "",
        qty: Math.max(1, Number.parseInt(product.qty, 10) || 1)
    };
}

function loadCartFromStorage() {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (!storedCart) return;

        const parsedCart = JSON.parse(storedCart);
        if (!Array.isArray(parsedCart)) {
            cart = [];
            localStorage.removeItem(CART_STORAGE_KEY);
            return;
        }

        cart = parsedCart
            .map(getCartStorageItem)
            .filter(Boolean);
    } catch (error) {
        cart = [];
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch (storageError) {
            cart = [];
        }
    }
}

function saveCartToStorage() {
    try {
        const cartPayload = cart
            .map(getCartStorageItem)
            .filter(Boolean);

        if (cartPayload.length) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartPayload));
        } else {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    } catch (error) {
        /* storage unavailable - cart still works for this visit */
    }
}

function addToCart(product, qty) {
    const id = getProductId(product);
    if (!id) return;
    const existing = getCartItem(id);
    const safeQty = Math.max(1, Number(qty) || 1);
    if (existing) {
        existing.qty += safeQty;
    } else {
        const item = getCartStorageItem(product);
        item.qty = safeQty;
        cart.push(item);
    }
    saveCartToStorage();
    updateCartUI();
    bumpCartButton();
}

function bumpCartButton() {
    if (!floatingCartBtn) return;
    floatingCartBtn.classList.remove("bump");
    void floatingCartBtn.offsetWidth;
    floatingCartBtn.classList.add("bump");
}

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const totalValue = document.getElementById("cart-total-value");
    if (!cartItems || !cartCount || !totalValue) return;

    cartItems.innerHTML = cart.map((item) => {
        const itemPrice = getProductPriceUsd(item);
        const productName = escapeHtml(getLocalizedProductText(item, "name") || "Mais Beauty");
        const id = escapeHtml(item.$id);
        const isLast = item.qty <= 1;
        return `
            <div class="cart-item" data-product-id="${id}">
                <div class="cart-item-image">
                    ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy">` : ""}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-top">
                        <h4>${productName}</h4>
                        <span class="cart-line-total" data-line-total>${formatPrice(itemPrice * item.qty)}</span>
                    </div>
                    <p class="cart-unit-price">${escapeHtml(t("whatsapp_unit_price"))}: <bdi dir="ltr">${formatPrice(itemPrice)}</bdi></p>
                    <div class="cart-item-actions">
                        <div class="stepper cart-qty-controls" role="group" aria-label="${escapeHtml(t("whatsapp_quantity"))}">
                            <button class="cart-qty-btn" type="button" data-cart-action="decrease" data-product-id="${id}" aria-label="${escapeHtml(t("decrease_qty"))}" ${isLast ? "disabled" : ""}>${icon("minus")}</button>
                            <input class="cart-qty-input" type="number" min="1" value="${item.qty}" inputmode="numeric" data-product-id="${id}" aria-label="${escapeHtml(t("whatsapp_quantity"))}">
                            <button class="cart-qty-btn" type="button" data-cart-action="increase" data-product-id="${id}" aria-label="${escapeHtml(t("increase_qty"))}">${icon("plus")}</button>
                        </div>
                        <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${id}">${icon("trash")}${escapeHtml(t("delete_item"))}</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    const isEmpty = cart.length === 0;
    document.getElementById("cart-empty").hidden = !isEmpty;
    document.getElementById("checkout-form").hidden = isEmpty;
    document.getElementById("cart-footer").hidden = isEmpty;

    updateCartSummary();
    updateCardActions();
    updateModalInCart();
}

/* Counts, totals and the sticky bar - cheap, no list re-render. */
function updateCartSummary() {
    const count = getCartCount();
    const total = formatPrice(getCartTotal());
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = String(count);
        cartCount.dataset.count = String(count);
    }
    const totalValue = document.getElementById("cart-total-value");
    if (totalValue) totalValue.textContent = total;
    const titleCount = document.getElementById("cart-title-count");
    if (titleCount) titleCount.textContent = count ? `(${countLabel(count)})` : "";
    const mcbCount = document.getElementById("mcb-count");
    if (mcbCount) mcbCount.textContent = String(count);
    const mcbTotal = document.getElementById("mcb-total");
    if (mcbTotal) mcbTotal.textContent = total;
    updateMobileCartBar();
}

function updateMobileCartBar() {
    if (!mobileCartBar) return;
    const overlayOpen = (modal && !modal.hidden) || cartSidebar?.classList.contains("active");
    const show = cart.length > 0 && !overlayOpen;
    mobileCartBar.hidden = !show;
    document.body.classList.toggle("has-cart-bar", cart.length > 0);
}

function setCartQuantity(id, value) {
    const item = getCartItem(id);
    if (!item) return;
    item.qty = Math.max(1, Number.parseInt(value, 10) || 1);
    saveCartToStorage();
    updateCartUI();
}

function changeCartQuantity(id, delta) {
    const item = getCartItem(id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCartToStorage();
    updateCartUI();
}

function handleCartItemClick(event) {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    event.preventDefault();
    const action = button.dataset.cartAction;
    const id = button.dataset.productId;
    if (action === "remove") {
        removeFromCart(id);
        return;
    }

    changeCartQuantity(id, action === "increase" ? 1 : -1);
    /* keep keyboard focus on the same control after re-render */
    const selector = `.cart-item[data-product-id="${CSS.escape(id)}"] [data-cart-action="${action === "increase" ? "increase" : "decrease"}"]`;
    const target = document.querySelector(selector);
    if (target && !target.disabled) target.focus();
    else document.querySelector(`.cart-item[data-product-id="${CSS.escape(id)}"] .cart-qty-input`)?.focus();
}

function handleCartQuantityInput(event) {
    const input = event.target.closest(".cart-qty-input");
    if (!input) return;
    if (input.value.trim() === "") return;

    const id = input.dataset.productId;
    if (event.type === "input") {
        clearTimeout(cartQuantityInputTimer);
        cartQuantityInputTimer = setTimeout(() => {
            const item = getCartItem(id);
            if (!item) return;
            item.qty = Math.max(1, Number.parseInt(input.value, 10) || 1);
            saveCartToStorage();
            const lineTotal = input.closest(".cart-item")?.querySelector("[data-line-total]");
            if (lineTotal) lineTotal.textContent = formatPrice(getProductPriceUsd(item) * item.qty);
            updateCartSummary();
            updateCardActions();
        }, 300);
        return;
    }

    clearTimeout(cartQuantityInputTimer);
    setCartQuantity(id, input.value);
}

function removeFromCart(id) {
    const index = cart.findIndex((item) => item.$id === id);
    if (index === -1) return;
    const [removed] = cart.splice(index, 1);
    saveCartToStorage();
    updateCartUI();

    showToast({
        title: t("item_removed"),
        text: getLocalizedProductText(removed, "name"),
        image: removed.imageUrl,
        actionLabel: t("undo"),
        onAction: () => {
            if (getCartItem(removed.$id)) return;
            cart.splice(Math.min(index, cart.length), 0, removed);
            saveCartToStorage();
            updateCartUI();
        }
    });
}

/* ------------------------------------------------------------------ */
/* Toasts                                                             */
/* ------------------------------------------------------------------ */

function showToast({ title, text = "", image = "", actionLabel = "", onAction = null, duration = 4500 }) {
    if (!toastRegion) return;
    clearTimeout(toastTimer);
    toastRegion.innerHTML = "";

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        ${image ? `<img class="toast-thumb" src="${escapeHtml(image)}" alt="">` : ""}
        <div class="toast-text">
            <strong>${escapeHtml(title)}</strong>
            ${text ? `<span>${escapeHtml(text)}</span>` : ""}
        </div>
        ${actionLabel ? `<button type="button" class="toast-action">${escapeHtml(actionLabel)}</button>` : ""}
    `;
    toast.querySelector(".toast-thumb")?.addEventListener("error", (event) => event.target.remove());
    toast.querySelector(".toast-action")?.addEventListener("click", () => {
        onAction?.();
        dismissToast(toast);
    });
    toastRegion.appendChild(toast);
    toastTimer = setTimeout(() => dismissToast(toast), duration);
}

function dismissToast(toast) {
    if (!toast.isConnected) return;
    toast.classList.add("is-leaving");
    setTimeout(() => toast.remove(), 250);
}

function dismissAllToasts() {
    clearTimeout(toastTimer);
    toastRegion?.querySelectorAll(".toast").forEach(dismissToast);
}

function showAddedToast(product) {
    showToast({
        title: t("cart_added"),
        text: getLocalizedProductText(product, "name"),
        image: product.imageUrl,
        actionLabel: t("view_cart"),
        onAction: openCart
    });
}

/* ------------------------------------------------------------------ */
/* Checkout + contact                                                 */
/* ------------------------------------------------------------------ */

function updateCheckoutState() {
    const checkoutBtn = document.getElementById("checkout-btn");
    const emailCheckoutBtn = document.getElementById("email-checkout-btn");

    if (checkoutBtn) {
        checkoutBtn.disabled = !shopWhatsAppNumber;
        checkoutBtn.title = shopWhatsAppNumber ? "" : t("missing_whatsapp_alert");
    }

    if (emailCheckoutBtn) {
        emailCheckoutBtn.disabled = !shopOrderEmail;
        emailCheckoutBtn.title = shopOrderEmail ? "" : t("missing_email_alert");
    }
}

function updateContactState() {
    const contactSubmit = document.getElementById("footer-contact-submit");
    if (!contactSubmit) return;

    contactSubmit.disabled = !shopContactEmail;
    contactSubmit.title = shopContactEmail ? "" : t("contact_missing_email_alert");
}

function showInlineError(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) {
        alert(message);
        return;
    }
    element.textContent = message;
    element.hidden = false;
}

function hideInlineError(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.hidden = true;
}

function setFieldError(input, message) {
    if (!input) return;
    input.setAttribute("aria-invalid", "true");
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
        input.setAttribute("aria-describedby", errorEl.id);
    }
    input.focus();
    input.scrollIntoView({ block: "center", behavior: "smooth" });
}

function clearFieldError(input) {
    if (!input) return;
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) errorEl.hidden = true;
    hideInlineError("checkout-error");
}

function submitContactMessage(event) {
    event.preventDefault();
    const customerName = document.getElementById("footer-contact-name")?.value.trim() || "";
    const customerEmail = document.getElementById("footer-contact-customer-email")?.value.trim() || "";
    const message = document.getElementById("footer-contact-message")?.value.trim() || "";

    hideInlineError("contact-error");
    if (!shopContactEmail) {
        showInlineError("contact-error", t("contact_missing_email_alert"));
        return;
    }
    if (!customerName || !customerEmail || !message) {
        showInlineError("contact-error", t("contact_required_alert"));
        return;
    }

    const body = [
        `${t("contact_name")}: ${customerName}`,
        `${t("contact_customer_email")}: ${customerEmail}`,
        "",
        `${t("contact_message")}:`,
        message
    ].join("\n");

    window.location.href = `mailto:${shopContactEmail}?subject=${encodeURIComponent(t("contact_subject"))}&body=${encodeURIComponent(body)}`;
}

function getCustomerPhoneMode() {
    const selectedCountry = document.getElementById("customer-country")?.value || "";
    if (selectedCountry === "+963") return "syria";
    if (selectedCountry === "+49") return "germany";
    return "other";
}

function updateCustomerPhoneHelp() {
    const mode = getCustomerPhoneMode();
    const phoneInput = document.getElementById("customer-phone");
    const phoneHelp = document.getElementById("customer-phone-help");

    if (phoneInput) phoneInput.placeholder = t(`customer_phone_placeholder_${mode}`);
    if (phoneHelp) phoneHelp.textContent = t(`customer_phone_help_${mode}`);
}

function saveCustomerDetails() {
    storageSet(CUSTOMER_STORAGE_KEY, JSON.stringify({
        name: document.getElementById("customer-name")?.value || "",
        country: document.getElementById("customer-country")?.value ?? "+963",
        phone: document.getElementById("customer-phone")?.value || ""
    }));
}

function loadCustomerDetails() {
    try {
        const saved = JSON.parse(storageGet(CUSTOMER_STORAGE_KEY) || "null");
        if (!saved) return;
        const nameInput = document.getElementById("customer-name");
        const countrySelect = document.getElementById("customer-country");
        const phoneInput = document.getElementById("customer-phone");
        if (nameInput && saved.name) nameInput.value = saved.name;
        if (countrySelect && typeof saved.country === "string"
            && [...countrySelect.options].some((option) => option.value === saved.country)) {
            countrySelect.value = saved.country;
        }
        if (phoneInput && saved.phone) phoneInput.value = saved.phone;
        updateCustomerPhoneHelp();
    } catch (error) {
        /* ignore corrupt data */
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
    const total = getCartTotal();
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

/* Validates the checkout form inline. Returns order data or null. */
function collectCheckoutData(channelReady, channelMissingKey) {
    const nameInput = document.getElementById("customer-name");
    const phoneInput = document.getElementById("customer-phone");
    const customerName = nameInput?.value.trim() || "";
    const customerPhoneValue = phoneInput?.value.trim() || "";
    const note = document.getElementById("customer-note")?.value.trim() || "";

    hideInlineError("checkout-error");
    clearFieldError(nameInput);
    clearFieldError(phoneInput);

    if (cart.length === 0) {
        showInlineError("checkout-error", t("empty_cart_alert"));
        return null;
    }
    if (!customerName) {
        setFieldError(nameInput, t("missing_name_alert"));
        return null;
    }
    if (!customerPhoneValue) {
        setFieldError(phoneInput, t("missing_phone_alert"));
        return null;
    }
    if (!channelReady) {
        showInlineError("checkout-error", t(channelMissingKey));
        return null;
    }

    const customerPhone = normalizeCustomerPhone(customerPhoneValue);
    if (!customerPhone) {
        setFieldError(phoneInput, t("invalid_phone_alert"));
        return null;
    }

    return { customerName, customerPhone, note };
}

function submitOrder() {
    const data = collectCheckoutData(Boolean(shopWhatsAppNumber), "missing_whatsapp_alert");
    if (!data) return;

    const message = createOrderMessage(data.customerName, data.customerPhone, data.note);
    const whatsappUrl = `https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    const opened = window.open(whatsappUrl, "_blank", "noopener");
    if (!opened) {
        window.location.href = whatsappUrl;
    }
}

function submitEmailOrder() {
    const data = collectCheckoutData(Boolean(shopOrderEmail), "missing_email_alert");
    if (!data) return;

    const subject = "Neue Bestellung - Mais Beauty";
    const message = createOrderMessage(data.customerName, data.customerPhone, data.note);
    window.location.href = `mailto:${shopOrderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
