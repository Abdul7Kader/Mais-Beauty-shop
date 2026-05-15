import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqt11M8_XT8SxAOKgWhHihT4SaCT5a_lU",
  authDomain: "mais-beauty-26563.firebaseapp.com",
  projectId: "mais-beauty-26563",
  storageBucket: "mais-beauty-26563.appspot.com",
  messagingSenderId: "998082537742",
  appId: "1:998082537742:web:45c03a8106773ff14a0f5f",
  measurementId: "G-PWFTVKMMVT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mais Beauty Store Logic
const EXCHANGE_RATE_SYP = 15000;

const appData = {
    translations: {
        ar: {
            logo: "Mais Beauty",
            hero_tagline: 'جمالك يبدأ من هنا - منتجات ألمانية أصلية',
            offers_title: 'العروض الخاصة',
            serums_title: 'السيرومات والأمبولات',
            masks_title: 'ماسكات الوجه',
            eyes_title: 'لزقات العين',
            creams_title: 'كريمات الوجه',
            contact_us: 'تواصل معنا',
            empty_category: 'سيتم إضافة المنتجات قريباً...',
            add_to_cart: 'إضافة للسلة',
            currency_syp: "ل.س",
            currency_usd: "$",
            your_cart: "سلة المشتريات",
            total: "الإجمالي:",
            checkout: "إتمام الطلب (عبر الإيميل)",
            quantity: "الكمية:",
            view_details: "عرض التفاصيل"
        },
        en: {
            logo: 'Mais Beauty',
            hero_tagline: 'Your beauty starts here - Original German products',
            offers_title: 'Special Offers',
            serums_title: 'Serums & Ampoules',
            masks_title: 'Face Masks',
            eyes_title: 'Eye Pads',
            creams_title: 'Face Creams',
            contact_us: 'Contact Us',
            empty_category: 'Products coming soon...',
            add_to_cart: 'Add to Cart',
            currency_syp: 'SYP',
            currency_usd: '$',
            your_cart: "Your Cart",
            total: "Total:",
            checkout: "Checkout (via Email)",
            quantity: "Quantity:",
            view_details: "View Details"
        },
        de: {
            logo: "Mais Beauty",
            hero_tagline: 'Ihre Schönheit beginnt hier - Original deutsche Produkte',
            offers_title: "Angebote",
            serums_title: "Seren",
            masks_title: "Masken",
            eyes_title: "Augenpads",
            creams_title: "Cremes",
            contact_us: "Kontaktiere uns",
            empty_category: "Produkte folgen in Kürze...",
            add_to_cart: 'In den Warenkorb',
            currency_syp: "SYP",
            currency_usd: "$",
            your_cart: "Warenkorb",
            total: "Gesamt:",
            checkout: "Bestellen (per E-Mail)",
            quantity: "Menge:",
            view_details: "Details anzeigen"
        }
    },
    products: []
};

// State
let currentLang = 'ar';
let currentCurrency = 'SYP';
let cart = [];

// DOM Elements
const langSwitcher = document.getElementById('lang-switcher');
const currencySwitcher = document.getElementById('currency-switcher');
const modal = document.getElementById('product-modal');
const cartSidebar = document.getElementById('cart-sidebar');
const floatingCartBtn = document.getElementById('floating-cart-btn');

// Initialize
function init() {
    initTheme();
    setupEventListeners();
    updateTranslations();

    // Listen to Firebase Real-time updates
    const productsRef = collection(db, "products");
    onSnapshot(productsRef, (snapshot) => {
        appData.products = [];
        snapshot.forEach((doc) => {
            appData.products.push({ id: doc.id, ...doc.data() });
        });
        renderProducts();
    });
}

function initTheme() {
    const savedTheme = localStorage.getItem('beauty_store_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = '🌙';
    }
}

