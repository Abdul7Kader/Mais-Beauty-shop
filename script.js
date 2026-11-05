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
            announce_1: "منتجات ألمانية أصلية 100%",
            you_save: "وفّرت {x}",
            discount_note: "خصم {n}%، بدلاً من {x}",
            announce_2: "اطلب خلال دقيقة عبر واتساب - بدون تسجيل",
            announce_3: "بدون دفع إلكتروني - نؤكد طلبك معك شخصياً",
            usp_order_short: "بدون تسجيل",
            shop_by_category: "تسوّق حسب الفئة",
            sort_label: "ترتيب",
            sort_recommended: "مقترح",
            sort_price_asc: "السعر: من الأقل",
            sort_price_desc: "السعر: من الأعلى",
            sort_name: "الاسم: أ - ي",
            show_more: "عرض الكل ({n})",
            show_less: "عرض أقل",
            faq_title: "أسئلة شائعة",
            faq1_q: "هل أحتاج إلى الدفع عبر الإنترنت؟",
            faq1_a: "لا. لا يوجد دفع إلكتروني. ترسل طلبك ثم نتواصل معك مباشرة لتأكيده.",
            faq2_q: "هل أحتاج إلى حساب؟",
            faq2_a: "لا. يكفي اسمك ورقم هاتفك. نحفظ بياناتك على جهازك فقط لتسهيل طلبك القادم.",
            faq3_q: "هل المنتجات أصلية؟",
            faq3_a: "نعم، جميع المنتجات أصلية ومختارة بعناية من علامات ألمانية وأوروبية.",
            faq4_q: "ماذا يحدث بعد إرسال الطلب؟",
            faq4_a: "تصلنا رسالة طلبك عبر واتساب أو البريد الإلكتروني، ثم نرد عليك لتأكيد الطلب.",
            search: "بحث",
            search_placeholder: "ابحث عن سيروم، ماسك...",
            cancel: "إلغاء",
            search_categories: "الفئات",
            search_results: "النتائج: {n}",
            search_no_results: "لا توجد نتائج. جرّب كلمة أخرى.",
            menu: "القائمة",
            menu_categories: "الفئات",
            menu_language: "اللغة",
            menu_theme: "المظهر",
            theme_light: "فاتح",
            theme_dark: "داكن",
            pdp_trust_order: "اطلب عبر واتساب أو البريد",
            pdp_trust_payment: "بدون دفع إلكتروني",
            pdp_description: "الوصف",
            related_title: "قد يعجبك أيضاً",
            cart_related_title: "أكمل روتينك",
            progress_cart: "السلة",
            progress_details: "بياناتك",
            progress_send: "الإرسال",
            details_title: "بياناتك للطلب",
            done_heading: "إرسال الطلب",
            checkout_intro: "لا حاجة لحساب. نحتاج فقط اسمك ورقمك لتأكيد الطلب.",
            edit_cart: "تعديل السلة",
            continue_to_details: "متابعة الطلب",
            done_title: "طلبك جاهز!",
            done_text_whatsapp: "فتحنا واتساب مع رسالة طلبك. اضغط «إرسال» هناك لإتمام الطلب، وسنرد عليك قريباً.",
            done_text_email: "فتحنا بريدك الإلكتروني مع رسالة طلبك. اضغط «إرسال» هناك لإتمام الطلب، وسنرد عليك قريباً.",
            done_resend: "فتح الرسالة مرة أخرى",
            done_finish: "تم الإرسال - تفريغ السلة",
            done_back: "العودة إلى الطلب",
            order_thanks: "شكراً لك! سنتواصل معك قريباً.",
            back: "رجوع",
            back_to_top: "إلى الأعلى",
            all_products: "{n} منتج",
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
            announce_1: "100% original German products",
            you_save: "You save {x}",
            discount_note: "{n}% off, was {x}",
            announce_2: "Order in a minute via WhatsApp - no sign-up",
            announce_3: "No online payment - we confirm your order personally",
            usp_order_short: "No sign-up",
            shop_by_category: "Shop by category",
            sort_label: "Sort",
            sort_recommended: "Recommended",
            sort_price_asc: "Price: low to high",
            sort_price_desc: "Price: high to low",
            sort_name: "Name: A - Z",
            show_more: "Show all ({n})",
            show_less: "Show less",
            faq_title: "FAQ",
            faq1_q: "Do I have to pay online?",
            faq1_a: "No. There is no online payment. You send your order and we contact you directly to confirm it.",
            faq2_q: "Do I need an account?",
            faq2_a: "No. Your name and phone number are enough. We only remember them on your device to make your next order faster.",
            faq3_q: "Are the products original?",
            faq3_a: "Yes, all products are original and carefully selected from German and European brands.",
            faq4_q: "What happens after I send my order?",
            faq4_a: "Your order message reaches us via WhatsApp or email, then we reply to confirm your order.",
            search: "Search",
            search_placeholder: "Search serums, masks...",
            cancel: "Cancel",
            search_categories: "Categories",
            search_results: "Results: {n}",
            search_no_results: "No results. Try another word.",
            menu: "Menu",
            menu_categories: "Categories",
            menu_language: "Language",
            menu_theme: "Appearance",
            theme_light: "Light",
            theme_dark: "Dark",
            pdp_trust_order: "Order via WhatsApp or email",
            pdp_trust_payment: "No online payment",
            pdp_description: "Description",
            related_title: "You may also like",
            cart_related_title: "Complete your routine",
            progress_cart: "Cart",
            progress_details: "Details",
            progress_send: "Send",
            details_title: "Your details",
            done_heading: "Send order",
            checkout_intro: "No account needed. We only need your name and number to confirm the order.",
            edit_cart: "Edit cart",
            continue_to_details: "Continue",
            done_title: "Your order is ready!",
            done_text_whatsapp: "We opened WhatsApp with your order message. Tap \u201cSend\u201d there to complete your order - we will reply soon.",
            done_text_email: "We opened your email app with your order message. Tap \u201cSend\u201d there to complete your order - we will reply soon.",
            done_resend: "Open message again",
            done_finish: "Sent - clear cart",
            done_back: "Back to order",
            order_thanks: "Thank you! We will contact you soon.",
            back: "Back",
            back_to_top: "Back to top",
            all_products: "{n} products",
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
            announce_1: "100 % Originalware aus Deutschland",
            you_save: "Du sparst {x}",
            discount_note: "{n} % Rabatt, statt {x}",
            announce_2: "In einer Minute per WhatsApp bestellt - ohne Konto",
            announce_3: "Keine Online-Zahlung - wir bestätigen persönlich",
            usp_order_short: "Ohne Konto",
            shop_by_category: "Nach Kategorie shoppen",
            sort_label: "Sortieren",
            sort_recommended: "Empfohlen",
            sort_price_asc: "Preis aufsteigend",
            sort_price_desc: "Preis absteigend",
            sort_name: "Name A - Z",
            show_more: "Alle anzeigen ({n})",
            show_less: "Weniger anzeigen",
            faq_title: "Häufige Fragen",
            faq1_q: "Muss ich online bezahlen?",
            faq1_a: "Nein. Es gibt keine Online-Zahlung. Du schickst deine Bestellung, wir melden uns direkt und bestätigen sie.",
            faq2_q: "Brauche ich ein Kundenkonto?",
            faq2_a: "Nein. Name und Telefonnummer reichen. Wir merken sie uns nur auf deinem Gerät, damit die nächste Bestellung schneller geht.",
            faq3_q: "Sind die Produkte original?",
            faq3_a: "Ja, alle Produkte sind Originalware, sorgfältig ausgewählt von deutschen und europäischen Marken.",
            faq4_q: "Was passiert nach dem Absenden?",
            faq4_a: "Deine Bestellnachricht kommt per WhatsApp oder E-Mail bei uns an, dann melden wir uns und bestätigen die Bestellung.",
            search: "Suche",
            search_placeholder: "Seren, Masken suchen...",
            cancel: "Abbrechen",
            search_categories: "Kategorien",
            search_results: "Treffer: {n}",
            search_no_results: "Keine Treffer. Versuch ein anderes Wort.",
            menu: "Menü",
            menu_categories: "Kategorien",
            menu_language: "Sprache",
            menu_theme: "Darstellung",
            theme_light: "Hell",
            theme_dark: "Dunkel",
            pdp_trust_order: "Bestellen per WhatsApp oder E-Mail",
            pdp_trust_payment: "Keine Online-Zahlung",
            pdp_description: "Beschreibung",
            related_title: "Das könnte dir gefallen",
            cart_related_title: "Ergänze deine Routine",
            progress_cart: "Warenkorb",
            progress_details: "Angaben",
            progress_send: "Senden",
            details_title: "Deine Angaben",
            done_heading: "Bestellung senden",
            checkout_intro: "Kein Konto nötig. Wir brauchen nur Name und Nummer, um die Bestellung zu bestätigen.",
            edit_cart: "Warenkorb bearbeiten",
            continue_to_details: "Weiter zur Bestellung",
            done_title: "Deine Bestellung ist fertig!",
            done_text_whatsapp: "WhatsApp ist mit deiner Bestellnachricht geöffnet. Tippe dort auf \u201eSenden\u201c - wir melden uns bald.",
            done_text_email: "Dein E-Mail-Programm ist mit deiner Bestellnachricht geöffnet. Tippe dort auf \u201eSenden\u201c - wir melden uns bald.",
            done_resend: "Nachricht erneut öffnen",
            done_finish: "Gesendet - Warenkorb leeren",
            done_back: "Zurück zur Bestellung",
            order_thanks: "Danke! Wir melden uns bald bei dir.",
            back: "Zurück",
            back_to_top: "Nach oben",
            all_products: "{n} Produkte",
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
let sortMode = "recommended";
let checkoutStep = "cart";
let lastOrder = null;
let historyPushed = false;
let ignoreNextPop = false;
const expandedSections = new Set();

