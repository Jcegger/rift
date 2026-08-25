# rift-sync worker

Proxies a public riftbound.gg profile so the tracker can pull the collection
automatically.

## Why a proxy is needed

A public profile at `riftbound.gg/u/<name>/collection` is backed by:

```
POST https://api.dotgg.gg/cgfw/getuserdata?game=riftbound
{"username": "<name>"}
```

No auth, no token. It returns the whole collection: `standard` and `foil` counts
per printing, `trade` and `wish` counts, and the custom tags used to label cards.

The page still cannot call it directly. `api.dotgg.gg` sets
`Access-Control-Allow-Origin` only for `https://riftbound.gg`, and because it also
sets `Access-Control-Allow-Credentials: true` it can never use a wildcard, so the
browser drops the response for any other origin. CORS is enforced by browsers
rather than servers, which is why fetching the same URL from a Worker works.

Nothing secret is involved, because the profile is already public. If the profile
is set private, this stops working and the export-link route is the alternative
(`/cgfw/exportcollection?token=…`, minted under Settings > Collection).

## Deploy

```
cd worker
npx wrangler login
npx wrangler deploy
```

`DOTGG_USER` in `wrangler.toml` sets whose profile is read. Then take the printed
`https://rift-sync.<subdomain>.workers.dev` URL, open the tracker's
**Import** tab, paste it in, hit Save, and turn on "Pull on every load".

Check it first if you like. This should return JSON with a `collection` array:

```
curl -H "Origin: https://rift.jayegger.com" https://rift-sync.<subdomain>.workers.dev
```

## Notes

- Only origins in `ALLOW_ORIGIN` get a permissive CORS header.
- `?user=<name>` reads a different profile than the configured default, which is
  handy for looking at a trade partner's list.
- The payload passes through untouched, so a new upstream field needs no redeploy.
- Free tier covers this comfortably: one small request per page load.
