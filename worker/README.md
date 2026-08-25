# riftbound-sync worker

Proxies riftbound.gg's collection export so the tracker can pull it automatically.

## Why a proxy is needed

riftbound.gg has an official **permanent export link**: a URL that always returns
your current collection as CSV, which you mint and rotate under
**Settings > Collection**. It looks like this:

```
https://api.dotgg.gg/cgfw/exportcollection?game=riftbound&token=<your token>
```

The page cannot fetch that directly. `api.dotgg.gg` sets
`Access-Control-Allow-Origin` only for `https://riftbound.gg`, and because it
also sets `Access-Control-Allow-Credentials: true` it can never use a wildcard,
so the browser drops the response for any other origin. CORS is enforced by
browsers rather than servers, so fetching the same URL from a Worker works.

The proxy earns its place twice over: it fixes CORS, and it keeps the token out
of a public page. Without it the token would sit in `index.html` where anyone
could read the collection.

## Deploy

```
cd worker
npx wrangler login
npx wrangler secret put DOTGG_TOKEN     # paste the token from the export link
npx wrangler deploy
```

Then take the printed `https://riftbound-sync.<subdomain>.workers.dev` URL, open
the tracker's **Import** tab, paste it into the automatic pull field, hit Save,
and turn on "Pull on every load".

Check it first if you like. This should return CSV:

```
curl -H "Origin: https://riftbound.jayegger.com" https://riftbound-sync.<subdomain>.workers.dev
```

## Notes

- Only origins in `ALLOW_ORIGIN` (see `wrangler.toml`) get a permissive CORS
  header, so a random page cannot read your collection through it.
- `?binder_id=N` proxies through, if you want one binder rather than everything.
- Rotating the token on riftbound.gg breaks the Worker until you re-run
  `wrangler secret put DOTGG_TOKEN`. Their endpoint says so plainly when it
  happens, and that message is passed through to the Import tab.
- Free tier covers this comfortably: one small request per page load.
