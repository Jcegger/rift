/**
 * riftbound-sync: a one-endpoint proxy in front of riftbound.gg's public profile data.
 *
 * Why this exists. A public riftbound.gg profile (riftbound.gg/u/<name>/collection)
 * is backed by api.dotgg.gg/cgfw/getuserdata, which needs no auth and returns the
 * whole collection: standard and foil counts, trade and wishlist counts, and the
 * custom tags. The page at riftbound.jayegger.com still cannot call it directly,
 * because that host echoes Access-Control-Allow-Origin only for riftbound.gg and
 * sets Allow-Credentials: true, so it can never wildcard and the browser drops the
 * response. CORS is a browser rule rather than a server one, so a fetch from here
 * works fine.
 *
 * No secret needed: the profile is already public. Set DOTGG_USER and deploy.
 */

const UPSTREAM = "https://api.dotgg.gg/cgfw/getuserdata";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Vary": "Origin",
  "Cache-Control": "no-store",
});

export default {
  async fetch(request, env) {
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
          "User-Agent": "riftbound.jayegger.com sync",
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
