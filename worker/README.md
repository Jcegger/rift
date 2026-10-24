# rift-sync worker

Proxies two public collection sources so the tracker can read them:

- **`GET /piltover`**: Jay's Piltover Archive collection. The tracker pulls this on every
  load; Piltover is the source of truth since 24 Oct 2026.
- **`GET /?user=<name>`**: a public riftbound.gg profile. The trade checker reads a
  partner's this way; with no `?user=` it reads `DOTGG_USER`.

## Piltover Archive

A public Piltover collection is two calls on the site's own API proxy, the same ones its
profile pages make, with no auth:

```
GET https://piltoverarchive.com/api/external/v1/collection/users/<clerk id>/ownership
GET https://piltoverarchive.com/api/external/v1/collection/users/<clerk id>/search?limit=100&page=N
```

`ownership` maps Piltover's variant ids to a count; `search` pages through the same
variants (100 at most a page) with their printed numbers (`OGN-001`, `OGN-076a`). The
worker joins them into `{ source: "piltover", collection: [{ card, standard }] }`, caches
that for 60 seconds, and refuses to send a list with any owned id it couldn't name.

- **It takes the Clerk user id** (`user_…`), not the username: the username answers
  `403 COLLECTION_PRIVATE` even when the collection is public. The id is the `authorId` on
  the user's decks at `/api/external/v1/profiles/<username>`.
- **One count per printing.** Piltover's public data has no normal/foil split.
- **A private collection** comes back `403 {"error":"COLLECTION_PRIVATE"}`, which the
  worker passes on as the error text.
- **No CORS header at all** on Piltover's responses, which is why the page can't call it.

## riftbound.gg

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

## Deploy

```
cd worker
npx wrangler@3 login
npx wrangler@3 deploy
```

Pinned to wrangler 3 on purpose: wrangler 4 needs Node 20 and this machine runs
Node 18, where it exits on a version check before doing anything.

`PILTOVER_USER` and `DOTGG_USER` in `wrangler.toml` set whose collections are read. The
tracker's default worker URL is `https://rift-sync.jcegger.workers.dev`; a different one goes
under Collection → Import → "Where it pulls from" (the bare URL: the pull adds `/piltover`).

Check it first if you like. Each should return JSON with a `collection` array:

```
curl -H "Origin: https://rift.jayegger.com" https://rift-sync.jcegger.workers.dev/piltover
curl -H "Origin: https://rift.jayegger.com" https://rift-sync.jcegger.workers.dev
```

## Notes

- Only origins in `ALLOW_ORIGIN` get a permissive CORS header.
- On the riftbound.gg route, `?user=<name>` reads a different profile than the configured
  default, which is how the trade checker reads a partner's list. That payload passes
  through untouched, so a new upstream field needs no redeploy.
- Free tier covers this comfortably: a pull is about a dozen small upstream requests, at
  most once a minute.
