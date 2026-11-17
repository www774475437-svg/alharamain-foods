// ═══════════════════════════════════════════════════════════════
//  الحسابات والإدارة — تسجيل الدخول، المدراء، توفر المنتجات، الإعلانات
//  Accounts & admin: sign-in, branch managers, product availability, ads
// ═══════════════════════════════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { FIREBASE_CONFIG } from "./firebase-config.js";

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);
const BRANCH_IDS = ["campau", "caniff", "farmington", "12mile"];
const BRANCH_NAMES = Object.fromEntries((window.BRANCHES || []).map(b => [b.id, b.ar]));

let user = null;      // المستخدم الحالي
let staff = null;     // { role: "owner"|"manager", branch? } أو null
let staffList = [];   // قائمة المدراء (للمالك فقط)
let adminReady = false;
let actingBranch = null;   // فرع يديره المالك من لوحته
const curBranch = () => (staff && staff.role === "owner") ? (actingBranch || "campau") : (staff && staff.branch);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const enc = k => encodeURIComponent(k);
const refreshApp = () => { if (window.HR_REFRESH) window.HR_REFRESH(); };

/* ── توفر المنتجات لكل فرع (يقرأها الموقع للجميع) ── */
const outCache = new Map();   // branchId -> Set(productKey)
const subs = new Set();
function subscribeOut(bid){
  if (subs.has(bid)) return;
  subs.add(bid);
  onSnapshot(collection(db, "branches", bid, "availability"), snap => {
    const set = new Set();
    snap.forEach(d => { if (d.data().out) set.add(decodeURIComponent(d.id)); });
    outCache.set(bid, set);
    refreshApp();
  }, err => console.warn("availability", err.message));
}
window.HR_OUT = bid => { subscribeOut(bid); return outCache.get(bid) || new Set(); };

/* ── الإعلانات (تُعرض لاحقاً في الصفحة الرئيسية) ── */
const adsCache = new Map();
function subscribeAds(bid){
  if (adsCache.has(bid)) return;
  adsCache.set(bid, []);
  onSnapshot(collection(db, "branches", bid, "ads"), snap => {
    const list = []; snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    adsCache.set(bid, list); refreshApp();
  }, err => console.warn("ads", err.message));
}
window.HR_ADS = bid => { subscribeAds(bid); return adsCache.get(bid) || []; };

/* ── الدخول والصلاحيات ── */
async function loadStaff(){
  staff = null;
  if (!user || !user.email) return;
  const email = user.email.toLowerCase();
  const snap = await getDoc(doc(db, "staff", email));
  staff = snap.exists() ? snap.data() : null;
  if (staff && staff.role === "owner") {
    onSnapshot(collection(db, "staff"), s => { staffList = []; s.forEach(d => staffList.push({ id: d.id, ...d.data() })); renderIfOpen(); });
  }
}
onAuthStateChanged(auth, async u => {
  user = u;
  await loadStaff();
  adminReady = true;
  renderIfOpen();
});

function renderIfOpen(){
  if (location.hash.startsWith("#/acc")) {
    const el = document.querySelector("#view");
    if (el) el.innerHTML = view();
  }
}

/* ── الواجهة ── */
function view(){
  if (!adminReady) return `<div class="page-h"><h1>👤 حسابي</h1></div><p>جارٍ التحميل…</p>`;
  if (!user) return loginView();
  if (!user.emailVerified && user.providerData.some(p => p.providerId === "password")) return verifyView();
  if (!staff) return `<div class="page-h"><h1>👤 حسابي</h1></div>
    <p>${esc(user.email)}</p>
    <p>هذا الحساب ليس لمدير أو مالك. اطلب من مالك التطبيق إضافة بريدك.</p>
    <button class="big alt" data-ad="signout">تسجيل الخروج</button>`;
  if (staff.role === "owner") return ownerView();
  return toolsView();
}

function loginView(){
  return `<div class="page-h"><h1>👤 تسجيل الدخول</h1></div>
    <form class="ad-form" data-form="login">
      <input type="email" name="email" placeholder="البريد الإلكتروني" required dir="ltr">
      <input type="password" name="password" placeholder="كلمة المرور" required dir="ltr">
      <button class="big" type="submit">دخول</button>
    </form>
    <button class="big alt" data-ad="google">الدخول بحساب Google</button>
    <form class="ad-form" data-form="signup">
      <p><small>إنشاء حساب جديد (يحتاج تأكيد البريد):</small></p>
      <input type="email" name="email" placeholder="البريد الإلكتروني" required dir="ltr">
      <input type="password" name="password" placeholder="كلمة مرور (6 أحرف على الأقل)" minlength="6" required dir="ltr">
      <button class="big alt" type="submit">إنشاء حساب</button>
    </form>
    <p id="authMsg" class="auth-msg"></p>`;
}

function verifyView(){
  return `<div class="page-h"><h1>📧 تأكيد البريد</h1></div>
    <p>أرسلنا رابط تأكيد إلى ${esc(user.email)}. افتحه ثم أعد تحميل الصفحة.</p>
    <button class="big" data-ad="resend">إعادة إرسال الرابط</button>
    <button class="big alt" data-ad="signout">تسجيل الخروج</button>`;
}

