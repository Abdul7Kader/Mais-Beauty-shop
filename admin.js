import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const storage = getStorage(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');
    const productCount = document.getElementById('product-count');

    // Admin Login Logic (Firebase Auth)
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

        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                // Success handled by onAuthStateChanged
                loginError.style.display = 'none';
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
        signOut(auth);
    });

    // Listen to Auth State
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginContainer.style.display = 'none';
            adminContent.style.display = 'block';
        } else {
            loginContainer.style.display = 'block';
            adminContent.style.display = 'none';
        }
    });

    // Listen to products from Firebase
    let products = [];
    onSnapshot(collection(db, "products"), (snapshot) => {
        products = [];
        snapshot.forEach((d) => {
            products.push({ id: d.id, ...d.data() });
        });
        renderAdminProducts();
    });

    // Render existing products
    function renderAdminProducts() {
        productList.innerHTML = '';
        productCount.textContent = products.length;

        if (products.length === 0) {
            productList.innerHTML = '<p style="text-align:center; color:#888;">لا يوجد منتجات مضافة بعد.</p>';
            return;
        }

        // Reverse array to show newest first
        [...products].reverse().forEach((p) => {
            const div = document.createElement('div');
            div.className = 'product-item';
            
            const arTitle = p.locales.ar.title;
            const catLabel = getCategoryLabel(p.category);

            div.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <img src="${p.image}" alt="Product Image" onerror="this.src='assets/placeholder.jpg'">
                    <div class="product-info">
                        <h3>${arTitle}</h3>
                        <p><strong>${catLabel}</strong> | $${p.priceUSD.toFixed(2)}</p>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="deleteProduct('${p.id}')">حذف</button>
            `;
            productList.appendChild(div);
        });
    }

    function getCategoryLabel(cat) {
        const labels = {
            'offers': 'عروض خاصة',
            'serums': 'سيرومات',
            'masks': 'ماسكات وجه',
            'eyes': 'لزقات عين',
            'creams': 'كريمات'
        };
        return labels[cat] || cat;
    }

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get file
        const fileInput = document.getElementById('p-image-file');
        const file = fileInput.files[0];
        if (!file) {
            alert('Bitte wähle ein Bild aus! (الرجاء اختيار صورة)');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Lädt hoch... / جاري الرفع...';
        submitBtn.disabled = true;

        try {
            // Upload Image to Firebase Storage
            const storageRef = ref(storage, 'products/' + Date.now() + '_' + file.name);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            // Get other values
            const category = document.getElementById('p-category').value;
            const priceUSD = parseFloat(document.getElementById('p-price').value);

            const titleAR = document.getElementById('p-title-ar').value;
            const descAR = document.getElementById('p-desc-ar').value;

            const titleEN = document.getElementById('p-title-en').value || titleAR;
            const descEN = document.getElementById('p-desc-en').value || descAR;

            const titleDE = document.getElementById('p-title-de').value || titleAR;
            const descDE = document.getElementById('p-desc-de').value || descAR;

            // Create Product Object
            const newProduct = {
                category: category,
                priceUSD: priceUSD,
                image: imageUrl,
                locales: {
                    ar: { title: titleAR, desc: descAR },
                    en: { title: titleEN, desc: descEN },
                    de: { title: titleDE, desc: descDE }
                }
            };

            await addDoc(collection(db, "products"), newProduct);
            form.reset();
            alert('Produkt erfolgreich hinzugefügt! (تم إضافة المنتج بنجاح!)');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Fehler beim Speichern. Hast du Firebase Storage aktiviert? (حدث خطأ أثناء حفظ المنتج)');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Delete Product Function
    window.deleteProduct = async function(id) {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذه الخطوة!')) {
            try {
                await deleteDoc(doc(db, "products", id));
            } catch (error) {
                console.error("Error removing document: ", error);
                alert('حدث خطأ أثناء الحذف.');
            }
        }
    };

    // Initial render
    renderAdminProducts();
});
