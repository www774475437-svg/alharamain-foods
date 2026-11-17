// ═══════════════════════════════════════════════════════════════
//  إعدادات الفروع — عدّل من هنا / Branch settings — edit here
//  لكل فرع: عروضه الخاصة (deals) ومنتجات مخفية (hide) ومنتجات إضافية (extra)
// ═══════════════════════════════════════════════════════════════
window.BRAND = {
  ar: "الحرمين", en: "Al-Haramain",
  subAr: "للأغذية العالمية", subEn: "International Foods",
  logo: "https://static.wixstatic.com/media/4435d4_6f9fa8d03ed046b9ad56bd215b2c9239~mv2.jpeg/v1/fit/w_240,h_240,q_90/logo.jpeg"
};

window.BRANCHES = [
  {
    id: "campau", n: 1,
    ar: "هامترامك – جوزيف كامبو", en: "Hamtramck – Joseph Campau",
    addr: "9027 Joseph Campau Ave, Hamtramck, MI 48212",
    phone: "(313) 875-8920", lat: 42.3929, lng: -83.0583,
    color: "#b3121a",
    banner: { ar: "أهلًا بكم في فرع جوزيف كامبو", en: "Welcome to our Joseph Campau store" },
    // عروض هذا الفرع: اكتب جزءًا من اسم المنتج والسعر الجديد
    deals: [ /* { match: "Medjool", price: 19.99 } */ ],
    hide: [],   // أجزاء من أسماء منتجات لا تتوفر في هذا الفرع
    extra: []   // منتجات خاصة بالفرع: { name, price, img, cat }
  },
  {
    id: "caniff", n: 2,
    ar: "هامترامك – كانيف", en: "Hamtramck – Caniff",
    addr: "3306 Caniff Ave, Hamtramck, MI 48212",
    phone: "(313) 870-9748", lat: 42.4001, lng: -83.0571,
    color: "#0c5a36",
    banner: { ar: "أهلًا بكم في فرع كانيف — الفرع الأول", en: "Welcome to Caniff — our original store" },
    deals: [], hide: [], extra: []
  },
  {
    id: "farmington", n: 3,
    ar: "فارمنجتون – أورتشارد ليك", en: "Farmington – Orchard Lake",
    addr: "24065 Orchard Lake Rd, Farmington, MI 48336",
    phone: "(248) 476-0300", lat: 42.4647, lng: -83.3598,
    color: "#0c3b26",
    banner: { ar: "أهلًا بكم في فرع فارمنجتون", en: "Welcome to our Farmington store" },
    deals: [], hide: [], extra: []
  },
  {
    id: "12mile", n: 4,
    ar: "فارمنجتون هيلز – 12 مايل", en: "Farmington Hills – 12 Mile",
    addr: "33250 W 12 Mile Rd, Farmington Hills, MI 48334",
    phone: "(248) 994-0700", lat: 42.4989, lng: -83.3742,
    color: "#8a5a00",
    banner: { ar: "أهلًا بكم في فرع 12 مايل", en: "Welcome to our 12 Mile store" },
    deals: [], hide: [], extra: []
  }
];

// الأقسام بالترتيب الذي تظهر به
window.CATS = [
  ["dates","🌴","تمور","Dates"],["honey","🍯","عسل","Honey"],["rice","🍚","أرز","Rice"],
  ["spices","🌶️","بهارات وتوابل","Spices"],["tea","🍵","شاي","Tea"],["coffee","☕","قهوة","Coffee"],
  ["nuts","🥜","مكسرات","Nuts"],["oils","🫒","زيوت وسمن","Oils & Ghee"],["canned","🥫","معلبات","Canned"],
  ["sauces","🍅","صلصات ومعاجين","Pastes & Sauces"],["pickles","🥒","مخللات وزيتون","Pickles & Olives"],
  ["pasta","🍝","معكرونة","Pasta"],["snacks","🥣","حبوب وسناكات","Cereals & Snacks"],
  ["cookies","🍪","بسكويت وكوكيز","Cookies"],["sweets","🍫","حلويات","Sweets"],["bakery","🥙","مخبوزات","Bakery"],
  ["baking","🌾","طحين ومواد الخَبز","Baking & Flours"],["grains","🫘","بقوليات","Beans & Lentils"],
  ["dairy","🧀","ألبان","Dairy"],["drinks","🥤","مشروبات","Drinks"],["vinegar","🧴","خل","Vinegar"],
  ["produce","🥬","خضار","Vegetables"],["perfume","🪔","عطور وبخور","Perfumes & Bakhoor"],
  ["care","🧼","عناية شخصية","Personal Care"],["home","🏠","منزل ومطبخ","Home & Kitchen"],["other","🛒","متنوع","More"]
];
