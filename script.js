import { Client, Databases } from "https://cdn.jsdelivr.net/npm/appwrite@16.1.0/+esm";

const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "6a0d8738002fb76a4caf";
const APPWRITE_DATABASE_ID = "mais_beauty_db";
const APPWRITE_PRODUCTS_COLLECTION_ID = "products";

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
            empty_category: "سيتم إضافة المنتجات قريباً...",
            add_to_cart: "إضافة للسلة",
            your_cart: "سلة المشتريات",
            total: "الإجمالي:",
            checkout: "إتمام الطلب (عبر الإيميل)",
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
            empty_category: "Products coming soon...",
            add_to_cart: "Add to Cart",
            your_cart: "Your Cart",
            total: "Total:",
            checkout: "Checkout (via Email)",
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
            empty_category: "Produkte folgen in Kürze...",
            add_to_cart: "In den Warenkorb",
            your_cart: "Warenkorb",
            total: "Gesamt:",
            checkout: "Bestellen (per E-Mail)",
            quantity: "Menge:",
            view_details: "Details anzeigen"
        }
    },
    products: []
};

let currentLang = "ar";
let cart = [];
let activeProduct = null;

const productGridIds = ["offers", "serums", "masks", "eyes", "creams"];
const langSwitcher = document.getElementById("lang-switcher");
const modal = document.getElementById("product-modal");
const cartSidebar = document.getElementById("cart-sidebar");
const floatingCartBtn = document.getElementById("floating-cart-btn");

function init() {
    initTheme();
    setupEventListeners();
    updateTranslations();
    loadProducts();
}

async function loadProducts() {
    const offersGrid = document.getElementById("offers-grid");
    if (offersGrid) {
        offersGrid.innerHTML = `<p class="empty-msg">${appData.translations[currentLang].empty_category}</p>`;
    }

    try {
        const response = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION_ID
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

    document.getElementById("modal-add-to-cart")?.addEventListener("click", () => {
        if (!activeProduct) return;
        const qty = parseInt(document.getElementById("modal-qty")?.value || "1", 10);
        addToCart(activeProduct, qty);
        if (modal) modal.style.display = "none";
    });

    document.getElementById("checkout-btn")?.addEventListener("click", submitOrder);

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

function updateTranslations() {
    const texts = appData.translations[currentLang];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key && texts[key]) element.textContent = texts[key];
    });
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

        const name = product.name || "Mais Beauty";
        const description = product.description || "";
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

        card.querySelector(".view-btn")?.addEventListener("click", () => openModal(product));
        grid.appendChild(card);
    });

    productGridIds.forEach((category) => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid && grid.children.length === 0) {
            grid.appendChild(createEmptyMessage());
        }
    });
}

function openModal(product) {
    activeProduct = product;
    const image = document.getElementById("modal-img");
    const imageUrl = product.imageUrl || "";

    if (image) {
        image.src = imageUrl;
        image.alt = product.name || "";
        image.style.display = imageUrl ? "block" : "none";
        image.onerror = () => {
            image.style.display = "none";
        };
    }

    const title = document.getElementById("modal-title");
    const price = document.getElementById("modal-price");
    const desc = document.getElementById("modal-desc");
    const qty = document.getElementById("modal-qty");

    if (title) title.textContent = product.name || "Mais Beauty";
    if (price) price.textContent = formatPrice(getProductPriceUsd(product));
    if (desc) desc.textContent = product.description || "";
    if (qty) qty.value = 1;
    if (modal) modal.style.display = "block";
}

function addToCart(product, qty) {
    const existing = cart.find((item) => item.$id === product.$id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    updateCartUI();
    cartSidebar?.classList.add("active");
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
        totalUSD += itemPrice * item.qty;
        count += item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="">` : "<span></span>"}
            <div>
                <h4>${item.name || "Mais Beauty"}</h4>
                <p>${item.qty} x ${formatPrice(itemPrice)}</p>
            </div>
            <button class="remove-item" type="button" onclick="removeFromCart('${item.$id}')">&times;</button>
        `;
        cartItems.appendChild(div);
    });

    cartCount.textContent = String(count);
    totalValue.textContent = formatPrice(totalUSD);
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.$id !== id);
    updateCartUI();
}

function submitOrder() {
    if (cart.length === 0) return;

    const orderDetails = cart.map((item) => {
        return `${item.name || "Mais Beauty"} (x${item.qty}) - ${formatPrice(getProductPriceUsd(item) * item.qty)}`;
    }).join("\n");

    const total = document.getElementById("cart-total-value")?.textContent || "$0.00";
    const subject = `طلب جديد من متجر ميس بيوتي - ${new Date().toLocaleDateString()}`;
    const body = `تفاصيل الطلب:\n\n${orderDetails}\n\nالإجمالي: ${total}\n\nالرجاء التواصل معي لإتمام الدفع والتوصيل.`;

    window.location.href = `mailto:mais.elwan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

window.removeFromCart = removeFromCart;
document.addEventListener("DOMContentLoaded", init);
