(() => {
"use strict";
const $ = s => document.querySelector(s);
const BR = window.BRANCHES, CATS = window.CATS, BRAND = window.BRAND;
const PAGE = 40;

/* ── نصوص الواجهة ── */
const TX = {
  ar: { home:"الرئيسية", cats:"الأقسام", fav:"المفضلة", stores:"الفروع", search:"ابحث عن أرز، شاي، تمر، بهارات…",
    shopFrom:"تتسوّق من فرع", change:"تغيير", deals:"عروض الفرع", popular:"الأكثر طلبًا", all:"عرض الكل", allCats:"كل الأقسام",
    add:"أضف للسلة", oos:"غير متوفر", inStock:"متوفر", cart:"السلة", emptyCart:"سلتك فارغة", emptyFav:"لا توجد منتجات في المفضلة بعد",
    start:"ابدأ التسوق", bill:"الفاتورة", items:"عدد القطع", subtotal:"المجموع", taxNote:"الضريبة والمجموع النهائي يؤكدهما الفرع عند تجهيز الطلب.",
    sendWa:"إرسال الطلب عبر واتساب", call:"اتصال", callStore:"اتصل بالفرع لتأكيد الطلب", dir:"الاتجاهات", pick:"اختيار", picked:"الفرع الحالي ✓",
    nearest:"الأقرب إليك", locate:"📍 حدّد أقرب فرع إليّ", locating:"جارٍ تحديد موقعك…", locFail:"تعذّر تحديد الموقع — اختر الفرع يدويًا",
    chooseStore:"اختر الفرع", mi:"ميل", results:"نتيجة", noRes:"لا توجد نتائج", products:"منتج", more:"عرض المزيد", sale:"عرض", hot:"رائج",
    added:"أضيف إلى السلة ✓", switched:"تم التحويل إلى", clear:"إفراغ السلة", cleared:"تم إفراغ السلة", pickup:"الاستلام من",
    sortDef:"المقترح", sortLow:"الأقل سعرًا", sortHigh:"الأعلى سعرًا", onlyStock:"المتوفر فقط",
    heroTag:"+2500 منتج", heroP:"منتجات عالمية من أكثر من 30 دولة", order:"طلب جديد من تطبيق الحرمين", branch:"الفرع", total:"المجموع",
    priceNote:"الأسعار من متجر الحرمين الإلكتروني وقد تختلف قليلًا بين الفروع." },
  en: { home:"Home", cats:"Categories", fav:"Favorites", stores:"Stores", search:"Search rice, tea, dates, spices…",
    shopFrom:"Shopping from", change:"Change", deals:"Store deals", popular:"Most popular", all:"See all", allCats:"All categories",
    add:"Add to cart", oos:"Out of stock", inStock:"In stock", cart:"Cart", emptyCart:"Your cart is empty", emptyFav:"No favorites yet",
    start:"Start shopping", bill:"Summary", items:"Items", subtotal:"Subtotal", taxNote:"Tax and final total are confirmed by the store when your order is prepared.",
    sendWa:"Send order via WhatsApp", call:"Call", callStore:"Call the store to confirm", dir:"Directions", pick:"Select", picked:"Current store ✓",
    nearest:"Nearest to you", locate:"📍 Find my nearest store", locating:"Finding your location…", locFail:"Couldn't get location — pick a store manually",
    chooseStore:"Choose your store", mi:"mi", results:"results", noRes:"No results", products:"products", more:"Show more", sale:"Deal", hot:"Popular",
    added:"Added to cart ✓", switched:"Switched to", clear:"Clear cart", cleared:"Cart cleared", pickup:"Pickup from",
    sortDef:"Recommended", sortLow:"Price: low", sortHigh:"Price: high", onlyStock:"In stock only",
    heroTag:"2,500+ products", heroP:"International products from 30+ countries", order:"New order from the Al-Haramain app", branch:"Store", total:"Total",
    priceNote:"Prices come from Al-Haramain's online store and may vary slightly between stores." },
  hi: { home:"होम", cats:"श्रेणियाँ", fav:"पसंदीदा", stores:"स्टोर", search:"चावल, चाय, खजूर, मसाले खोजें…", shopFrom:"इस स्टोर से खरीदारी", change:"बदलें", deals:"स्टोर के ऑफ़र", popular:"सबसे लोकप्रिय", all:"सभी देखें", allCats:"सभी श्रेणियाँ", add:"कार्ट में जोड़ें", oos:"स्टॉक में नहीं", inStock:"स्टॉक में", cart:"कार्ट", emptyCart:"आपका कार्ट खाली है", emptyFav:"अभी कोई पसंदीदा नहीं", start:"खरीदारी शुरू करें", bill:"सारांश", items:"आइटम", subtotal:"उप-योग", taxNote:"कर और अंतिम कुल राशि ऑर्डर तैयार होने पर स्टोर पुष्टि करेगा।", sendWa:"व्हाट्सऐप से ऑर्डर भेजें", call:"कॉल करें", callStore:"पुष्टि के लिए स्टोर को कॉल करें", dir:"दिशा-निर्देश", pick:"चुनें", picked:"वर्तमान स्टोर ✓", nearest:"आपके सबसे नज़दीक", locate:"📍 मेरा निकटतम स्टोर खोजें", locating:"आपका स्थान खोजा जा रहा है…", locFail:"स्थान नहीं मिला — स्टोर खुद चुनें", chooseStore:"अपना स्टोर चुनें", mi:"मील", results:"परिणाम", noRes:"कोई परिणाम नहीं", products:"उत्पाद", more:"और दिखाएँ", sale:"ऑफ़र", hot:"लोकप्रिय", added:"कार्ट में जोड़ा गया ✓", switched:"बदला गया", clear:"कार्ट खाली करें", cleared:"कार्ट खाली हो गया", pickup:"यहाँ से लें", sortDef:"सुझाया गया", sortLow:"कम कीमत", sortHigh:"ज़्यादा कीमत", onlyStock:"केवल स्टॉक में", heroTag:"2,500+ उत्पाद", heroP:"30+ देशों के अंतरराष्ट्रीय उत्पाद", order:"अल-हरमैन ऐप से नया ऑर्डर", branch:"स्टोर", total:"कुल", priceNote:"कीमतें अल-हरमैन की ऑनलाइन दुकान से हैं और स्टोर के अनुसार थोड़ी अलग हो सकती हैं।" },
  zh: { home:"首页", cats:"分类", fav:"收藏", stores:"门店", search:"搜索大米、茶、枣、香料…", shopFrom:"购物门店", change:"更换", deals:"门店优惠", popular:"最受欢迎", all:"查看全部", allCats:"全部分类", add:"加入购物车", oos:"缺货", inStock:"有货", cart:"购物车", emptyCart:"购物车是空的", emptyFav:"还没有收藏", start:"开始购物", bill:"汇总", items:"件数", subtotal:"小计", taxNote:"税费和最终总额在订单备好后由门店确认。", sendWa:"通过 WhatsApp 发送订单", call:"电话", callStore:"致电门店确认", dir:"路线", pick:"选择", picked:"当前门店 ✓", nearest:"离您最近", locate:"📍 查找最近的门店", locating:"正在定位…", locFail:"无法获取位置，请手动选择门店", chooseStore:"选择门店", mi:"英里", results:"个结果", noRes:"没有结果", products:"件商品", more:"显示更多", sale:"优惠", hot:"热门", added:"已加入购物车 ✓", switched:"已切换到", clear:"清空购物车", cleared:"购物车已清空", pickup:"取货门店", sortDef:"推荐", sortLow:"价格从低到高", sortHigh:"价格从高到低", onlyStock:"仅显示有货", heroTag:"2,500+ 商品", heroP:"来自 30 多个国家的国际商品", order:"来自 Al-Haramain 应用的新订单", branch:"门店", total:"总计", priceNote:"价格来自 Al-Haramain 网店，各门店可能略有不同。" },
  ko: { home:"홈", cats:"카테고리", fav:"즐겨찾기", stores:"매장", search:"쌀, 차, 대추, 향신료 검색…", shopFrom:"쇼핑 매장", change:"변경", deals:"매장 특가", popular:"인기 상품", all:"전체 보기", allCats:"전체 카테고리", add:"장바구니 담기", oos:"품절", inStock:"재고 있음", cart:"장바구니", emptyCart:"장바구니가 비어 있습니다", emptyFav:"즐겨찾기가 아직 없습니다", start:"쇼핑 시작", bill:"요약", items:"수량", subtotal:"소계", taxNote:"세금과 최종 금액은 주문 준비 시 매장에서 확인합니다.", sendWa:"WhatsApp으로 주문 보내기", call:"전화", callStore:"매장에 전화해 확인", dir:"길찾기", pick:"선택", picked:"현재 매장 ✓", nearest:"가장 가까움", locate:"📍 가까운 매장 찾기", locating:"위치 확인 중…", locFail:"위치를 가져올 수 없습니다 — 매장을 직접 선택하세요", chooseStore:"매장 선택", mi:"마일", results:"개 결과", noRes:"결과 없음", products:"개 상품", more:"더 보기", sale:"특가", hot:"인기", added:"장바구니에 추가됨 ✓", switched:"변경됨:", clear:"장바구니 비우기", cleared:"장바구니가 비워졌습니다", pickup:"수령 매장", sortDef:"추천순", sortLow:"낮은 가격순", sortHigh:"높은 가격순", onlyStock:"재고 있는 상품만", heroTag:"2,500개 이상 상품", heroP:"30개국 이상의 국제 상품", order:"Al-Haramain 앱의 새 주문", branch:"매장", total:"합계", priceNote:"가격은 Al-Haramain 온라인 스토어 기준이며 매장마다 약간 다를 수 있습니다." },
  bn: { home:"হোম", cats:"ক্যাটাগরি", fav:"পছন্দের", stores:"দোকান", search:"চাল, চা, খেজুর, মশলা খুঁজুন…", shopFrom:"এই দোকান থেকে কেনাকাটা", change:"পরিবর্তন", deals:"দোকানের অফার", popular:"সবচেয়ে জনপ্রিয়", all:"সব দেখুন", allCats:"সব ক্যাটাগরি", add:"কার্টে যোগ করুন", oos:"স্টকে নেই", inStock:"স্টকে আছে", cart:"কার্ট", emptyCart:"আপনার কার্ট খালি", emptyFav:"এখনও কোনো পছন্দের পণ্য নেই", start:"কেনাকাটা শুরু করুন", bill:"সারাংশ", items:"পণ্যের সংখ্যা", subtotal:"উপমোট", taxNote:"কর ও চূড়ান্ত মোট অর্ডার প্রস্তুত হলে দোকান নিশ্চিত করবে।", sendWa:"হোয়াটসঅ্যাপে অর্ডার পাঠান", call:"কল করুন", callStore:"নিশ্চিত করতে দোকানে কল করুন", dir:"দিকনির্দেশনা", pick:"নির্বাচন", picked:"বর্তমান দোকান ✓", nearest:"আপনার সবচেয়ে কাছে", locate:"📍 আমার কাছের দোকান খুঁজুন", locating:"আপনার অবস্থান খোঁজা হচ্ছে…", locFail:"অবস্থান পাওয়া যায়নি — দোকান নিজে বেছে নিন", chooseStore:"আপনার দোকান বেছে নিন", mi:"মাইল", results:"ফলাফল", noRes:"কোনো ফলাফল নেই", products:"পণ্য", more:"আরও দেখান", sale:"অফার", hot:"জনপ্রিয়", added:"কার্টে যোগ হয়েছে ✓", switched:"পরিবর্তন করা হয়েছে:", clear:"কার্ট খালি করুন", cleared:"কার্ট খালি হয়েছে", pickup:"সংগ্রহের দোকান", sortDef:"প্রস্তাবিত", sortLow:"দাম: কম", sortHigh:"দাম: বেশি", onlyStock:"শুধু স্টকে থাকা", heroTag:"২,৫০০+ পণ্য", heroP:"৩০+ দেশের আন্তর্জাতিক পণ্য", order:"Al-Haramain অ্যাপ থেকে নতুন অর্ডার", branch:"দোকান", total:"মোট", priceNote:"দাম Al-Haramain-এর অনলাইন স্টোর থেকে নেওয়া, এবং দোকানভেদে সামান্য পার্থক্য হতে পারে।" },
  ku: { home:"سەرەکی", cats:"جۆرەکان", fav:"دڵخوازەکان", stores:"فرۆشگاکان", search:"برنج، چا، خورما، بەهارات بگەڕێ…", shopFrom:"کڕین لە فرۆشگای", change:"گۆڕین", deals:"داشکاندنەکانی فرۆشگا", popular:"باوترین", all:"هەموو ببینە", allCats:"هەموو جۆرەکان", add:"زیادکردن بۆ سەبەتە", oos:"نەماوە", inStock:"بەردەستە", cart:"سەبەتە", emptyCart:"سەبەتەکەت بەتاڵە", emptyFav:"هیچ دڵخوازێک نییە", start:"دەست پێبکە", bill:"پوختە", items:"دانە", subtotal:"کۆی بەشەکان", taxNote:"باج و کۆی کۆتایی لەلایەن فرۆشگاوە پشتڕاست دەکرێتەوە.", sendWa:"ناردنی داواکاری بە واتسئاپ", call:"پەیوەندی", callStore:"پەیوەندی بە فرۆشگاوە بکە بۆ دڵنیابوون", dir:"ڕێنمایی", pick:"هەڵبژاردن", picked:"فرۆشگای ئێستا ✓", nearest:"نزیکترینت", locate:"📍 نزیکترین فرۆشگا بدۆزەرەوە", locating:"شوێنەکەت دەدۆزرێتەوە…", locFail:"شوێن دەست نەکەوت — فرۆشگا بە دەستی هەڵبژێرە", chooseStore:"فرۆشگاکەت هەڵبژێرە", mi:"مایل", results:"ئەنجام", noRes:"هیچ ئەنجامێک نییە", products:"بەرهەم", more:"زیاتر پیشان بدە", sale:"داشکاندن", hot:"باو", added:"زیادکرا بۆ سەبەتە ✓", switched:"گۆڕدرا بۆ", clear:"سەبەتە خاوێنبکەرەوە", cleared:"سەبەتە خاوێنکرایەوە", pickup:"وەرگرتن لە", sortDef:"پێشنیارکراو", sortLow:"نرخ: کەم", sortHigh:"نرخ: زۆر", onlyStock:"تەنها بەردەستەکان", heroTag:"+٢٥٠٠ بەرهەم", heroP:"بەرهەمی نێودەوڵەتی لە زیاتر لە ٣٠ وڵات", order:"داواکاری نوێ لە ئەپی الحرمین", branch:"فرۆشگا", total:"کۆی گشتی", priceNote:"نرخەکان لە فرۆشگای ئۆنلاینی الحرمین وەردەگیرێن و لە هەر فرۆشگایەکدا کەمێک جیاوازە." }
};
// كلمات بحث عربية ← إنجليزية (أسماء المنتجات بالإنجليزية)
const SYN = { "ارز":"rice","رز":"rice","شاي":"tea","قهوه":"coffee","بن":"coffee","تمر":"date","تمور":"date","عسل":"honey","زيت":"oil","زيتون":"olive","سمن":"ghee",
  "بهارات":"masala","كمون":"cumin","كركم":"turmeric","فلفل":"pepper","هيل":"cardamom","قرفه":"cinnamon","زعفران":"saffron","زنجبيل":"ginger","ثوم":"garlic",
  "معكرونه":"pasta","مكرونه":"pasta","شعيريه":"vermicelli","خل":"vinegar","مخلل":"pickle","تونه":"tuna","سردين":"sardine","لانشون":"luncheon","فول":"fava",
  "حمص":"chick","عدس":"lentil","فاصوليا":"beans","طحين":"flour","دقيق":"flour","سكر":"sugar","ملح":"salt","بسكويت":"biscuit","شوكولاته":"chocolate",
  "حلاوه":"halva","حلوى":"candy","فستق":"pistachio","كاجو":"cashew","لوز":"almond","جوز":"walnut","مكسرات":"nuts","بخور":"bakhoor","عود":"oud","عطر":"perfume",
  "صابون":"soap","طحينه":"tahini","صلصه":"sauce","معجون":"paste","طماطم":"tomato","كاتشب":"ketchup","خبز":"bread","حليب":"milk","جبنه":"cheese","عصير":"juice",
  "بسمتي":"basmati","كزبره":"coriander","حبه":"seed","سمسم":"sesame","جوز الهند":"coconut","ماء ورد":"rose water","دبس":"molasses","مربى":"jam" };

/* ── الحالة ── */
const ls = { get:(k,d)=>{ try{ const v=localStorage.getItem("hr_"+k); return v==null?d:JSON.parse(v);}catch(e){return d;} }, set:(k,v)=>{ try{localStorage.setItem("hr_"+k,JSON.stringify(v));}catch(e){} } };
let lang = ls.get("lang","en");
const LANGS = { en:"English", ar:"العربية", hi:"हिन्दी", zh:"中文", ko:"한국어", bn:"বাংলা", ku:"کوردی" };
const L2 = () => (lang === "ar" || lang === "ku") ? "ar" : "en";   // لغة الأسماء العربية/الإنجليزية
const ARIDX = () => (lang === "ar" || lang === "ku") ? 2 : 3;
let branchId = ls.get("branch", null);
let carts = ls.get("carts", {});
let favs = new Set(ls.get("favs", []));
let userPos = null, nearestId = null;
let ALL = [], CAT_IDS = [], byKey = new Map(), loaded = false;
let listState = { key:"", n:PAGE, sort:"def", stock:false };

const t = k => (TX[lang] || {})[k] ?? TX.en[k] ?? k;
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => "$" + Number(n).toFixed(2);
const branch = () => BR.find(b => b.id === branchId) || BR[2];
const bName = b => b[L2()];
const cart = () => (carts[branch().id] ||= {});
const catMeta = id => CATS.find(c => c[0] === id) || CATS[CATS.length-1];
const catName = id => catMeta(id)[ARIDX()];
const img = (id, w=360) => /^https?:/.test(id) ? id : `https://static.wixstatic.com/media/${id}/v1/fit/w_${w},h_${w},q_85/p.webp`;
const norm = s => s.toLowerCase().replace(/[ً-ْ]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي");

/* ── منتجات الفرع الحالي (عروض/إخفاء/إضافات لكل فرع) ── */
let VIEW = [];
function buildView(){
  const b = branch();
  const hide = (b.hide||[]).map(norm), deals = b.deals||[];
  VIEW = ALL.filter(p => !hide.some(h => p.s.includes(h))).map(p => {
    const d = deals.find(d => p.s.includes(norm(d.match)));
    return d ? {...p, price:d.price, old:p.old||p.price, deal:true} : p;
  });
  (b.extra||[]).forEach((x,i) => VIEW.unshift({ k:"x_"+b.id+"_"+i, name:x.name, s:norm(x.name), price:x.price, old:x.old||0, stock:1, img:x.img||"", cat:x.cat||"other", deal:!!x.deal, pop:false }));
  // توفر المنتجات الذي يضبطه مدير الفرع من الحسابات (admin.js)
  const outSet = window.HR_OUT ? window.HR_OUT(b.id) : new Set();
  if (outSet.size) VIEW = VIEW.map(p => outSet.has(p.k) ? {...p, stock:0} : p);
  byKey = new Map(VIEW.map(p => [p.k, p]));
}

/* ── البطاقات ── */
const heartSvg = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
function actionBar(p){
  const q = cart()[p.k] || 0;
  if (!p.stock) return `<div class="addbar off">${t("oos")}</div>`;
  return q ? `<div class="step"><button data-dec="${esc(p.k)}" aria-label="-">−</button><span>${q}</span><button data-inc="${esc(p.k)}" aria-label="+">+</button></div>`
           : `<button class="addbar" data-inc="${esc(p.k)}">+ ${t("add")}</button>`;
}
function card(p){
  return `<article class="card ${p.stock?"":"oos"}" data-card="${esc(p.k)}">
    ${p.deal ? `<span class="badge sale">${t("sale")}</span>` : p.pop ? `<span class="badge">${t("hot")}</span>` : ""}
    <button class="heart ${favs.has(p.k)?"on":""}" data-fav="${esc(p.k)}" aria-label="favorite">${heartSvg}</button>
    <div class="pic" data-open="${esc(p.k)}"><img loading="lazy" decoding="async" src="${esc(img(p.img))}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'"></div>
    <div class="info" data-open="${esc(p.k)}"><h3>${esc(p.name)}</h3>
      <div class="price"><b>${money(p.price)}</b>${p.old>p.price?`<s>${money(p.old)}</s>`:""}</div></div>
    <div data-bar="${esc(p.k)}">${actionBar(p)}</div>
  </article>`;
}
const rail = (title, list, href) => list.length ? `<section class="sec"><div class="sec-h"><h2>${title}</h2>${href?`<a href="${href}">${t("all")} ›</a>`:""}</div><div class="rail">${list.slice(0,14).map(card).join("")}</div></section>` : "";

/* ── الصفحات ── */
function vHome(){
  const b = branch();
  if (!loaded) return `<div class="skel" style="height:160px;margin-bottom:20px"></div><div class="grid">${'<div class="skel"></div>'.repeat(4)}</div>`;
  const counts = {}; VIEW.forEach(p => counts[p.cat] = (counts[p.cat]||0)+1);
  const cats = CATS.filter(c => counts[c[0]]);
  const stock = VIEW.filter(p => p.stock);
  let h = `<section class="sec"><div class="hero" style="background:linear-gradient(135deg,${b.color},color-mix(in srgb,${b.color} 60%,#000))">
      <span class="tag">${t("heroTag")}</span><h2>${esc(b.banner[L2()])}</h2><p>${t("heroP")}</p>
      <div class="hero-btns"><a class="hb" href="#/cats">${t("start")}</a><a class="hb ghost" href="tel:${b.phone.replace(/\D/g,"")}">📞 ${t("call")}</a></div>
      <span class="em">🛒</span></div></section>
    <section class="sec"><div class="sec-h"><h2>${t("cats")}</h2><a href="#/cats">${t("all")} ›</a></div>
      <div class="bubbles">${cats.map(c => `<a class="bubble" href="#/c/${c[0]}"><i>${c[1]}</i><b>${c[ARIDX()]}</b></a>`).join("")}</div></section>`;
  h += rail("🔥 " + t("deals"), stock.filter(p => p.deal), "#/c/deals");
  h += rail("⭐ " + t("popular"), stock.filter(p => p.pop && !p.deal), "#/c/popular");
  ["dates","rice","tea","spices","coffee","nuts","oils","perfume"].forEach(id => {
    const m = catMeta(id); h += rail(`${m[1]} ${catName(id)}`, stock.filter(p => p.cat === id), "#/c/"+id);
  });
  return h + `<p class="count" style="text-align:center">${t("priceNote")}</p>`;
}
function vCats(){
  const counts = {}; VIEW.forEach(p => counts[p.cat] = (counts[p.cat]||0)+1);
  return `<div class="page-h"><h1>${t("allCats")}</h1></div><div class="catgrid">` +
    CATS.filter(c => counts[c[0]]).map(c => `<a class="catcard" href="#/c/${c[0]}"><i>${c[1]}</i><b>${c[ARIDX()]}</b><small>${counts[c[0]]} ${t("products")}</small></a>`).join("") + `</div>`;
}
function listFor(key, q){
  let list;
  if (key === "deals") list = VIEW.filter(p => p.deal);
  else if (key === "popular") list = VIEW.filter(p => p.pop);
  else if (key === "search") {
    const words = norm(q).split(/\s+/).filter(Boolean).map(w => SYN[w] || w);
    list = VIEW.filter(p => words.every(w => p.s.includes(w) || norm(catName(p.cat)).includes(w)));
  } else list = VIEW.filter(p => p.cat === key);
  if (listState.stock) list = list.filter(p => p.stock);
  if (listState.sort === "low") list = [...list].sort((a,b) => a.price-b.price);
  if (listState.sort === "high") list = [...list].sort((a,b) => b.price-a.price);
  return list;
}
function vList(key, q){
  const id = key + "|" + (q||"");
  if (listState.key !== id) listState = { key:id, n:PAGE, sort:"def", stock:false };
  const list = listFor(key, q);
  const title = key==="deals" ? "🔥 "+t("deals") : key==="popular" ? "⭐ "+t("popular") : key==="search" ? `“${esc(q)}”` : `${catMeta(key)[1]} ${catName(key)}`;
  const counts = {}; VIEW.forEach(p => counts[p.cat] = 1);
  const tabs = key==="search" ? "" : `<nav class="tabs">${CATS.filter(c => counts[c[0]]).map(c => `<a href="#/c/${c[0]}" class="${c[0]===key?"on":""}">${c[ARIDX()]}</a>`).join("")}</nav>`;
  const pill = (v, label, on) => `<button class="pill ${on?"on":""}" data-sort="${v}">${label}</button>`;
  return `<div class="page-h"><a class="back" href="#/" aria-label="back">←</a><h1>${title}</h1><span class="count">${list.length} ${t("products")}</span></div>${tabs}
    <div class="pills">${pill("def",t("sortDef"),listState.sort==="def")}${pill("low",t("sortLow"),listState.sort==="low")}${pill("high",t("sortHigh"),listState.sort==="high")}
      <button class="pill ${listState.stock?"on":""}" data-stock="1">${t("onlyStock")}</button></div>
    ${list.length ? `<div class="grid">${list.slice(0,listState.n).map(card).join("")}</div>${list.length>listState.n?`<button class="more" data-more="1">${t("more")}</button>`:""}`
                  : `<div class="empty"><i>🔎</i>${t("noRes")}</div>`}`;
}
function vFav(){
  const list = VIEW.filter(p => favs.has(p.k));
  return `<div class="page-h"><h1>❤️ ${t("fav")}</h1></div>` + (list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty"><i>🤍</i>${t("emptyFav")}<br><a href="#/cats">${t("start")}</a></div>`);
}
function cartLines(){ return Object.entries(cart()).map(([k,q]) => ({p:byKey.get(k), q})).filter(x => x.p); }
function vCart(){
  const b = branch(), lines = cartLines();
  if (!lines.length) return `<div class="page-h"><h1>🛒 ${t("cart")}</h1></div><div class="empty"><i>🛒</i>${t("emptyCart")}<br><a href="#/cats">${t("start")}</a></div>`;
  const n = lines.reduce((s,x) => s+x.q, 0), sub = lines.reduce((s,x) => s+x.q*x.p.price, 0);
  return `<div class="page-h"><h1>🛒 ${t("cart")}</h1><button class="trash" data-clear="1" aria-label="${t("clear")}">🗑</button></div>
    <div class="note">📍 ${t("pickup")}: <b>${esc(bName(b))}</b></div>
    ${lines.map(({p,q}) => `<div class="line"><img src="${esc(img(p.img,160))}" alt="" onerror="this.style.visibility='hidden'">
      <div class="li"><h4>${esc(p.name)}</h4><div class="lp">${money(p.price*q)}</div>
      <div class="qty"><button class="minus" data-dec="${esc(p.k)}">−</button><span>${q}</span><button data-inc="${esc(p.k)}">+</button></div></div>
      <button class="trash" data-del="${esc(p.k)}" aria-label="remove">🗑</button></div>`).join("")}
    <div class="bill"><h3>${t("bill")}</h3>
      <div class="row"><span>${t("items")}</span><b>${n}</b></div>
      <div class="row tot"><span>${t("subtotal")}</span><b>${money(sub)}</b></div><small>${t("taxNote")}</small></div>
    <button class="big wa" data-wa="1">💬 ${t("sendWa")}</button>
    <a class="big alt" href="tel:${b.phone.replace(/\D/g,"")}">📞 ${t("callStore")} · <span dir="ltr">${b.phone}</span></a>`;
}
const dist = (a, b) => { const R=3958.8, r=Math.PI/180, dl=(b.lat-a.lat)*r, dn=(b.lng-a.lng)*r, x=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2; return 2*R*Math.asin(Math.sqrt(x)); };
function storeCards(){
  const list = userPos ? [...BR].sort((a,b) => dist(userPos,a)-dist(userPos,b)) : BR;
  return `<button class="locate" data-locate="1">${t("locate")}</button>` + list.map(b => `<div class="store ${b.id===branch().id?"on":""}">
    ${b.id===nearestId?`<span class="near">${t("nearest")}</span>`:""}
    <div class="store-h"><span class="store-n" style="background:${b.color}">${b.n}</span><div><h3>${esc(bName(b))}</h3><p>${esc(b.addr)}</p>
      ${userPos?`<span class="dist">${dist(userPos,b).toFixed(1)} ${t("mi")}</span>`:""}</div></div>
    <div class="store-a"><button class="pick" data-pick="${b.id}">${b.id===branch().id?t("picked"):t("pick")}</button>
      <a href="tel:${b.phone.replace(/\D/g,"")}" dir="ltr">📞 ${b.phone}</a>
      <a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.addr)}">🗺 ${t("dir")}</a></div></div>`).join("");
}
const vStores = () => `<div class="page-h"><h1>📍 ${t("stores")}</h1></div>` + storeCards() ;

/* ── التوجيه ── */
function route(){
  const h = decodeURIComponent(location.hash.slice(2) || "");
  const [a, b] = h.split("/"); let html, tab = "home";
  if (a === "cats") { html = vCats(); tab = "cats"; }
  else if (a === "c" && b) { html = vList(b); tab = "cats"; }
  else if (a === "s" && b) { html = vList("search", b); tab = "home"; }
  else if (a === "cart") { html = vCart(); tab = "cart"; }
  else if (a === "fav") { html = vFav(); tab = "fav"; }
  else if (a === "stores") { html = vStores(); tab = "stores"; }
  else if (a === "acc") { html = window.HR_ADMIN ? window.HR_ADMIN.view() : `<div class="empty">…</div>`; tab = "stores"; }
  else html = vHome();
  $("#view").innerHTML = html;
  document.querySelectorAll(".tabbar a").forEach(x => x.classList.toggle("on", x.dataset.tab === tab));
}
function chrome(){
  const b = branch();
  document.documentElement.lang = lang; document.documentElement.dir = (lang === "ar" || lang === "ku") ? "rtl" : "ltr";
  document.documentElement.style.setProperty("--accent", b.color);
  $("#brandName").textContent = BRAND[L2()]; $("#brandSub").textContent = L2() === "ar" ? BRAND.subAr : BRAND.subEn;
  $("#langBtn").textContent = LANGS[lang];
  $("#bpLabel").textContent = t("shopFrom"); $("#bpName").textContent = bName(b);
  $("#q").placeholder = t("search");
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = t(el.dataset.t));
  badge();
}
function badge(){
  const n = Object.values(cart()).reduce((s,q) => s+q, 0), el = $("#cartBadge");
  el.hidden = !n; el.textContent = n;
}
function refresh(){ buildView(); chrome(); route(); }

/* ── أفعال ── */
function toast(m){ const el = $("#toast"); el.textContent = m; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 1700); }
function setQty(k, d, abs){
  const c = cart(); c[k] = abs != null ? abs : (c[k]||0) + d; if (c[k] <= 0) delete c[k];
  ls.set("carts", carts); badge();
  if (d > 0) { const f = $(".fab"); f.classList.remove("bump"); void f.offsetWidth; f.classList.add("bump"); }
  if (location.hash.startsWith("#/cart")) return route();
  const p = byKey.get(k);
  document.querySelectorAll("[data-bar]").forEach(el => { if (el.dataset.bar === k) el.innerHTML = actionBar(p); });
  if ($("#sheet").classList.contains("on") && $("#sheet").dataset.k === k) openProduct(k);
}
function openSheet(html, k=""){ $("#sheetBody").innerHTML = html; $("#sheet").dataset.k = k; $("#sheet").classList.add("on"); $("#scrim").classList.add("on"); }
function closeSheet(){ $("#sheet").classList.remove("on"); $("#scrim").classList.remove("on"); }
function openProduct(k){
  const p = byKey.get(k); if (!p) return; const q = cart()[k] || 0;
  openSheet(`<div class="pd-img"><img src="${esc(img(p.img,700))}" alt="${esc(p.name)}"></div>
    <span class="pd-cat">${catMeta(p.cat)[1]} ${catName(p.cat)}</span> <span class="stock ${p.stock?"":"no"}">${p.stock?t("inStock"):t("oos")}</span>
    <h2 class="pd-name">${esc(p.name)}</h2>
    <div class="pd-price">${money(p.price)}${p.old>p.price?`<s>${money(p.old)}</s>`:""}</div>
    ${p.stock ? `<div class="pd-row">${q?`<div class="pd-qty"><button data-dec="${esc(k)}">−</button><span>${q}</span><button data-inc="${esc(k)}">+</button></div><a class="big" href="#/cart" data-close="1">🛒 ${t("cart")}</a>`
      :`<button class="big" data-inc="${esc(k)}">+ ${t("add")}</button>`}</div>` : ""}`, k);
}
function pickBranch(id, quiet){
  branchId = id; ls.set("branch", id); closeSheet(); refresh();
  if (!quiet) toast(`${t("switched")} ${bName(branch())}`);
}
function locate(auto){
  if (!navigator.geolocation) return auto || toast(t("locFail"));
  if (!auto) toast(t("locating"));
  navigator.geolocation.getCurrentPosition(pos => {
    userPos = { lat:pos.coords.latitude, lng:pos.coords.longitude };
    nearestId = [...BR].sort((a,b) => dist(userPos,a)-dist(userPos,b))[0].id;
    if (auto && !ls.get("branch", null)) pickBranch(nearestId, true);
    else if (!auto) pickBranch(nearestId);
    else route();
    if ($("#sheet").classList.contains("on") && !$("#sheet").dataset.k) openSheet(`<h2>${t("chooseStore")}</h2>` + storeCards());
  }, () => { if (!auto) toast(t("locFail")); }, { timeout:8000, maximumAge:600000 });
}
function sendOrder(){
  const b = branch(), lines = cartLines(), sub = lines.reduce((s,x) => s+x.q*x.p.price, 0);
  const msg = `${t("order")}\n${t("branch")}: ${b.en}\n\n` + lines.map(({p,q}) => `• ${q} × ${p.name} — ${money(p.price*q)}`).join("\n") + `\n\n${t("total")}: ${money(sub)}`;
  window.open(`https://wa.me/${b.whatsapp||""}?text=${encodeURIComponent(msg)}`, "_blank");
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-inc],[data-dec],[data-del],[data-open],[data-fav],[data-pick],[data-locate],[data-more],[data-sort],[data-stock],[data-clear],[data-wa],[data-close]");
  if (!el) return; const d = el.dataset;
  if (d.inc) { setQty(d.inc, 1); toast(t("added")); }
  else if (d.dec) setQty(d.dec, -1);
  else if (d.del) setQty(d.del, 0, 0);
  else if (d.open) openProduct(d.open);
  else if (d.fav) { favs.has(d.fav) ? favs.delete(d.fav) : favs.add(d.fav); ls.set("favs", [...favs]); el.classList.toggle("on"); if (location.hash.startsWith("#/fav")) route(); }
  else if (d.pick) pickBranch(d.pick);
  else if (d.locate) locate(false);
  else if (d.more) { listState.n += PAGE; const y = scrollY; route(); scrollTo(0, y); }
  else if (d.sort) { listState.sort = d.sort; listState.n = PAGE; route(); }
  else if (d.stock) { listState.stock = !listState.stock; listState.n = PAGE; route(); }
  else if (d.clear) { carts[branch().id] = {}; ls.set("carts", carts); badge(); route(); toast(t("cleared")); }
  else if (d.wa) sendOrder();
  else if (d.close) closeSheet();
});
$("#scrim").onclick = closeSheet;
$("#branchBtn").onclick = () => openSheet(`<h2>${t("chooseStore")}</h2>` + storeCards());
$("#langBtn").onclick = () => openSheet(`<h2>🌐</h2>` + Object.entries(LANGS).map(([k,v]) => `<button class="big ${k===lang?"":"alt"}" data-lang="${k}">${v}</button>`).join("") + `<button class="big alt" data-tr="1">🌍 Translate to any language</button><div id="gt"></div>`);
document.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (!b) return; lang = b.dataset.lang; ls.set("lang", lang); closeSheet(); refresh(); });
/* ── ترجمة لأي لغة عبر Google Translate (مجاني) ── */
function loadTranslate(){
  const box = document.getElementById("gt"); if (!box) return;
  window.googleTranslateElementInit = () => { box.innerHTML = ""; new google.translate.TranslateElement({ pageLanguage:"en", autoDisplay:false }, "gt"); };
  if (window.google && google.translate && google.translate.TranslateElement) return window.googleTranslateElementInit();
  if (!document.getElementById("gtScript")) { const s = document.createElement("script"); s.id = "gtScript"; s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"; document.body.appendChild(s); }
}
document.addEventListener("click", e => { if (e.target.closest("[data-tr]")) loadTranslate(); });
let qT; $("#q").oninput = e => { const v = e.target.value.trim(); $("#qClear").hidden = !v; clearTimeout(qT);
  qT = setTimeout(() => { location.hash = v ? "#/s/" + encodeURIComponent(v) : "#/"; }, 250); };
$("#qClear").onclick = () => { $("#q").value = ""; $("#qClear").hidden = true; location.hash = "#/"; };
addEventListener("hashchange", () => { closeSheet(); route(); if (!location.hash.startsWith("#/s/")) scrollTo(0, 0); });
addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
// تحميل تلقائي عند الاقتراب من نهاية القائمة
addEventListener("scroll", () => { const m = $("[data-more]"); if (m && m.getBoundingClientRect().top < innerHeight + 300) m.click(); }, { passive:true });

/* ── بدء التشغيل ── */
$("#logo").src = "logo.png";
let lastC = false; addEventListener("scroll", () => { const c = scrollY > (lastC ? 40 : 140); if (c !== lastC) { lastC = c; $("#top").classList.toggle("compact", c); } }, { passive:true });
chrome(); route();
window.HR_REFRESH = () => { if (loaded) { buildView(); route(); } };
window.HR_ALL = () => ALL;
fetch("catalog.json").then(r => r.json()).then(d => {
  CAT_IDS = d.c;
  const seen = {};
  ALL = d.p.map(r => ({ k:(seen[r[0]] = (seen[r[0]]||0)+1) > 1 ? r[0]+" #"+seen[r[0]] : r[0], name:r[0], s:norm(r[0]), price:r[1], old:r[2], stock:r[3], img:r[4], cat:CAT_IDS[r[5]] || "other", deal:!!(r[6]&1) || (r[2]>r[1]), pop:!!(r[6]&2) }));
  loaded = true; refresh();
}).catch(() => { $("#view").innerHTML = `<div class="empty"><i>⚠️</i>catalog.json</div>`; });
if (!branchId) { openSheet(`<h2>${t("chooseStore")}</h2>` + storeCards()); locate(true); }
else if (navigator.permissions) navigator.permissions.query({name:"geolocation"}).then(s => { if (s.state === "granted") locate(true); }).catch(()=>{});
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