function toolsView(){
  const b = curBranch();
  const picker = staff.role === "owner" ? `<label>الفرع: <select id="branchPick">${BRANCH_IDS.map(x => `<option value="${x}" ${x===b?"selected":""}>${esc(BRANCH_NAMES[x])}</option>`).join("")}</select></label>` : "";
  const products = (window.HR_ALL ? window.HR_ALL() : []).slice(0, 2000);
  const out = window.HR_OUT(b);
  const ads = window.HR_ADS(b);
  return `<div class="page-h"><h1>🏪 ${esc(BRANCH_NAMES[b] || b)}</h1></div>${picker}
    <h2>نشر إعلان</h2>
    <form class="ad-form" data-form="ad">
      <input name="title" placeholder="عنوان الإعلان" required>
      <textarea name="text" placeholder="نص الإعلان" rows="3"></textarea>
      <button class="big" type="submit">نشر</button>
    </form>
    ${ads.length ? `<h3>الإعلانات الحالية</h3>` + ads.map(a => `<div class="ad-row"><b>${esc(a.title)}</b> <small>${esc(a.text || "")}</small>
      <button data-ad="delad" data-id="${esc(a.id)}">حذف</button></div>`).join("") : ""}
    <h2>توفر المنتجات</h2>
    <input class="ad-search" id="avSearch" placeholder="ابحث عن منتج..." oninput="window.HR_AV_FILTER(this.value)">
    <div id="avList">${productRows(products, out, "")}</div>
    <button class="big alt" data-ad="signout">تسجيل الخروج</button>`;
}

function productRows(products, out, q){
  const term = (q || "").trim().toLowerCase();
  const list = (term ? products.filter(p => p.name.toLowerCase().includes(term)) : products).slice(0, 60);
  return list.map(p => {
    const isOut = out.has(p.k);
    return `<div class="av-row"><span>${esc(p.name)}</span>
      <button data-ad="toggle" data-k="${esc(p.k)}" class="${isOut ? "no" : "yes"}">${isOut ? "غير متوفر" : "متوفر"}</button></div>`;
  }).join("");
}
window.HR_AV_FILTER = q => {
  if (!staff) return;
  const products = (window.HR_ALL ? window.HR_ALL() : []);
  document.querySelector("#avList").innerHTML = productRows(products, window.HR_OUT(curBranch()), q);
};

function ownerView(){
  const rows = staffList.map(s => `<div class="ad-row"><b dir="ltr">${esc(s.id)}</b>
      <small>${s.role === "owner" ? "مالك" : "مدير: " + esc(BRANCH_NAMES[s.branch] || s.branch || "")}</small>
      <button data-ad="removestaff" data-id="${esc(s.id)}">حذف</button></div>`).join("");
  return `<div class="page-h"><h1>🛠 لوحة المالك</h1></div>
    <h2>إضافة مدير</h2>
    <form class="ad-form" data-form="staff">
      <input type="email" name="email" placeholder="بريد المدير" required dir="ltr">
      <select name="branch">${BRANCH_IDS.map(b => `<option value="${b}">${esc(BRANCH_NAMES[b])}</option>`).join("")}</select>
      <button class="big" type="submit">إضافة</button>
    </form>
    <h2>المدراء</h2>${rows || "<p>لا يوجد مدراء بعد.</p>"}
    <h2>إدارة الفروع</h2>${toolsView()}
    <button class="big alt" data-ad="signout">تسجيل الخروج</button>`;
}

/* ── الأحداث ── */
const msg = t => { const el = document.querySelector("#authMsg"); if (el) el.textContent = t; };
const fail = e => msg(e && e.code ? e.code.replace("auth/", "").replace(/-/g, " ") : (e.message || "خطأ"));

document.addEventListener("submit", async e => {
  const f = e.target.closest("[data-form]"); if (!f) return;
  e.preventDefault();
  const fd = new FormData(f), kind = f.dataset.form;
  try {
    if (kind === "login") await signInWithEmailAndPassword(auth, fd.get("email").trim(), fd.get("password"));
    else if (kind === "signup") {
      const c = await createUserWithEmailAndPassword(auth, fd.get("email").trim(), fd.get("password"));
      await sendEmailVerification(c.user);
    }
    else if (kind === "staff") {
      const email = fd.get("email").trim().toLowerCase();
      await setDoc(doc(db, "staff", email), { role: "manager", branch: fd.get("branch") });
      f.reset();
    }
    else if (kind === "ad") {
      await addDoc(collection(db, "branches", curBranch(), "ads"), {
        title: fd.get("title").trim(), text: fd.get("text").trim(), by: user.email, at: serverTimestamp()
      });
      f.reset();
    }
  } catch (err) { fail(err); }
});

document.addEventListener("click", async e => {
  const btn = e.target.closest("[data-ad]"); if (!btn) return;
  const a = btn.dataset.ad;
  try {
    if (a === "google") await signInWithPopup(auth, new GoogleAuthProvider());
    else if (a === "signout") await signOut(auth);
    else if (a === "resend" && user) await sendEmailVerification(user);
    else if (a === "toggle" && staff) {
      const ref = doc(db, "branches", curBranch(), "availability", enc(btn.dataset.k));
      const isOut = btn.classList.contains("no");
      if (isOut) await deleteDoc(ref);
      else await setDoc(ref, { out: true, by: user.email, at: serverTimestamp() });
    }
    else if (a === "delad" && staff) await deleteDoc(doc(db, "branches", curBranch(), "ads", btn.dataset.id));
    else if (a === "removestaff" && staff && staff.role === "owner") await deleteDoc(doc(db, "staff", btn.dataset.id));
  } catch (err) { fail(err); }
});

document.addEventListener("change", e => {
  if (e.target.id === "branchPick") { actingBranch = e.target.value; renderIfOpen(); }
});

window.HR_ADMIN = { view };
