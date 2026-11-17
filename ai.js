// ═══════════════════════════════════════════════════════════════
//  المساعد الذكي — Gemini عبر Firebase AI Logic (الخطة المجانية)
// ═══════════════════════════════════════════════════════════════
import { initializeApp } from "https://esm.sh/firebase@12/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://esm.sh/firebase@12/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://esm.sh/firebase@12/ai";
import { FIREBASE_CONFIG, RECAPTCHA_SITE_KEY } from "./firebase-config.js";

const MODEL = "gemini-2.5-flash";
const DAILY_LIMIT = 15;   // حد يومي لكل جهاز لحماية الحصة المجانية

const app = initializeApp(FIREBASE_CONFIG, "ai-assistant");
if (RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, { provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });
}
const ai = getAI(app, { backend: new GoogleAIBackend() });

const SYSTEM = `You are the assistant of Al-Haramain International Foods, a grocery chain with 4 stores in Michigan: two in Hamtramck, one in Farmington and one in Farmington Hills.
Help customers with grocery shopping questions, food products and simple cooking ideas.
Reply briefly in the same language the customer writes in.
Never invent prices, opening hours, delivery options or stock levels. If you do not know, say so and suggest calling the store listed on the stores page.
Do not answer questions unrelated to groceries, cooking or the stores.`;

const usedToday = () => {
  try {
    const v = JSON.parse(localStorage.getItem("hr_ai") || "{}");
    return v.d === new Date().toISOString().slice(0, 10) ? v.n : 0;
  } catch (e) { return 0; }
};
const bump = () => {
  try { localStorage.setItem("hr_ai", JSON.stringify({ d: new Date().toISOString().slice(0, 10), n: usedToday() + 1 })); } catch (e) {}
};

document.addEventListener("submit", async e => {
  const f = e.target.closest('[data-form="ai"]'); if (!f) return;
  e.preventDefault();
  const out = document.querySelector("#aiOut");
  const q = String(new FormData(f).get("q") || "").trim();
  if (!q) return;
  if (usedToday() >= DAILY_LIMIT) { out.textContent = "وصلت إلى الحد اليومي للأسئلة. حاول غداً."; return; }
  out.textContent = "…";
  try {
    const model = getGenerativeModel(ai, { model: MODEL, systemInstruction: SYSTEM });
    const res = await model.generateContent(q);
    bump();
    out.textContent = res.response.text() || "لم أستطع الرد، حاول بصيغة أخرى.";
  } catch (err) {
    console.warn("ai", err && err.message);
    out.textContent = "تعذر الرد الآن، حاول لاحقاً أو اتصل بالفرع.";
  }
});

window.HR_AI = {
  view: () => `<div class="page-h"><h1>🤖 المساعد الذكي</h1></div>
    <p><small>يجيب عن التسوق والأطعمة والطبخ. لا يعرف الأسعار أو مواعيد العمل المحدثة، فاتصل بالفرع للتأكد.</small></p>
    <form class="ad-form" data-form="ai">
      <textarea name="q" rows="3" maxlength="500" required placeholder="اكتب سؤالك هنا..."></textarea>
      <button class="big" type="submit">إرسال</button>
    </form>
    <div id="aiOut" class="ai-out"></div>`
};