const productGridIds = ["offers", "serums", "masks", "eyes", "creams"];
const SORT_STORAGE_KEY = "maisBeautySort";
const mobileQuery = window.matchMedia("(max-width: 640px)");
const langSwitcher = document.getElementById("lang-switcher");
const modal = document.getElementById("product-modal");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const floatingCartBtn = document.getElementById("floating-cart-btn");
const imageLightbox = document.getElementById("image-lightbox");
const mobileCartBar = document.getElementById("mobile-cart-bar");
const toastRegion = document.getElementById("toast-region");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("search-input");
const menuSheet = document.getElementById("menu-sheet");
const backToTop = document.getElementById("back-to-top");

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function t(key) {
    return appData.translations[currentLang][key] ?? appData.translations.en[key] ?? key;
}

function tn(key, n) {
    return t(key).replace("{n}", String(n));
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

function formatPrice(usd) {
    return `$${Number(usd || 0).toFixed(2)}`;
}

/* Admin sets discountPercent (0-90) per product; the price shown and charged is the reduced one. */
function getDiscountPercent(product) {
    const value = Math.round(Number(product?.discountPercent) || 0);
    return Math.min(90, Math.max(0, value));
}

function getOriginalPriceUsd(product) {
    return Number(product.priceUsdCents || 0) / 100;
}

function getProductPriceUsd(product) {
    const cents = Number(product.priceUsdCents || 0);
    return Math.round(cents * (100 - getDiscountPercent(product)) / 100) / 100;
}

/* Price markup: current price, plus struck-through original when discounted. */
function priceHtml(product, qty = 1) {
    const now = `<span class="price-now">${formatPrice(getProductPriceUsd(product) * qty)}</span>`;
    if (!getDiscountPercent(product)) return now;
    return `${now} <s class="price-was">${formatPrice(getOriginalPriceUsd(product) * qty)}</s>`;
}

function isOnOffer(product) {
    return getProductCategory(product) === "offers" || getDiscountPercent(product) > 0;
}

function offerBadgeHtml(product) {
    const discount = getDiscountPercent(product);
    if (discount) return `<span class="badge badge-sale"><bdi dir="ltr">-${discount}%</bdi></span>`;
    if (getProductCategory(product) === "offers") return `<span class="badge">${icon("sparkle")}${escapeHtml(t("offer_badge"))}</span>`;
    return "";
}

function getCartSavings() {
    return cart.reduce((sum, item) => sum + (getOriginalPriceUsd(item) - getProductPriceUsd(item)) * item.qty, 0);
}

function getLocalizedProductText(product, field) {
    const langSuffix = currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
    return product[`${field}${langSuffix}`] || product[field] || "";
}

function getProductName(product) {
    return getLocalizedProductText(product, "name") || "Mais Beauty";
}

function getProductCategory(product) {
    return productGridIds.includes(product.category) ? product.category : "offers";
}

function isMobile() {
    return mobileQuery.matches;
}

/* Lower-case, strip Arabic diacritics/letter variants and Latin accents so
   "serum", "Serum", "سيروم" and "سِيروم" match the same way. */
function normalizeSearch(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[ً-ٰٟـ]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/\s+/g, " ")
        .trim();
}

