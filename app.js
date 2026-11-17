(() => {
const S = window.STORE, CATS = window.CATEGORIES, P = window.PRODUCTS;
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const FREE_SHIP = 75;

const T = {
  ar: {},
  en: {
    topbar:"🚚 Local delivery & store pickup — products from 30+ countries", brand:"Al-Haramain", brandSub:"International Foods",
    searchPh:"Search dates, honey, rice, spices...", navCats:"Categories", navDeals:"Deals", navShop:"Shop", navAbout:"About", navContact:"Contact",
    heroPill:"✨ Your international market in Farmington", heroTitle:"Fresh, Convenient,<br>and Affordable",
    heroDesc:"Everything you need from Middle Eastern, Indian, Pakistani, Asian and Western products — dates, honey, fresh halal meat and bread baked daily.",
    heroBtn1:"Start Shopping Now", heroBtn2:"Weekly Deals", stat1:"Countries", stat2:"Products", stat3:"Halal Meat",
    heroCardT:"Fresh bread daily", heroCardS:"From our oven to your table",
    f1t:"Halal Meat", f1s:"Fresh every day", f2t:"30+ Countries", f2s:"Authentic products", f3t:"Great Prices", f3s:"Weekly deals", f4t:"Fast Pickup", f4s:"Order & collect",
    catsTitle:"Shop by Category", catsSub:"18+ departments with everything your home needs",
    dealPill:"⏰ Limited time", dealTitle:"Weekly Deals", dealSub:"Save on your essentials — deals end in:", cdD:"Days", cdH:"Hours", cdM:"Min", cdS:"Sec",
    datesT:"Premium Dates Corner", datesS:"Medjool, Sukkari, Ajwa, Khalas... carefully selected", honeyT:"Sidr & Socotra Honey", honeyS:"Authentic Yemeni honey from the finest apiaries", shopNow:"Shop Now",
    bestTitle:"Best Sellers", bestSub:"Our customers' favorites", shopTitle:"All Products",
    sortDef:"Sort: Recommended", sortLow:"Price: Low to High", sortHigh:"Price: High to Low", sortName:"Name", noResults:"No results — try another word",
    aboutPill:"About Us", aboutTitle:"Your second home for shopping",
    aboutP1:"Al-Haramain International Foods is a grocery store in Farmington, Michigan, bringing Middle Eastern, Indian, Pakistani, Asian and Western products under one roof.",
    aboutP2:"We care about quality and freshness, offering halal meat, bread baked daily, and a wide range of dates, honey and spices from over 30 countries.",
    ch1:"✅ Authentic imported products", ch2:"✅ Fresh halal meat & poultry", ch3:"✅ Competitive prices & ongoing deals", ch4:"✅ Service in Arabic & English",
    whyTitle:"Why customers choose us", w1t:"Everything in one place", w1s:"From groceries to perfumes, bakhoor and baby products.", w2t:"Daily freshness", w2s:"Produce, bread and meat arriving every day.", w3t:"Service that knows you", w3s:"A team that speaks your language and knows your home.",
    contactTitle:"Visit or contact us", addrL:"Address", phoneL:"Phone", callBtn:"📞 Call Now", mapBtn:"🗺️ Directions",
    newsT:"Don't miss the deals!", newsS:"Subscribe to get new offers every week", emailPh:"Your email", subBtn:"Subscribe",
    footAbout:"Fresh, convenient and affordable — products from over 30 countries.", footLinks:"Links", footHelp:"Help", ship:"Shipping & Returns", pay:"Payment Methods", terms:"Terms & Conditions",
    copy:"© Al-Haramain International Foods — All rights reserved", cartTitle:"Shopping Cart", total:"Total", checkout:"Send order via WhatsApp", clear:"Clear cart",
    bnHome:"Home", bnCart:"Cart",
    // dynamic
    all:"All", items:"products", add:"Add to cart", added:"Added to cart ✓", cartEmpty:"Your cart is empty", startShop:"Start shopping",
    freeLeft:"Add {x} more for free delivery 🚚", freeOk:"🎉 You've unlocked free delivery!", subOk:"Subscribed successfully 🌿",
    orderHi:"Hello, I'd like to order:", orderTotal:"Total", cleared:"Cart cleared", fav:"Saved to favorites ❤️", unfav:"Removed from favorites", prods:"products"
  }
};
const ARD = {
  all:"الكل", items:"منتج", add:"أضف إلى السلة", added:"تمت الإضافة إلى السلة ✓", cartEmpty:"سلتك فارغة", startShop:"ابدأ التسوق",
  freeLeft:"أضف {x} للحصول على توصيل مجاني 🚚", freeOk:"🎉 حصلت على توصيل مجاني!", subOk:"تم الاشتراك بنجاح 🌿",
  orderHi:"السلام عليكم، أريد طلب:", orderTotal:"الإجمالي", cleared:"تم إفراغ السلة", fav:"أضيف إلى المفضلة ❤️", unfav:"أزيل من المفضلة", prods:"منتجات"
};

let lang = localGet("lang") || "ar";
let cart = JSON.parse(localGet("cart") || "{}");
let favs = new Set(JSON.parse(localGet("favs") || "[]"));
let filter = "all", query = "", sort = "def";

function localGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function localSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
const t = k => lang === "en" ? (T.en[k] ?? k) : (ARD[k] ?? k);
const money = n => "$" + n.toFixed(2);
const catName = id => { const c = CATS.find(c => c.id === id); return c ? c[lang] : ""; };

// حفظ النصوص العربية الأصلية
$$("[data-t]").forEach(el => el.dataset.ar = el.innerHTML);
$$("[data-tp]").forEach(el => el.dataset.arp = el.placeholder);

function applyLang(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $$("[data-t]").forEach(el => el.innerHTML = lang === "en" ? (T.en[el.dataset.t] ?? el.dataset.ar) : el.dataset.ar);
  $$("[data-tp]").forEach(el => el.placeholder = lang === "en" ? T.en[el.dataset.tp] : el.dataset.arp);
  $("#langBtn").textContent = lang === "ar" ? "English" : "العربية";
  $("#addrText").textContent = S.address[lang];
  $("#phoneLink").textContent = S.phone;
  $("#phoneLink").href = $("#callBtn").href = "tel:" + S.phoneLink;
  $("#mapBtn").href = S.mapUrl;
  renderAll();
}

function card(p){
  const q = cart[p.id] || 0;
  return `<div class="card">
    ${p.tag ? `<span class="tag ${p.tag}">${{best: lang==="ar"?"الأكثر مبيعًا":"Best seller", deal: lang==="ar"?"عرض":"Deal", new: lang==="ar"?"جديد":"New"}[p.tag]}</span>` : ""}
    <button class="fav" data-fav="${p.id}" aria-label="fav">${favs.has(p.id) ? "❤️" : "🤍"}</button>
    <div class="card-img" data-open="${p.id}">${p.icon}</div>
    <h4 data-open="${p.id}">${p[lang]}</h4>
    <span class="unit">${p.unit[lang]}</span>
    <div class="price-row">
      <div class="price"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
      ${q ? `<div class="qty"><button data-dec="${p.id}">−</button><span>${q}</span><button data-inc="${p.id}">+</button></div>`
          : `<button class="add" data-inc="${p.id}" aria-label="${t("add")}">+</button>`}
    </div>
  </div>`;
}

function renderCats(){
  $("#catsGrid").innerHTML = CATS.map(c => {
    const n = P.filter(p => p.cat === c.id).length;
    return `<a href="#shop" class="cat" data-cat="${c.id}"><div class="ci">${c.icon}</div><b>${c[lang]}</b><small>${n} ${t("prods")}</small></a>`;
  }).join("");
  $("#chips").innerHTML = [`<button class="chip ${filter==="all"?"on":""}" data-chip="all">${t("all")}</button>`]
    .concat(CATS.map(c => `<button class="chip ${filter===c.id?"on":""}" data-chip="${c.id}">${c.icon} ${c[lang]}</button>`)).join("");
}

function renderRails(){
  $("#dealsRail").innerHTML = P.filter(p => p.tag === "deal" || p.old).map(card).join("");
  $("#bestRail").innerHTML = P.filter(p => p.tag === "best").map(card).join("");
}

function renderGrid(){
  const norm = s => s.toLowerCase().replace(/[ًٌٍَُِّْ]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي");
  let list = P.filter(p => (filter === "all" || p.cat === filter) &&
    (!query || norm(p.ar + " " + p.en + " " + catName(p.cat)).includes(norm(query))));
  if (sort === "low") list.sort((a,b) => a.price - b.price);
  if (sort === "high") list.sort((a,b) => b.price - a.price);
  if (sort === "name") list.sort((a,b) => a[lang].localeCompare(b[lang], lang));
  $("#productsGrid").innerHTML = list.map(card).join("");
  $("#emptyState").hidden = list.length > 0;
  $("#shopCount").textContent = `${list.length} ${t("items")}`;
}

function renderCart(){
  const ids = Object.keys(cart);
  const count = ids.reduce((s,id) => s + cart[id], 0);
  const total = ids.reduce((s,id) => s + cart[id] * P.find(p => p.id == id).price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartItems").innerHTML = ids.length ? ids.map(id => {
    const p = P.find(p => p.id == id);
    return `<div class="ci-row"><div class="ci-img">${p.icon}</div>
      <div class="ci-info"><b>${p[lang]}</b><small>${money(p.price * cart[id])}</small></div>
      <div class="qty"><button data-dec="${id}">−</button><span>${cart[id]}</span><button data-inc="${id}">+</button></div></div>`;
  }).join("") : `<div class="cart-empty"><span>🛒</span>${t("cartEmpty")}<br><br><a href="#shop" class="btn btn-gold" data-close>${t("startShop")}</a></div>`;
  const left = FREE_SHIP - total;
  $("#freeShip").innerHTML = (left > 0 ? t("freeLeft").replace("{x}", money(left)) : t("freeOk")) +
    `<div class="bar"><i style="width:${Math.min(100, total / FREE_SHIP * 100)}%"></i></div>`;
  $(".drawer-foot").style.display = ids.length ? "" : "none";
  localSet("cart", JSON.stringify(cart));
}

function renderAll(){ renderCats(); renderRails(); renderGrid(); renderCart(); }

function toast(msg){
  const el = $("#toast"); el.textContent = msg; el.classList.add("on");
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 1800);
}
function setQty(id, d){
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  if (d > 0) { toast(t("added")); const b = $("#cartCount"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  renderRails(); renderGrid(); renderCart();
  if (!$("#modal").hidden) openModal(id);
}
function openCart(o){ $("#drawer").classList.toggle("on", o); $("#overlay").classList.toggle("on", o); }
function openModal(id){
  const p = P.find(p => p.id == id), q = cart[id] || 0;
  $("#modalBody").innerHTML = `<div class="m-img">${p.icon}</div>
    <span class="m-cat">${catName(p.cat)} · ${p.unit[lang]}</span><h3>${p[lang]}</h3>
    <div class="m-price">${money(p.price)} ${p.old ? `<s style="font-size:1rem;color:#999">${money(p.old)}</s>` : ""}</div>
    ${q ? `<div class="qty" style="justify-content:center;padding:8px"><button data-dec="${id}">−</button><span>${q}</span><button data-inc="${id}">+</button></div>`
        : `<button class="btn btn-gold full" data-inc="${id}">${t("add")} 🛒</button>`}`;
  $("#modal").hidden = false;
}

// أحداث
document.addEventListener("click", e => {
  const el = e.target.closest("[data-inc],[data-dec],[data-open],[data-fav],[data-cat],[data-chip],[data-close]");
  if (!el) return;
  const d = el.dataset;
  if (d.inc) setQty(d.inc, 1);
  else if (d.dec) setQty(d.dec, -1);
  else if (d.open) openModal(d.open);
  else if (d.fav) { const id = +d.fav; favs.has(id) ? (favs.delete(id), toast(t("unfav"))) : (favs.add(id), toast(t("fav"))); localSet("favs", JSON.stringify([...favs])); renderRails(); renderGrid(); }
  else if (d.cat) { filter = d.cat; renderCats(); renderGrid(); $("#shop").scrollIntoView(); }
  else if (d.chip) { filter = d.chip; renderCats(); renderGrid(); }
  else if (d.close !== undefined) openCart(false);
});
$("#cartBtn").onclick = $("#bnCart").onclick = e => { e.preventDefault(); openCart(true); };
$("#closeCart").onclick = $("#overlay").onclick = () => openCart(false);
$("#modalX").onclick = () => $("#modal").hidden = true;
$("#modal").onclick = e => { if (e.target.id === "modal") $("#modal").hidden = true; };
$("#menuBtn").onclick = () => $("#nav").classList.toggle("on");
$$("#nav a").forEach(a => a.onclick = () => $("#nav").classList.remove("on"));
$("#langBtn").onclick = () => { lang = lang === "ar" ? "en" : "ar"; localSet("lang", lang); applyLang(); };
$("#searchInput").oninput = e => { query = e.target.value.trim(); filter = "all"; renderCats(); renderGrid(); if (query) $("#shop").scrollIntoView({behavior:"smooth"}); };
$("#sortSel").onchange = e => { sort = e.target.value; renderGrid(); };
$("#clearCart").onclick = () => { cart = {}; renderAll(); toast(t("cleared")); };
$("#newsForm").onsubmit = e => { e.preventDefault(); e.target.reset(); toast(t("subOk")); };
$("#checkoutBtn").onclick = () => {
  const lines = Object.keys(cart).map(id => { const p = P.find(p => p.id == id); return `• ${p[lang]} × ${cart[id]} = ${money(p.price * cart[id])}`; });
  const total = Object.keys(cart).reduce((s,id) => s + cart[id] * P.find(p => p.id == id).price, 0);
  const msg = `${t("orderHi")}\n${lines.join("\n")}\n${t("orderTotal")}: ${money(total)}`;
  window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
};
document.addEventListener("keydown", e => { if (e.key === "Escape") { $("#modal").hidden = true; openCart(false); } });

// عدّاد العروض: حتى نهاية يوم السبت القادم
function tick(){
  const now = new Date(), end = new Date(now);
  end.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7)); end.setHours(23,59,59,0);
  let s = Math.max(0, Math.floor((end - now) / 1000));
  $("#cdD").textContent = Math.floor(s / 86400); s %= 86400;
  $("#cdH").textContent = Math.floor(s / 3600); s %= 3600;
  $("#cdM").textContent = Math.floor(s / 60);
  $("#cdS").textContent = s % 60;
}
tick(); setInterval(tick, 1000);

applyLang();
})();
