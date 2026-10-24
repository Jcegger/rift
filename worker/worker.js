/**
 * rift-sync: a small proxy in front of two public collection sources.
 *
 *   GET /piltover  Jay's Piltover Archive collection, the source the tracker pulls.
 *   GET /?user=X   a public riftbound.gg profile, which the trade checker reads.
 *
 * Why this exists. Both sources serve public data with no auth, and neither can be
 * read from rift.jayegger.com directly. Piltover Archive sends no CORS header at all.
 * riftbound.gg's api.dotgg.gg echoes Access-Control-Allow-Origin only for riftbound.gg
 * and sets Allow-Credentials: true, so it can never wildcard. CORS is a browser rule
 * rather than a server one, so a fetch from here works fine.
 *
 * No secret needed: both collections are already public. Set PILTOVER_USER (the
 * Clerk id, user_…) and DOTGG_USER, then deploy.
 */

/* ── Piltover Archive ─────────────────────────────────────────────────────── */
// A public collection is two calls on piltoverarchive.com's own API proxy, the same
// ones its profile pages make. `ownership` maps Piltover's variant ids to a count (one
// total per printing: no normal/foil split). `search` pages through the same variants
// with their printed numbers (OGN-001, OGN-076a), at most 100 a page. Joined here,
// so the tracker gets one compact list and Piltover gets one pull's worth of requests
// per cache window, not one per page load.
const PILTOVER = "https://piltoverarchive.com/api/external/v1/collection/users";
const PILTOVER_TTL = 60;   // seconds, the same window Piltover caches ownership for
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function piltoverJSON(url) {
  const r = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": BROWSER_UA } });
  const text = await r.text();
  if (!r.ok) {
    // A private collection is 403 {"error":"COLLECTION_PRIVATE","message":"This collection is private"}.
    let msg = text.slice(0, 300);
    try { msg = JSON.parse(text).message || msg; } catch { /* keep the raw text */ }
    throw Object.assign(new Error(`Piltover Archive: ${msg || `HTTP ${r.status}`}`), { status: r.status });
  }
  return JSON.parse(text);
}

async function readPiltover(user) {
  const base = `${PILTOVER}/${encodeURIComponent(user)}`;
  const owned = await piltoverJSON(`${base}/ownership`);
  const numbers = new Map();
  for (let page = 1; page <= 50; page++) {
    const d = await piltoverJSON(`${base}/search?limit=100&page=${page}`);
    for (const v of d.data || []) numbers.set(v.id, v.variantNumber);
    if (!d.pagination || !d.pagination.hasNext) break;
  }
  const collection = [];
  let unnamed = 0;
  for (const [id, qty] of Object.entries(owned)) {
    const card = numbers.get(id);
    if (card) collection.push({ card, standard: qty });
    else unnamed++;
  }
  // Every owned id should come back from search. If some don't, the join is broken and
  // a pull would read those cards as sold, so refuse rather than pass on a short list.
  if (unnamed) throw Object.assign(new Error(`Piltover Archive: ${unnamed} owned printings came back without a card number. Nothing was sent.`), { status: 502 });
  return { source: "piltover", user, at: new Date().toISOString(), collection };
}

async function servePiltover(request, env, ctx, headers) {
  const user = env.PILTOVER_USER;
  if (!user) return new Response("No Piltover user configured. Set PILTOVER_USER.", { status: 400, headers });
  const cache = caches.default;
  const key = new Request(`https://rift-sync.cache/piltover/${encodeURIComponent(user)}`);
  let body;
  const hit = await cache.match(key);
  if (hit) body = await hit.text();
  else {
    try { body = JSON.stringify(await readPiltover(user)); }
    catch (e) {
      return new Response(e.message, { status: e.status || 502, headers: { ...headers, "Content-Type": "text/plain" } });
    }
    ctx.waitUntil(cache.put(key, new Response(body, { headers: { "Cache-Control": `max-age=${PILTOVER_TTL}` } })));
  }
  return new Response(body, { status: 200, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
}

/* ── riftbound.gg ─────────────────────────────────────────────────────────── */
const UPSTREAM = "https://api.dotgg.gg/cgfw/getuserdata";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Vary": "Origin",
  "Cache-Control": "no-store",
});

export default {
  async fetch(request, env, ctx) {
    const allowed = (env.ALLOW_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    // Echo the origin only when it is one of ours.
    const allowOrigin = allowed.includes(origin) ? origin : allowed[0] || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...cors(allowOrigin), "Access-Control-Allow-Methods": "GET,OPTIONS" },
      });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers: cors(allowOrigin) });
    }

    if (new URL(request.url).pathname.replace(/\/+$/, "") === "/piltover")
      return servePiltover(request, env, ctx, cors(allowOrigin));

    // ?user= overrides the configured default, so one deploy can read any profile.
    const asked = new URL(request.url).searchParams.get("user");
    const user = (asked && /^[A-Za-z0-9_.\-]{1,40}$/.test(asked) ? asked : null)
      || env.DOTGG_USER;
    if (!user) {
      return new Response("No username configured. Set DOTGG_USER, or pass ?user=<name>.", {
        status: 400, headers: cors(allowOrigin),
      });
    }

    const url = `${UPSTREAM}?game=${encodeURIComponent(env.DOTGG_GAME || "riftbound")}`;
    let upstream;
    try {
      upstream = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "rift.jayegger.com sync",
          // Their API only answers CORS for its own site; send it as the origin so
          // nothing about this request looks unusual to them.
          "Origin": "https://riftbound.gg",
        },
        body: JSON.stringify({ username: user }),
      });
    } catch {
      return new Response("Could not reach api.dotgg.gg.", { status: 502, headers: cors(allowOrigin) });
    }

    const body = await upstream.text();
    if (!upstream.ok) {
      return new Response(body.slice(0, 500) || `Upstream returned ${upstream.status}.`, {
        status: upstream.status, headers: { ...cors(allowOrigin), "Content-Type": "text/plain" },
      });
    }

    // Pass the payload through untouched. The tracker reads .collection and ignores
    // the rest, and keeping it whole means a new upstream field needs no redeploy.
    return new Response(body, {
      status: 200,
      headers: { ...cors(allowOrigin), "Content-Type": "application/json; charset=utf-8" },
    });
  },
};