function getVisibleProducts() {
    const list = appData.products.filter((product) => product.active !== false);
    const byOrder = (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    if (sortMode === "price-asc") return list.sort((a, b) => getProductPriceUsd(a) - getProductPriceUsd(b) || byOrder(a, b));
    if (sortMode === "price-desc") return list.sort((a, b) => getProductPriceUsd(b) - getProductPriceUsd(a) || byOrder(a, b));
    if (sortMode === "name") return list.sort((a, b) => getProductName(a).localeCompare(getProductName(b), currentLang));
    return list.sort(byOrder);
}

function imageFallback(image) {
    image?.addEventListener("error", () => {
        image.replaceWith(Object.assign(document.createElement("span"), {
            className: "product-media-fallback",
            textContent: "MB"
        }));
    }, { once: true });
}

/* ------------------------------------------------------------------ */
/* Init + data                                                        */
/* ------------------------------------------------------------------ */

function init() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const savedSort = storageGet(SORT_STORAGE_KEY);
    if (["recommended", "price-asc", "price-desc", "name"].includes(savedSort)) sortMode = savedSort;
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = sortMode;

    initLanguage();
    initTheme();
    setupEventListeners();
    updateTranslations();
    loadCartFromStorage();
    loadCustomerDetails();
    renderSkeletons();
    updateCartUI();
    startAnnouncements();
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
                Query.limit(100)
            ]
        );

        appData.products = response.documents || [];
    } catch (error) {
        console.error("Appwrite products load failed:", error);
        appData.products = [];
    }

    productsLoaded = true;
    syncCartWithProducts();
    renderProducts();
    renderCartRelated();
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

    document.getElementById("theme-toggle")?.setAttribute("aria-pressed", String(normalizedTheme === "dark"));
    document.querySelectorAll("#theme-segmented [data-theme-value]").forEach((button) => {
        button.setAttribute("aria-checked", String(button.dataset.themeValue === normalizedTheme));
    });
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
    document.querySelectorAll("#lang-segmented [data-lang]").forEach((button) => {
        button.setAttribute("aria-checked", String(button.dataset.lang === currentLang));
    });
}

function setLanguage(lang) {
    if (!appData.translations[lang] || lang === currentLang) return;
    currentLang = lang;
    storageSet(LANG_STORAGE_KEY, currentLang);
    applyLanguage();
    updateTranslations();
    if (productsLoaded) renderProducts();
    updateOpenModalLanguage();
    updateCartUI();
    if (searchPanel && !searchPanel.hidden) renderSearch();
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
    document.getElementById("menu-btn")?.setAttribute("aria-label", t("menu"));
    document.getElementById("search-btn")?.setAttribute("aria-label", t("search"));
    document.getElementById("cart-back")?.setAttribute("aria-label", t("back"));
    backToTop?.setAttribute("aria-label", t("back_to_top"));
    searchInput?.setAttribute("aria-label", t("search"));
    searchPanel?.setAttribute("aria-label", t("search"));
    document.querySelectorAll(".close-modal, .close-cart, .close-lightbox, [data-close-menu].icon-btn").forEach((button) => {
        button.setAttribute("aria-label", t("close"));
    });
    document.querySelector(".qty-btn.minus")?.setAttribute("aria-label", t("decrease_qty"));
    document.querySelector(".qty-btn.plus")?.setAttribute("aria-label", t("increase_qty"));
    document.getElementById("modal-qty")?.setAttribute("aria-label", t("whatsapp_quantity"));

    updateCustomerPhoneHelp();
    updateCheckoutState();
    updateContactState();
    setCheckoutStep(checkoutStep, { focus: false });
}

function startAnnouncements() {
    const items = [...document.querySelectorAll("#announce-track .announce-item")];
    if (items.length < 2) return;
    let index = 0;
    setInterval(() => {
        if (document.hidden) return;
        items[index].classList.remove("is-active");
        index = (index + 1) % items.length;
        items[index].classList.add("is-active");
    }, 4000);
}

/* ------------------------------------------------------------------ */
/* Events                                                             */
/* ------------------------------------------------------------------ */

