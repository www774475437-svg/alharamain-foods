// ═══════════════════════════════════════════════════════════════
//  السيلات — عدّل هنا فقط / Sales — edit here only
//  start/end: تاريخ البداية والنهاية (YYYY-MM-DD). السيل يظهر للزبائن
//  فقط بين هذين التاريخين، وبعد انتهائه ينتقل إلى السجل (للمدير والمشرفين).
//  branches: الفروع التي يشملها السيل (campau, caniff, farmington, 12mile)
//  items: [اسم، سعر، الوحدة]. السعر هو سعر الوحدة كما في الإعلان:
//         "pack of 3" تعني أن الوحدة = 3 قطع بسعر الإعلان.
// ═══════════════════════════════════════════════════════════════
window.SALES = [
  {
    id: "2026-11-13",
    title: { ar: "سيل الحرمين", en: "Al-Haramain Sale" },
    dates: { ar: "١٣ – ١٥ نوفمبر", en: "Nov 13 – 15" },
    start: "2026-11-13", end: "2026-11-15",
    branches: ["farmington", "12mile"],
    groups: [
      { id: "meat", ar: "🥩 اللحوم والدواجن (حلال)", en: "🥩 Halal meat & poultry", items: [
        ["Ground Beef", 4.99, "per lb"], ["T-Bone / Porterhouse", 5.49, "per lb"], ["Chuck Roast", 5.49, "per lb"],
        ["Frozen Lamb Tongue", 5.99, "per lb"], ["Frozen Beef Feet", 3.99, "per lb"], ["Catfish", 3.99, "per lb"],
        ["Chicken Drumsticks", 0.69, "per lb"], ["Chicken Wings", 0.99, "per lb"], ["Ground Chicken", 1.99, "per lb"]
      ]},
      { id: "eggs", ar: "🥚 البيض", en: "🥚 Eggs", items: [
        ["White Amish Eggs (30 count)", 4.99, "pack of 2"], ["White Amish Jumbo Eggs (20 count)", 5.99, "pack of 3"]
      ]},
      { id: "produce", ar: "🍎 الخضار والفواكه", en: "🍎 Produce", items: [
        ["Blackberries 6 oz", 5.00, "pack of 5"], ["Small Oranges", 2.00, "pack of 15"], ["Persimmons", 0.79, "per lb"],
        ["Cactus Pears", 0.49, "per lb"], ["Yellow Mango", 5.00, "pack of 4"], ["MI Fuji Apples", 0.88, "per lb"],
        ["Gala Apples", 0.88, "per lb"], ["Green Cabbage", 0.49, "per lb"], ["Turnips", 0.49, "per lb"],
        ["Beets", 0.49, "per lb"], ["Hunky Hot Peppers", 0.79, "per lb"], ["Cubanelle Peppers", 0.79, "per lb"],
        ["Anaheim Peppers", 0.79, "per lb"], ["Beefsteak Tomatoes", 0.99, "per lb"]
      ]},
      { id: "dairy", ar: "🧀 الألبان", en: "🧀 Dairy", items: [
        ["Tut's Spanish Cheese", 3.99, "per lb"], ["Karoun Whole Milk Yogurt 32 oz", 7.00, "pack of 2"],
        ["Icim Turkish Labneh 550 g", 3.99, "each"]
      ]},
      { id: "bakery", ar: "🍕 المخبوزات", en: "🍕 Bakery", items: [
        ["Large Pizza", 9.99, "each"], ["Large Zaatar Pie", 2.99, "each"], ["Samoon Bread", 2.00, "pack of 6"]
      ]},
      { id: "pantry", ar: "🥫 المواد الغذائية", en: "🥫 Pantry", items: [
        ["Shahia Extra Virgin Olive Oil 2.8 L", 21.99, "each"], ["Ferrero Rocher 600 g", 12.99, "each"],
        ["Kinza Cola / Lemon", 5.99, "each"], ["Five Roses All Purpose Flour 5.5 lb", 3.99, "each"],
        ["Delallo Extra Virgin Olive Oil 33.8 oz", 11.99, "each"], ["Sultan 100% Extra Virgin Olive Oil 1 L", 12.99, "each"],
        ["Nescafe 3 in 1 (80 g)", 5.00, "pack of 3"], ["Laxmi Ginger Garlic Paste 24 oz", 7.00, "pack of 2"],
        ["Alafia Grape Leaves 908 g", 5.49, "each"], ["Burcu Tomato Paste 830 g", 6.00, "pack of 3"],
        ["Bifa Tea Biscuit", 6.00, "pack of 3"], ["Crodo Limonata 4 x 330 mL", 7.00, "pack of 2"],
        ["Laxmi Jumbo Peanuts 4 lb", 4.99, "each"], ["Ziyad Semolina Coarse 35 oz", 5.00, "pack of 2"],
        ["Red Sea Chunk Light Tuna (mix & match)", 6.00, "pack of 3"]
      ]}
    ]
  }
];

/* ── أدوات التاريخ (توقيت ديترويت) ── */
window.HR_TODAY = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Detroit" });

/* السيلات النشطة الآن لفرع معيّن */
window.HR_SALE_ACTIVE = bid => {
  const today = window.HR_TODAY();
  return (window.SALES || []).filter(s => s.start <= today && today <= s.end && (!bid || s.branches.includes(bid)));
};

/* السيلات المنتهية (السجل) للفرع، أو كل الفروع للمالك */
window.HR_SALE_ARCHIVE = bid => {
  const today = window.HR_TODAY();
  return (window.SALES || []).filter(s => s.end < today && (!bid || s.branches.includes(bid)));
};

/* منتجات السيل النشط كمنتجات عادية (تدخل السلة والبحث والعروض) */
window.HR_SALE_ITEMS = bid => {
  const out = [];
  const today = window.HR_TODAY();
  window.HR_SALE_ACTIVE(bid).forEach(s => {
    const isNew = s.start === today;
    s.groups.forEach(g => g.items.forEach(([name, price, unit], i) => {
      const k = `sale-${s.id}-${g.id}-${i}`;
      out.push({
        k, name: `${name} · ${unit}`, s: name.toLowerCase(), price, old: 0, stock: 1, img: "",
        cat: "sale", deal: true, pop: false, isNew,
        sale: { sid: s.id, gid: g.id }
      });
    }));
  });
  return out;
};