function setupEventListeners() {
    langSwitcher.addEventListener('change', (e) => {
        currentLang = e.target.value;
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        renderProducts();
        updateTranslations();
        updateCartUI();
    });

    currencySwitcher.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        renderProducts();
        updateCartUI();
    });

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('beauty_store_theme', newTheme);
            
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    floatingCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    document.querySelector('.qty-btn.plus').addEventListener('click', () => {
        const input = document.getElementById('modal-qty');
        input.value = parseInt(input.value) + 1;
    });

    document.querySelector('.qty-btn.minus').addEventListener('click', () => {
        const input = document.getElementById('modal-qty');
        if (input.value > 1) input.value = parseInt(input.value) - 1;
    });

    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
        if (!activeProduct) return;
        const qty = parseInt(document.getElementById('modal-qty').value);
        addToCart(activeProduct, qty);
        modal.style.display = 'none';
    });

    document.getElementById('checkout-btn').addEventListener('click', submitOrder);

    // Smart Navbar Logic
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

function formatPrice(usd) {
    const texts = appData.translations[currentLang];
    if (currentCurrency === 'SYP') {
        const syp = Math.round(usd * EXCHANGE_RATE_SYP);
        return `${syp.toLocaleString()} ${texts.currency_syp}`;
    }
    return `${texts.currency_usd}${usd.toFixed(2)}`;
}

function updateTranslations() {
    const texts = appData.translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) el.textContent = texts[key];
    });
}

function renderProducts() {
    const categories = ['offers', 'serums', 'masks', 'eyes', 'creams'];
    const texts = appData.translations[currentLang];

    categories.forEach(cat => {
        const grid = document.getElementById(`${cat}-grid`);
        if (!grid) return;
        
        grid.innerHTML = '';
        const categoryProducts = appData.products.filter(p => p.category === cat);
        
        if (categoryProducts.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-msg';
            emptyMsg.textContent = texts.empty_category;
            grid.appendChild(emptyMsg);
            return;
        }

        categoryProducts.forEach(product => {
            const localData = product.locales[currentLang];
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${localData.title}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${localData.title}</h3>
                    <p class="product-desc">${localData.desc}</p>
                    <p class="product-price">${formatPrice(product.priceUSD)}</p>
                    <button class="view-btn">${texts.view_details}</button>
                </div>
            `;
            
            card.querySelector('.view-btn').addEventListener('click', () => openModal(product));
            grid.appendChild(card);
        });
    });
}

let activeProduct = null;
function openModal(product) {
    activeProduct = product;
    const localData = product.locales[currentLang];
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').textContent = localData.title;
    document.getElementById('modal-price').textContent = formatPrice(product.priceUSD);
    document.getElementById('modal-desc').textContent = localData.longDesc || localData.desc;
    document.getElementById('modal-qty').value = 1;
    
    modal.style.display = 'block';
}

function addToCart(product, qty) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    updateCartUI();
    cartSidebar.classList.add('active');
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalValue = document.getElementById('cart-total-value');
    
    cartItems.innerHTML = '';
    let totalUSD = 0;
    let count = 0;

    cart.forEach(item => {
        const localData = item.locales[currentLang];
        totalUSD += item.priceUSD * item.qty;
        count += item.qty;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="">
            <div>
                <h4>${localData.title}</h4>
                <p>${item.qty} x ${formatPrice(item.priceUSD)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">&times;</button>
        `;
        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    totalValue.textContent = formatPrice(totalUSD);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function submitOrder() {
    if (cart.length === 0) return;
    
    let orderDetails = cart.map(item => {
        return `${item.locales[currentLang].title} (x${item.qty}) - ${formatPrice(item.priceUSD * item.qty)}`;
    }).join('\n');
    
    const total = document.getElementById('cart-total-value').textContent;
    const subject = `طلب جديد من متجر ميس بيوتي - ${new Date().toLocaleDateString()}`;
    const body = `تفاصيل الطلب:\n\n${orderDetails}\n\nالإجمالي: ${total}\n\nالرجاء التواصل معي لإتمام الدفع والتوصيل.`;
    
    const mailtoLink = `mailto:mais.elwan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

window.removeFromCart = removeFromCart;
document.addEventListener('DOMContentLoaded', init);