function setupEventListeners() {
    langSwitcher?.addEventListener("change", (event) => setLanguage(event.target.value));
    document.getElementById("lang-segmented")?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-lang]");
        if (button) setLanguage(button.dataset.lang);
    });

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });
    document.getElementById("theme-segmented")?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-theme-value]");
        if (button) setTheme(button.dataset.themeValue);
    });

    document.getElementById("sort-select")?.addEventListener("change", (event) => {
        sortMode = event.target.value;
        storageSet(SORT_STORAGE_KEY, sortMode);
        renderProducts();
    });

    floatingCartBtn?.addEventListener("click", openCart);
    mobileCartBar?.addEventListener("click", openCart);
    document.querySelector(".close-cart")?.addEventListener("click", closeCart);
    cartOverlay?.addEventListener("click", closeCart);
    document.getElementById("cart-start-shopping")?.addEventListener("click", () => {
        closeCart();
        scrollToTarget("shop");
    });
    document.getElementById("cart-back")?.addEventListener("click", () => {
        setCheckoutStep(checkoutStep === "done" ? "details" : "cart");
    });
    document.getElementById("cart-continue-btn")?.addEventListener("click", () => setCheckoutStep("details"));
    document.getElementById("order-review-edit")?.addEventListener("click", () => setCheckoutStep("cart"));
    document.getElementById("done-back")?.addEventListener("click", () => setCheckoutStep("details"));
    document.getElementById("done-resend")?.addEventListener("click", () => {
        if (lastOrder) openOrderChannel(lastOrder);
    });
    document.getElementById("done-finish")?.addEventListener("click", finishOrder);

    /* Search + menu */
    document.getElementById("search-trigger")?.addEventListener("click", openSearch);
    document.getElementById("search-btn")?.addEventListener("click", openSearch);
    searchPanel?.querySelectorAll("[data-close-search]").forEach((element) => {
        element.addEventListener("click", () => closeSearch());
    });
    searchInput?.addEventListener("input", renderSearch);
    searchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            searchInput.blur();
        }
    });
    document.getElementById("search-chips")?.addEventListener("click", (event) => {
        const chip = event.target.closest("[data-goto]");
        if (!chip) return;
        closeSearch({ restoreFocus: false });
        scrollToTarget(chip.dataset.goto);
    });

    document.getElementById("menu-btn")?.addEventListener("click", openMenu);
    menuSheet?.addEventListener("click", (event) => {
        const closer = event.target.closest("[data-close-menu]");
        if (!closer) return;
        const href = closer.getAttribute("href");
        if (href?.startsWith("#")) {
            event.preventDefault();
            closeMenu({ restoreFocus: false });
            scrollToTarget(href.slice(1));
            return;
        }
        closeMenu();
    });

    /* Product cards everywhere (grids, rails, search, sticky bar): one delegated handler */
    document.addEventListener("click", handleProductClick);

    document.getElementById("shop")?.addEventListener("click", (event) => {
        const more = event.target.closest("[data-show-more]");
        if (!more) return;
        const category = more.dataset.showMore;
        if (expandedSections.has(category)) {
            expandedSections.delete(category);
            renderProducts();
            document.getElementById(`${category}-section`)?.scrollIntoView({ block: "start" });
        } else {
            expandedSections.add(category);
            renderProducts();
        }
    });

    /* Modal */
    modal?.querySelectorAll("[data-close-modal]").forEach((element) => {
        element.addEventListener("click", () => closeModal());
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

    /* Header shadow + back-to-top on scroll */
    const header = document.getElementById("site-header");
    const onScroll = () => {
        header?.classList.toggle("is-scrolled", window.scrollY > 4);
        if (backToTop) backToTop.hidden = window.scrollY < 1400;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    /* Android/iOS back button closes the open sheet instead of leaving the shop */
    window.addEventListener("popstate", () => {
        if (ignoreNextPop) {
            ignoreNextPop = false;
            return;
        }
        if (!historyPushed) return;
        historyPushed = false;
        closeAllOverlays();
    });

    mobileQuery.addEventListener?.("change", () => {
        if (productsLoaded) renderProducts();
    });

    setupScrollSpy();
}

function scrollToTarget(id) {
    /* Wait a tick so a pending history.back() from a closed sheet has settled. */
    setTimeout(() => {
        const target = document.getElementById(id);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
}

function restoreFocus() {
    if (usingKeyboard && lastFocusedElement?.isConnected) {
        lastFocusedElement.focus({ preventScroll: true });
    }
}

function anyOverlayOpen() {
    return Boolean((modal && !modal.hidden)
        || cartSidebar?.classList.contains("active")
        || (searchPanel && !searchPanel.hidden)
        || (menuSheet && !menuSheet.hidden));
}

/* One history entry for "a sheet is open", so the phone's back button closes it. */
function overlayOpened() {
    if (!historyPushed) {
        try {
            history.pushState({ maisOverlay: true }, "");
            historyPushed = true;
        } catch (error) {
            historyPushed = false;
        }
    }
    lockScroll();
    updateMobileCartBar();
}

function overlayClosed() {
    unlockScroll();
    updateMobileCartBar();
    setTimeout(() => {
        if (!anyOverlayOpen() && historyPushed) {
            historyPushed = false;
            ignoreNextPop = true;
            history.back();
        }
    }, 0);
}

function closeAllOverlays() {
    closeImageLightbox();
    closeSearch({ restoreFocus: false });
    closeMenu({ restoreFocus: false });
    closeModal({ restoreFocus: false });
    closeCart();
}

function lockScroll() {
    document.documentElement.classList.add("no-scroll");
}

function unlockScroll() {
    if (!anyOverlayOpen()) document.documentElement.classList.remove("no-scroll");
}

function handleGlobalKeydown(event) {
    usingKeyboard = true;
    if (event.key === "Escape") {
        if (imageLightbox?.classList.contains("active")) closeImageLightbox();
        else if (searchPanel && !searchPanel.hidden) closeSearch();
        else if (menuSheet && !menuSheet.hidden) closeMenu();
        else if (modal && !modal.hidden) closeModal();
        else if (cartSidebar?.classList.contains("active")) closeCart();
        return;
    }

    if (event.key === "Tab") {
        let container = null;
        if (imageLightbox?.classList.contains("active")) container = imageLightbox;
        else if (searchPanel && !searchPanel.hidden) container = searchPanel.querySelector(".search-sheet");
        else if (menuSheet && !menuSheet.hidden) container = menuSheet.querySelector(".menu-panel");
        else if (modal && !modal.hidden) container = modal.querySelector(".modal-content");
        else if (cartSidebar?.classList.contains("active")) container = cartSidebar;
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
                const strip = chip.closest(".category-chips");
                if (strip) {
                    const chipBox = chip.getBoundingClientRect();
                    const stripBox = strip.getBoundingClientRect();
                    strip.scrollBy({ left: chipBox.left - stripBox.left - (stripBox.width - chipBox.width) / 2, behavior: "smooth" });
                }
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

function renderSkeletons() {
    productGridIds.forEach((category, index) => {
        const grid = document.getElementById(`${category}-grid`);
        const section = grid?.closest(".products-section");
        if (!grid || !section) return;
        if (index === 1) {
            section.hidden = false;
            grid.innerHTML = Array.from({ length: 6 }, () => `
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

/* variant: "card" (grid), "mini" (rails, search) or "bar" (sticky buy bar in the product sheet) */
function renderCardAction(product, variant = "card") {
    const id = escapeHtml(getProductId(product));
    const item = getCartItem(getProductId(product));
    const name = escapeHtml(getProductName(product));

    if (!item) {
        if (variant === "bar") {
            return `
                <button class="btn btn-primary btn-lg btn-block" type="button" data-action="quick-add" data-product-id="${id}">
                    ${icon("bag-plus")}
                    <span>${escapeHtml(t("add_to_cart"))}</span>
                </button>
            `;
        }
        return `
            <button class="quick-add" type="button" data-action="quick-add" data-product-id="${id}" aria-label="${escapeHtml(t("add_to_cart"))}: ${name}">
                ${icon("bag-plus")}
                <span class="quick-add-label">${escapeHtml(t("quick_add"))}</span>
            </button>
        `;
    }

    const isLast = item.qty <= 1;
    const stepper = `
        <div class="stepper card-stepper" role="group" aria-label="${escapeHtml(t("whatsapp_quantity"))}: ${name}">
            <button type="button" data-action="${isLast ? "card-remove" : "card-decrease"}" data-product-id="${id}" aria-label="${escapeHtml(isLast ? t("delete_item") : t("decrease_qty"))}">
                ${icon(isLast ? "trash" : "minus")}
            </button>
            <span class="stepper-value" aria-live="polite">${item.qty}</span>
            <button type="button" data-action="card-increase" data-product-id="${id}" aria-label="${escapeHtml(t("increase_qty"))}">
                ${icon("plus")}
            </button>
        </div>
    `;
    if (variant === "bar") {
        return `
            ${stepper}
            <button class="btn btn-primary btn-lg" type="button" data-action="go-cart">
                <span>${escapeHtml(t("checkout_now"))}</span>
                ${icon("arrow", "icon-dir")}
            </button>
        `;
    }
    return stepper;
}

function productCardHtml(product, index) {
    const id = getProductId(product);
    const name = getProductName(product);
    const description = getLocalizedProductText(product, "description");
    const imageUrl = product.imageUrl || "";
    const category = getProductCategory(product);
    const inCart = Boolean(getCartItem(id));

    return `
        <article class="product-card" data-product-id="${escapeHtml(id)}" style="animation-delay:${Math.min(index % 8, 7) * 35}ms">
            <button class="product-media" type="button" data-action="open" aria-label="${escapeHtml(t("view_details"))}: ${escapeHtml(name)}">
                ${imageUrl
                    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" class="product-image" loading="lazy" decoding="async">`
                    : `<span class="product-media-fallback">MB</span>`}
                ${offerBadgeHtml(product)}
                <span class="badge badge-in-cart" data-in-cart-badge ${inCart ? "" : "hidden"}>${icon("check")}<span>${escapeHtml(t("in_cart_badge"))}</span></span>
            </button>
            <div class="product-info">
                <h3 class="product-title"><button type="button" data-action="open">${escapeHtml(name)}</button></h3>
                ${description ? `<p class="product-desc">${escapeHtml(description)}</p>` : ""}
                <div class="product-bottom">
                    <p class="product-price">${priceHtml(product)}</p>
                    <div class="card-action" data-card-action="${escapeHtml(id)}" data-variant="card">${renderCardAction(product, "card")}</div>
                </div>
            </div>
        </article>
    `;
}

function miniCardHtml(product) {
    const id = getProductId(product);
    const name = getProductName(product);
    const imageUrl = product.imageUrl || "";
    return `
        <article class="mini-card" data-product-id="${escapeHtml(id)}">
            <button class="mini-media" type="button" data-action="open" aria-label="${escapeHtml(t("view_details"))}: ${escapeHtml(name)}">
                ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" loading="lazy" decoding="async">` : `<span class="product-media-fallback">MB</span>`}
            </button>
            <button class="mini-name" type="button" data-action="open">${escapeHtml(name)}</button>
            <div class="mini-bottom">
                <span class="mini-price">${priceHtml(product)}</span>
                <div class="card-action" data-card-action="${escapeHtml(id)}" data-variant="mini">${renderCardAction(product, "mini")}</div>
            </div>
        </article>
    `;
}

function sectionLimit(category) {
    if (expandedSections.has(category)) return Infinity;
    if (category === "offers" && isMobile()) return Infinity; /* horizontal rail on phones */
    return isMobile() ? 6 : 8;
}

function renderProducts() {
    const counts = {};
    const groups = {};
    productGridIds.forEach((category) => {
        counts[category] = 0;
        groups[category] = [];
    });

    const visibleProducts = getVisibleProducts();
    visibleProducts.forEach((product) => {
        const category = getProductCategory(product);
        groups[category].push(product);
        counts[category] += 1;
        /* discounted products also show under offers, in addition to their own category */
        if (category !== "offers" && getDiscountPercent(product) > 0) {
            groups.offers.push(product);
            counts.offers += 1;
        }
    });
    /* biggest discount first in offers when sorted by recommendation */
    if (sortMode === "recommended") {
        groups.offers.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    }

    const shopTotal = document.getElementById("shop-total");
    if (shopTotal) shopTotal.textContent = visibleProducts.length ? tn("all_products", visibleProducts.length) : "";
    const toolbar = document.getElementById("shop-toolbar");
    if (toolbar) toolbar.hidden = visibleProducts.length < 2;

    productGridIds.forEach((category, index) => {
        const grid = document.getElementById(`${category}-grid`);
        const section = grid?.closest(".products-section");
        const more = document.querySelector(`[data-show-more="${category}"]`);
        if (!grid || !section) return;

        if (visibleProducts.length === 0) {
            section.hidden = index !== 0;
            grid.innerHTML = index === 0 ? `<p class="empty-msg">${escapeHtml(t("empty_category"))}</p>` : "";
            if (more) more.hidden = true;
            return;
        }

        const items = groups[category];
        const limit = sectionLimit(category);
        section.hidden = items.length === 0;
        grid.innerHTML = items.slice(0, limit).map(productCardHtml).join("");
        grid.querySelectorAll(".product-image").forEach(imageFallback);

        if (more) {
            const canCollapse = expandedSections.has(category) && items.length > (isMobile() ? 6 : 8);
            more.hidden = !(items.length > limit || canCollapse);
            more.textContent = canCollapse ? t("show_less") : tn("show_more", items.length);
        }
    });

    updateCategoryVisibility(counts);
    renderCategoryTiles(groups);
    renderMenuLinks(counts);
    renderSearchChips(counts);
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

function renderCategoryTiles(groups) {
    const list = document.getElementById("cat-tiles");
    const section = document.getElementById("cat-tiles-section");
    if (!list || !section) return;
    const filled = productGridIds.filter((category) => groups[category].length);
    section.hidden = filled.length < 2;
    list.innerHTML = filled.map((category) => {
        const cover = [...groups[category]].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
            .find((product) => product.imageUrl);
        return `
            <li>
                <a class="cat-tile" href="#${category}-section">
                    <span class="cat-tile-img">${cover ? `<img src="${escapeHtml(cover.imageUrl)}" alt="" loading="lazy" decoding="async">` : ""}</span>
                    <span class="cat-tile-name">${escapeHtml(t(`${category}_title`))}</span>
                    <span class="cat-tile-count">${escapeHtml(countLabel(groups[category].length))}</span>
                </a>
            </li>
        `;
    }).join("");
}

function renderMenuLinks(counts) {
    const list = document.getElementById("menu-category-links");
    if (!list) return;
    list.innerHTML = productGridIds.filter((category) => counts[category]).map((category) => `
        <li>
            <a href="#${category}-section" data-close-menu>
                <span>${escapeHtml(t(`${category}_title`))}</span>
                <span class="menu-count">${counts[category]}</span>
                ${icon("chevron", "icon-dir")}
            </a>
        </li>
    `).join("");
}

function renderSearchChips(counts) {
    const chips = document.getElementById("search-chips");
    if (!chips) return;
    chips.innerHTML = productGridIds.filter((category) => counts[category]).map((category) => `
        <button type="button" class="chip" data-goto="${category}-section">${escapeHtml(t(`${category}_title`))}</button>
    `).join("");
}

/* Refresh only the add/stepper areas (keeps scroll + images untouched). */
function updateCardActions() {
    document.querySelectorAll("[data-card-action]").forEach((area) => {
        const id = area.dataset.cardAction;
        const product = findProduct(id);
        if (!product) return;
        const hadFocus = area.contains(document.activeElement);
        area.innerHTML = renderCardAction(product, area.dataset.variant || "card");
        if (hadFocus) {
            (area.querySelector("[data-action='card-increase']") || area.querySelector("button"))?.focus({ preventScroll: true });
        }
    });
    document.querySelectorAll(".product-card[data-product-id]").forEach((card) => {
        const badge = card.querySelector("[data-in-cart-badge]");
        if (badge) badge.hidden = !getCartItem(card.dataset.productId);
    });
}

function handleProductClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === "go-cart") {
        openCart();
        return;
    }

    const holder = actionEl.closest("[data-product-id]");
    const id = actionEl.dataset.productId || holder?.dataset.productId;
    const product = id ? findProduct(id) : null;
    if (!product) return;

    if (action === "quick-add") {
        /* check before addToCart: it re-renders (detaches) the clicked button */
        const inSheet = Boolean(actionEl.closest(".modal, .cart-sidebar"));
        addToCart(product, 1);
        if (!inSheet) showAddedToast(product);
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
    if (action === "open") {
        if (searchPanel && !searchPanel.hidden) closeSearch({ restoreFocus: false });
        if (cartSidebar?.classList.contains("active")) closeCart({ keepHistory: true });
        openModal(product);
    }
}

/* ------------------------------------------------------------------ */
/* Search                                                             */
/* ------------------------------------------------------------------ */

function openSearch() {
    if (!searchPanel) return;
    closeMenu({ restoreFocus: false });
    lastFocusedElement = document.activeElement;
    searchPanel.hidden = false;
    overlayOpened();
    dismissAllToasts();
    renderSearch();
    /* focus synchronously inside the tap so phones open the keyboard */
    searchInput?.focus();
    searchInput?.select();
}

function closeSearch(options = {}) {
    if (!searchPanel || searchPanel.hidden) return;
    searchPanel.hidden = true;
    overlayClosed();
    if (options.restoreFocus !== false) restoreFocus();
}

function renderSearch() {
    const query = normalizeSearch(searchInput?.value);
    const results = document.getElementById("search-results");
    const suggest = document.getElementById("search-suggest");
    const empty = document.getElementById("search-empty");
    const label = document.getElementById("search-result-label");
    if (!results) return;

    if (!query) {
        results.innerHTML = "";
        if (suggest) suggest.hidden = false;
        if (empty) empty.hidden = true;
        if (label) label.hidden = true;
        return;
    }

    const terms = query.split(" ");
    const matches = getVisibleProducts().filter((product) => {
        const haystack = normalizeSearch([
            product.name, product.nameAr, product.nameEn, product.nameDe,
            getLocalizedProductText(product, "description"),
            t(`${getProductCategory(product)}_title`)
        ].join(" "));
        return terms.every((term) => haystack.includes(term));
    });

    if (suggest) suggest.hidden = true;
    if (empty) empty.hidden = matches.length > 0;
    if (label) {
        label.hidden = matches.length === 0;
        label.textContent = tn("search_results", matches.length);
    }
    results.innerHTML = matches.slice(0, 30).map((product) => {
        const id = getProductId(product);
        const name = getProductName(product);
        return `
            <li class="search-result" data-product-id="${escapeHtml(id)}">
                <button type="button" class="search-result-main" data-action="open">
                    <span class="search-thumb">${product.imageUrl ? `<img src="${escapeHtml(product.imageUrl)}" alt="" loading="lazy">` : ""}</span>
                    <span class="search-text">
                        <strong>${escapeHtml(name)}</strong>
                        <span>${escapeHtml(t(`${getProductCategory(product)}_title`))} · <bdi dir="ltr">${priceHtml(product)}</bdi></span>
                    </span>
                </button>
                <div class="card-action" data-card-action="${escapeHtml(id)}" data-variant="mini">${renderCardAction(product, "mini")}</div>
            </li>
        `;
    }).join("");
}

/* ------------------------------------------------------------------ */
/* Menu                                                               */
/* ------------------------------------------------------------------ */

function openMenu() {
    if (!menuSheet) return;
    lastFocusedElement = document.activeElement;
    menuSheet.hidden = false;
    document.getElementById("menu-btn")?.setAttribute("aria-expanded", "true");
    overlayOpened();
    requestAnimationFrame(() => menuSheet.querySelector(".menu-head .icon-btn")?.focus({ preventScroll: true }));
}

function closeMenu(options = {}) {
    if (!menuSheet || menuSheet.hidden) return;
    menuSheet.hidden = true;
    document.getElementById("menu-btn")?.setAttribute("aria-expanded", "false");
    overlayClosed();
    if (options.restoreFocus !== false) restoreFocus();
}

/* ------------------------------------------------------------------ */
/* Product modal / sheet                                              */
/* ------------------------------------------------------------------ */

function openModal(product, resetFeedback = true) {
    const wasOpen = modal && !modal.hidden;
    const switched = wasOpen && activeProduct && getProductId(activeProduct) !== getProductId(product);
    activeProduct = product;
    if (resetFeedback) hideModalCartFeedback();

    const image = document.getElementById("modal-img");
    const imageContainer = image?.closest(".modal-image-container");
    const imageUrl = product.imageUrl || "";
    const name = getProductName(product);
    const category = getProductCategory(product);

    if (image) {
        image.src = imageUrl;
        image.alt = name;
        image.style.display = imageUrl ? "block" : "none";
        image.onerror = () => {
            image.style.display = "none";
        };
    }
    if (imageContainer) imageContainer.querySelector(".zoom-hint").hidden = !imageUrl;
    const offerBadge = document.getElementById("modal-offer-badge");
    if (offerBadge) {
        const discount = getDiscountPercent(product);
        offerBadge.hidden = !isOnOffer(product);
        offerBadge.classList.toggle("badge-sale", discount > 0);
        offerBadge.innerHTML = discount
            ? `<bdi dir="ltr">-${discount}%</bdi>`
            : `${icon("sparkle")}<span>${escapeHtml(t("offer_badge"))}</span>`;
    }

    const categoryEl = document.getElementById("modal-category");
    const title = document.getElementById("modal-title");
    const price = document.getElementById("modal-price");
    const desc = document.getElementById("modal-desc");
    const qty = document.getElementById("modal-qty");

    if (categoryEl) categoryEl.textContent = t(`${category}_title`);
    if (title) title.textContent = name;
    if (price) price.innerHTML = priceHtml(product);
    if (desc) {
        const description = getLocalizedProductText(product, "description");
        desc.textContent = description;
        const wrap = document.getElementById("modal-desc-wrap");
        if (wrap) wrap.hidden = !description;
    }
    if (qty && resetFeedback) qty.value = 1;

    const barPrice = document.getElementById("pdp-bar-price");
    const barAction = document.getElementById("pdp-bar-action");
    if (barPrice) barPrice.innerHTML = priceHtml(product);
    if (barAction) {
        barAction.dataset.cardAction = getProductId(product);
        barAction.dataset.variant = "bar";
        barAction.innerHTML = renderCardAction(product, "bar");
    }

    renderModalRelated(product);
    updateModalPrice();
    updateModalInCart();

    if (switched) modal.querySelector(".modal-scroll")?.scrollTo({ top: 0, behavior: "smooth" });

    if (modal && !wasOpen) {
        dismissAllToasts();
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        modal.querySelector(".modal-scroll")?.scrollTo(0, 0);
        overlayOpened();
        requestAnimationFrame(() => modal.querySelector(".close-modal")?.focus({ preventScroll: true }));
    }
}

function closeModal(options = {}) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    closeImageLightbox();
    overlayClosed();
    if (options.restoreFocus !== false) restoreFocus();
}

function renderModalRelated(product) {
    const wrap = document.getElementById("modal-related-wrap");
    const rail = document.getElementById("modal-related");
    if (!wrap || !rail) return;
    const id = getProductId(product);
    const category = getProductCategory(product);
    const others = appData.products.filter((item) => item.active !== false && getProductId(item) !== id);
    const related = [
        ...others.filter((item) => getProductCategory(item) === category),
        ...others.filter((item) => getProductCategory(item) !== category)
    ].slice(0, 10);
    wrap.hidden = related.length === 0;
    rail.innerHTML = related.map(miniCardHtml).join("");
    rail.scrollLeft = 0;
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
    const focusBefore = document.activeElement;
    closeModal({ restoreFocus: false });
    closeSearch({ restoreFocus: false });
    closeMenu({ restoreFocus: false });
    if (cartSidebar.classList.contains("active")) return;
    lastFocusedElement = focusBefore;
    if (checkoutStep === "done" && !lastOrder) checkoutStep = "cart";
    setCheckoutStep(cart.length ? (checkoutStep === "done" ? "done" : "cart") : "cart", { focus: false });
    cartSidebar.classList.add("active");
    cartSidebar.setAttribute("aria-hidden", "false");
    if (cartOverlay) cartOverlay.hidden = false;
    floatingCartBtn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("cart-open");
    dismissAllToasts();
    overlayOpened();
    cartSidebar.querySelector(".cart-body")?.scrollTo(0, 0);
    requestAnimationFrame(() => cartSidebar.querySelector(".close-cart")?.focus({ preventScroll: true }));
}

function closeCart(options = {}) {
    if (!cartSidebar?.classList.contains("active")) return;
    cartSidebar.classList.remove("active");
    cartSidebar.setAttribute("aria-hidden", "true");
    if (cartOverlay) cartOverlay.hidden = true;
    floatingCartBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cart-open");
    overlayClosed();
    if (!options.keepHistory) restoreFocus();
}

function setCheckoutStep(step, options = {}) {
    if (!cartSidebar) return;
    if (!cart.length && step !== "done") step = "cart";
    checkoutStep = step;
    cartSidebar.dataset.step = step;

    cartSidebar.querySelectorAll("[data-step-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.stepPanel !== step;
    });
    cartSidebar.querySelectorAll("[data-footer-for]").forEach((group) => {
        group.hidden = group.dataset.footerFor !== step;
    });

    const order = ["cart", "details", "done"];
    document.querySelectorAll("#checkout-progress [data-progress]").forEach((item) => {
        const position = order.indexOf(item.dataset.progress);
        const current = order.indexOf(step);
        item.classList.toggle("is-done", position < current);
        item.classList.toggle("is-current", position === current);
    });
    const progress = document.getElementById("checkout-progress");
    if (progress) progress.hidden = cart.length === 0 && step !== "done";

    const titleText = document.getElementById("cart-title-text");
    if (titleText) titleText.textContent = t(step === "details" ? "details_title" : step === "done" ? "done_heading" : "your_cart");
    const titleCount = document.getElementById("cart-title-count");
    if (titleCount) titleCount.hidden = step !== "cart";
    const back = document.getElementById("cart-back");
    if (back) back.hidden = step === "cart";

    const footer = document.getElementById("cart-footer");
    if (footer) footer.hidden = cart.length === 0 || step === "done";
    hideInlineError("checkout-error");

    if (step === "done") {
        const text = document.getElementById("done-text");
        if (text) text.textContent = t(lastOrder?.channel === "email" ? "done_text_email" : "done_text_whatsapp");
        const resend = document.getElementById("done-resend");
        if (resend) resend.classList.toggle("btn-whatsapp", lastOrder?.channel !== "email");
        resend?.classList.toggle("btn-primary", lastOrder?.channel === "email");
    }

    if (options.focus !== false && cartSidebar.classList.contains("active")) {
        cartSidebar.querySelector(".cart-body")?.scrollTo(0, 0);
        if (step === "details" && usingKeyboard) {
            const name = document.getElementById("customer-name");
            const phone = document.getElementById("customer-phone");
            (name?.value ? phone : name)?.focus({ preventScroll: true });
        } else if (usingKeyboard) {
            cartSidebar.querySelector(".close-cart")?.focus({ preventScroll: true });
        }
    }
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
        discountPercent: getDiscountPercent(product),
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

/* A saved cart holds a snapshot; refresh price, discount, names and image from the live catalogue. */
function syncCartWithProducts() {
    if (!cart.length || !appData.products.length) return;
    let changed = false;
    cart = cart.map((item) => {
        const fresh = appData.products.find((product) => getProductId(product) === item.$id);
        if (!fresh) return item;
        const next = { ...getCartStorageItem(fresh), qty: item.qty };
        if (JSON.stringify(next) !== JSON.stringify(item)) changed = true;
        return next;
    });
    if (changed) saveCartToStorage();
    updateCartUI();
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
    if (checkoutStep === "done") {
        lastOrder = null;
        checkoutStep = "cart";
    }
    saveCartToStorage();
    updateCartUI();
    bumpCartButton();
}

function bumpCartButton() {
    [floatingCartBtn, mobileCartBar].forEach((element) => {
        if (!element) return;
        element.classList.remove("bump");
        void element.offsetWidth;
        element.classList.add("bump");
    });
}

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    cartItems.innerHTML = cart.map((item) => {
        const itemPrice = getProductPriceUsd(item);
        const productName = escapeHtml(getProductName(item));
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
                        <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${id}" aria-label="${escapeHtml(t("delete_item"))}: ${productName}">${icon("trash")}</button>
                    </div>
                    <p class="cart-unit-price">${item.qty > 1 ? `<bdi dir="ltr">${item.qty} × ${formatPrice(itemPrice)}</bdi>` : ""}${getDiscountPercent(item) ? ` <span class="badge-inline"><bdi dir="ltr">-${getDiscountPercent(item)}%</bdi></span>` : ""}${item.qty <= 1 && !getDiscountPercent(item) ? "&nbsp;" : ""}</p>
                    <div class="cart-item-actions">
                        <div class="stepper cart-qty-controls" role="group" aria-label="${escapeHtml(t("whatsapp_quantity"))}">
                            <button class="cart-qty-btn" type="button" data-cart-action="decrease" data-product-id="${id}" aria-label="${escapeHtml(t("decrease_qty"))}" ${isLast ? "disabled" : ""}>${icon("minus")}</button>
                            <input class="cart-qty-input" type="number" min="1" value="${item.qty}" inputmode="numeric" data-product-id="${id}" aria-label="${escapeHtml(t("whatsapp_quantity"))}">
                            <button class="cart-qty-btn" type="button" data-cart-action="increase" data-product-id="${id}" aria-label="${escapeHtml(t("increase_qty"))}">${icon("plus")}</button>
                        </div>
                        <span class="cart-line-total" data-line-total>${priceHtml(item, item.qty)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
    cartItems.querySelectorAll(".cart-item-image img").forEach((image) => {
        image.addEventListener("error", () => image.remove(), { once: true });
    });

    const isEmpty = cart.length === 0;
    document.getElementById("cart-empty").hidden = !isEmpty;
    if (isEmpty && checkoutStep !== "done") checkoutStep = "cart";

    updateCartSummary();
    updateCardActions();
    updateModalInCart();
    renderCartRelated();
    renderOrderReview();
    setCheckoutStep(checkoutStep, { focus: false });
}

function renderCartRelated() {
    const wrap = document.getElementById("cart-related-wrap");
    const rail = document.getElementById("cart-related");
    if (!wrap || !rail) return;
    if (!cart.length || !productsLoaded) {
        wrap.hidden = true;
        return;
    }
    const inCartIds = new Set(cart.map((item) => item.$id));
    const inCartCategories = new Set(cart.map((item) => getProductCategory(item)));
    const candidates = getVisibleProducts().filter((product) => !inCartIds.has(getProductId(product)));
    const ordered = [
        ...candidates.filter((product) => getProductCategory(product) === "offers"),
        ...candidates.filter((product) => getProductCategory(product) !== "offers" && !inCartCategories.has(getProductCategory(product))),
        ...candidates.filter((product) => getProductCategory(product) !== "offers" && inCartCategories.has(getProductCategory(product)))
    ];
    const seen = new Set();
    const picks = ordered.filter((product) => {
        const id = getProductId(product);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    }).slice(0, 8);
    wrap.hidden = picks.length === 0;
    const previousScroll = rail.scrollLeft;
    rail.innerHTML = picks.map(miniCardHtml).join("");
    rail.scrollLeft = previousScroll;
}

function renderOrderReview() {
    const thumbs = document.getElementById("order-review-thumbs");
    const count = document.getElementById("order-review-count");
    if (thumbs) {
        thumbs.innerHTML = cart.slice(0, 4).map((item) => item.imageUrl
            ? `<img src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy">`
            : `<span class="thumb-fallback">MB</span>`).join("")
            + (cart.length > 4 ? `<span class="thumb-more">+${cart.length - 4}</span>` : "");
    }
    if (count) count.textContent = `${countLabel(getCartCount())} · ${formatPrice(getCartTotal())}`;
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
    const savings = getCartSavings();
    const savingsEl = document.getElementById("cart-savings");
    if (savingsEl) {
        savingsEl.hidden = savings < 0.005;
        savingsEl.textContent = t("you_save").replace("{x}", formatPrice(savings));
    }
    const titleCount = document.getElementById("cart-title-count");
    if (titleCount) titleCount.textContent = count ? `(${countLabel(count)})` : "";
    const mcbCount = document.getElementById("mcb-count");
    if (mcbCount) mcbCount.textContent = String(count);
    const mcbTotal = document.getElementById("mcb-total");
    if (mcbTotal) mcbTotal.textContent = total;
    renderOrderReview();
    updateMobileCartBar();
}

function updateMobileCartBar() {
    if (!mobileCartBar) return;
    const show = cart.length > 0 && !anyOverlayOpen();
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
    const row = `.cart-item[data-product-id="${CSS.escape(id)}"]`;
    const target = document.querySelector(`${row} [data-cart-action="${action}"]:not(:disabled)`)
        || document.querySelector(`${row} .cart-qty-input`);
    target?.focus({ preventScroll: true });
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
            if (lineTotal) lineTotal.innerHTML = priceHtml(item, item.qty);
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
        text: getProductName(removed),
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
        ${image ? `<img class="toast-thumb" src="${escapeHtml(image)}" alt="">` : `<span class="toast-check">${icon("check")}</span>`}
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
        text: getProductName(product),
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
    let phone = phoneValue.replace(/[\s\-()./]+/g, "");

    if (selectedCountry) {
        const countryDigits = selectedCountry.slice(1);
        phone = phone.replace(/^\+/, "").replace(/^00/, "");

        if (phone.startsWith(countryDigits)) {
            phone = phone.slice(countryDigits.length);
        }

        phone = phone.replace(/^0+/, "");
        if (!/^\d{6,14}$/.test(phone)) return "";
        return `${selectedCountry}${phone}`;
    }

    if (phone.startsWith("00")) {
        phone = `+${phone.slice(2)}`;
    }

    return /^\+\d{7,15}$/.test(phone) ? phone : "";
}

function createOrderMessage(customerName, customerPhone, note) {
    const texts = appData.translations[currentLang];
    const orderLines = cart.map((item, index) => {
        const unitPrice = getProductPriceUsd(item);
        const lineTotal = unitPrice * item.qty;
        const productName = getProductName(item);
        return [
            `${index + 1}. ${productName}`,
            `   ${texts.whatsapp_quantity}: ${item.qty}`,
            `   ${texts.whatsapp_unit_price}: ${formatPrice(unitPrice)}${getDiscountPercent(item)
                ? ` (${texts.discount_note.replace("{n}", getDiscountPercent(item)).replace("{x}", formatPrice(getOriginalPriceUsd(item)))})`
                : ""}`,
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

function openOrderChannel(order) {
    if (order.channel === "whatsapp") {
        /* "noopener" in the feature string makes window.open return null even on
           success, which used to also navigate the shop tab away. */
        const opened = window.open(order.url, "_blank");
        if (opened) opened.opener = null;
        else window.location.href = order.url;
    } else {
        window.location.href = order.url;
    }
}

function submitOrder() {
    const data = collectCheckoutData(Boolean(shopWhatsAppNumber), "missing_whatsapp_alert");
    if (!data) return;

    const message = createOrderMessage(data.customerName, data.customerPhone, data.note);
    lastOrder = {
        channel: "whatsapp",
        url: `https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent(message)}`
    };
    openOrderChannel(lastOrder);
    setCheckoutStep("done");
}

function submitEmailOrder() {
    const data = collectCheckoutData(Boolean(shopOrderEmail), "missing_email_alert");
    if (!data) return;

    const subject = "Neue Bestellung - Mais Beauty";
    const message = createOrderMessage(data.customerName, data.customerPhone, data.note);
    lastOrder = {
        channel: "email",
        url: `mailto:${shopOrderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    };
    openOrderChannel(lastOrder);
    setCheckoutStep("done");
}

function finishOrder() {
    cart = [];
    lastOrder = null;
    checkoutStep = "cart";
    const note = document.getElementById("customer-note");
    if (note) note.value = "";
    saveCartToStorage();
    updateCartUI();
    closeCart();
    showToast({ title: t("order_thanks") });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
