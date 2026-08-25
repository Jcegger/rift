/**
 * riftbound-sync: a one-endpoint proxy in front of riftbound.gg's collection export.
 *
 * Why this exists. riftbound.gg mints a "permanent export link" under
 * Settings > Collection, a URL that always returns your current collection as
 * CSV. The page at riftbound.jayegger.com cannot fetch it directly, because
 * api.dotgg.gg echoes Access-Control-Allow-Origin only for its own origin, so
 * the browser blocks the response. CORS is a browser rule, not a server one, so
 * a fetch from here works fine.
 *
 * It also keeps the token out of a public page. The token lives as a Worker
 * secret, and anyone hitting this URL gets the card list without ever seeing it.
 * Rotate it on riftbound.gg at any time and update the secret.
 */

const UPSTREAM = "https://api.dotgg.gg/cgfw/exportcollection";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Vary": "Origin",
  "Cache-Control": "no-store",
});

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOW_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    // Echo the origin only when it is one of ours, so this cannot be read by any page.
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
    if (!env.DOTGG_TOKEN) {
      return new Response("Worker is missing its DOTGG_TOKEN secret.", {
        status: 500, headers: cors(allowOrigin),
      });
    }

    const url = new URL(UPSTREAM);
    url.searchParams.set("game", env.DOTGG_GAME || "riftbound");
    url.searchParams.set("token", env.DOTGG_TOKEN);
    // Optional: a specific binder rather than the whole collection.
    const binder = new URL(request.url).searchParams.get("binder_id");
    if (binder && /^\d+$/.test(binder)) url.searchParams.set("binder_id", binder);

    let upstream;
    try {
      upstream = await fetch(url, { headers: { "User-Agent": "riftbound.jayegger.com sync" } });
    } catch (e) {
      return new Response("Could not reach api.dotgg.gg.", { status: 502, headers: cors(allowOrigin) });
    }

    const body = await upstream.text();
    if (!upstream.ok) {
      // Pass their message through; it says useful things like "link revoked".
      // Never echo the URL, which carries the token.
      return new Response(body.slice(0, 500) || `Upstream returned ${upstream.status}.`, {
        status: upstream.status, headers: { ...cors(allowOrigin), "Content-Type": "text/plain" },
      });
    }
    return new Response(body, {
      status: 200,
      headers: { ...cors(allowOrigin), "Content-Type": "text/csv; charset=utf-8" },
    });
  },
};
