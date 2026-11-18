// Al-Haramain AI proxy (Cloudflare Worker, free plan).
//
// Why this exists: the website is public (GitHub Pages), so a Gemini key placed in
// the website's code would be visible to everyone. This Worker keeps the key on
// Cloudflare as a secret, and the website only talks to this Worker.
//
// Setup (done by the owner, not in this repo):
//   1. Create a Worker on Cloudflare and paste this file as its code.
//   2. In the Worker settings, add a SECRET variable named GEMINI_API_KEY with the key.
//      Never write the key in this file or in chat.
//   3. Optional plain variable GEMINI_MODEL (default below).
//   4. In Cloudflare's dashboard, add a rate limit rule for this Worker.
//
// Notes: the Origin check only stops ordinary browsers from other sites. It is not
// real authentication, so the rate limit in step 4 is still needed.

const ALLOWED_ORIGINS = ["https://www774475437-svg.github.io"];
const MAX_PROMPT_CHARS = 2000;
const MAX_IMAGE_CHARS = 2_000_000; // base64 text, roughly 1.5 MB image

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403, headers: cors });
    }
    if (!env.GEMINI_API_KEY) {
      return new Response("Server is not configured", { status: 500, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400, headers: cors });
    }

    const prompt = String(body.prompt || "").slice(0, MAX_PROMPT_CHARS);
    const image = body.image ? String(body.image) : null;
    if (!prompt && !image) {
      return new Response("Empty request", { status: 400, headers: cors });
    }
    if (image && image.length > MAX_IMAGE_CHARS) {
      return new Response("Image too large", { status: 413, headers: cors });
    }

    const parts = [{ text: prompt }];
    if (image) {
      parts.push({ inline_data: { mime_type: "image/jpeg", data: image } });
    }

    const model = env.GEMINI_MODEL || "gemini-2.0-flash";
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("");

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
