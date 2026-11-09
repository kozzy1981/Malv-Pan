# Malvern Panalytical product listing

A responsive Next.js assessment prototype using the original supplied product JSON
and independently implemented presentation based on the supplied screenshots.
It has a server-rendered initial listing and a small read-only API for interactions.
No CMS, database, authentication or separate backend is required.

## Features

- Products (46), Categories (36), Technologies (19) and Measurement Types (50).
- Search, category/technology filters, A-Z/Z-A sorting, reset and mobile filter disclosure.
- Context-aware native dropdowns: incompatible options stay visible but disabled;
  incompatible selections reset to All. Search does not restrict available options.
- Loading, empty and error states, retry and cancellation of superseded requests.
- Responsive cards, source-site links and optimised lazy product images.
- Accessibility targets WCAG 2.2 AA; automated scores are not a conformance claim.

Popularity sorting/badges are intentionally unavailable: the data has no confirmed
popularity metric. `productOrderNumber` is not silently interpreted as popularity.

## Prerequisites and local setup

Use Node.js **26.x** and npm to match the validated environment (Node 26.13.0,
npm 11.20.0). Next.js requires Node 20.9+, but the test runner's native TypeScript
support requires a newer Node release; Node 26 is the recommended common baseline.
Install dependencies from the checked-in npm lockfile:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Stop the server with Ctrl+C. No application environment
variables or credentials are required. Ensure Node/npm are on your terminal's PATH.
The optional `PRODUCT_API_URL` variable is only an integration-test server origin.

### Windows path-casing troubleshooting

Use the actual casing of the checkout directory when opening it in your editor or
terminal. Builds from a differently cased path reproduced null `useContext` errors
in both Turbopack and Webpack; the same builds passed from the canonical path.
Webpack identified duplicate module identities differing only in path casing,
despite a single installed React copy. No dependency change was needed.

If affected, stop other Next.js processes and switch to the canonical path:

```powershell
$canonicalProjectPath = node -p "require('node:fs').realpathSync.native(process.cwd())"
Set-Location ..
Set-Location -LiteralPath $canonicalProjectPath
node -p "process.cwd()"
npm run build
```

Do not use `--debug-prerender` output as a production deliverable. Do not run
concurrent builds or build while serving production output from the same `.next`.

## Commands and validation

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npx --no-install tsc --noEmit --incremental false` | TypeScript check without generated incremental state |
| `npm run lint` | ESLint; warnings fail the check |
| `npm test` | 31 unit tests; no server needed |
| `npm run build` | Normal Turbopack production build, including TypeScript |
| `npm start` | Serve a successful production build |
| `npm run test:api` | Four HTTP integration tests against localhost:3002 by default |

For integration testing, build and start a server in one terminal:

```powershell
npm run build
npm start -- --port 3002
```

In another terminal run `npm run test:api`. Set `PRODUCT_API_URL` to another local
origin if necessary. Stop the server after testing. ESLint and tests are separate
checks: a successful Next.js 16 build does not mean they ran.

The tests cover source/order preservation, combined filtering, case-insensitive
search/title matching, sorting, nullable taxonomy content, compatibility/reset,
empty results, invalid parameters, and actual HTTP status/JSON contracts.
[The sprint record](docs/Sprint.md) contains story-specific validation evidence.

## API

`GET /api/products` returns HTTP 200:

```json
{ "products": ["original source records"], "total": 46 }
```

The example array is schematic; actual elements are the unchanged source objects.
`total` is the matching count, not a pagination total. No parameters returns all
46 products in original order.

| Parameter | Behaviour |
| --- | --- |
| `mode` | `products` (default), `categories`, `technologies`, `measurementTypes` |
| `search` | Trimmed, case-insensitive substring of title or strapline; all modes |
| `category` | Trimmed, case-insensitive exact nested category title; Products only |
| `technology` | Trimmed, case-insensitive exact nested technology title; Products only |
| `sort` | Exactly `name-asc` or `name-desc`; omit for original source order |

Search/category/technology combine with AND. Taxonomy modes ignore product-only
filters and return their root collections using the same `products` response key.
Empty/whitespace search/category/technology values are absent. Unknown filter
values or unmatched searches return HTTP 200 with `{ "products": [], "total": 0 }`.
Invalid modes/sorts, including empty mode/sort values, return HTTP 400 with a clear
`{ "error": "..." }`. Unknown parameter names are ignored; repeats use the first value.
Sorting uses case-insensitive English collation, preserves equal-name order and
never mutates the source array. `sort=popular` remains invalid.

Examples:

- http://localhost:3000/api/products
- http://localhost:3000/api/products?search=ZETASIZER
- http://localhost:3000/api/products?category=Density%20analyzers
- http://localhost:3000/api/products?technology=Laser%20Diffraction&sort=name-asc
- http://localhost:3000/api/products?mode=measurementTypes&search=particle

## Architecture and data decisions

- `src/app/page.tsx` reads server-only accessors and supplies initial products and
  option titles. The listing is prerendered, then hydrated without a mount-time fetch.
- `src/components/` contains the header, hero, interactive listing and reusable cards.
  Select changes call the API; search submits on Search/Enter or the next select change.
- `src/app/api/products/route.ts` maps HTTP queries to pure listing logic, similar
  in responsibility to an ASP.NET Core endpoint.
- `src/lib/query-products.ts` handles collection selection, search/filter/sort and
  validation; `product-filter-options.ts` derives relationships from all source products.
- `src/data/products.ts` imports the original JSON and marks access as server-only;
  `src/types/` describes source data and the common presentation fields.
- `resources/` remains read-only reference material. The original IDs, Tridion IDs,
  null/empty values, root collections and nested relationships are preserved.

Category filtering uses titles because some nested IDs are empty/null. Options
include root and nested titles. Mode switching clears category/technology while
keeping search/sort; Reset clears search/filter/sort within the current mode.
Taxonomy controls disable product-only filters. Previous results remain visible
on loading/error, with status messages and retry rather than a false empty response.

Cards resolve supplied relative URLs against `https://www.malvernpanalytical.com`,
matching source metadata. Links open in the current tab. Missing URLs produce
non-linked cards; empty images use a placeholder; null descriptions are omitted.
No product detail URLs or pages are invented.

## Responsive design and accessibility

The grid uses one horizontal-card column below 640px, two columns at 640-1023px,
three at 1024-1279px and four from 1280px. Mobile controls stack; larger rows wrap.
Image regions remain fixed with `object-fit: contain`. Native select popups and
closed-value truncation depend on browser/OS: shorter unavailable suffixes and
wrapping selected-value summaries help without introducing custom dropdowns.

Semantic landmarks, heading/list structure, a skip link, native labelled controls,
44px form targets, visible focus and loading/empty/error announcements are provided.
Card links use their visible headings as accessible names. Redundant thumbnails
have empty alt text; the brand logo retains meaningful alternative text. Explicit
label associations were added to Display/Sort after manual WAVE feedback.

Developer-reported production audit results (not independently rerun by Codex):

| Audit | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop Lighthouse | 100 | 100 | 100 | 100 |
| Mobile Lighthouse | 98 | 100 | 100 | 100 |

WAVE reported zero accessibility/contrast errors, AIM 10/10 and three alerts.
Two Display/Sort label alerts prompted explicit associations; a subsequent WAVE
result was not supplied. The brand-home and breadcrumb-home duplication is retained
for its separate navigation contexts. Recheck the final deployed page; scores do
not replace keyboard, screen-reader, zoom or real-device review.

## Image performance

Product images use `next/image`, a restricted HTTPS remote allowlist, responsive
`sizes`, lazy loading and the default Next.js cache lifetime. Only the small logo
is prioritised. On Vercel, use its managed Next.js image optimisation/cache; there
is no custom filesystem cache or repository copy of the remote product assets.

Three original image samples were 7.3-26.5 MB; local production optimisation yielded
384px-wide WebP variants of 7.8-16.5 KB with MISS then HIT cache responses and a
30-day upstream lifetime. This is sampled evidence, not a guarantee for every asset.
Cold variants need access to `dam.malvernpanalytical.com` and an upstream fetch.

In Chrome Network, leave Disable cache unchecked, filter Img and inspect
`/_next/image` widths, sizes, bytes, browser memory/disk cache and `x-nextjs-cache`.
Scroll down/up and use Performance recordings to distinguish transfers from image
decoding/painting. Compare development/production with identical settings and
separate cold/warm caches. Cached network data does not guarantee decoded pixels
stay resident. Remote asset availability and hosted optimisation still need review.

## Manual Vercel deployment

Deployment is performed by the developer. No Vercel project or hosted preview was
created or verified by Codex. Standard Next.js configuration needs no `vercel.json`;
do not enable static export because the API and image optimiser require a runtime.
See [Vercel's Git deployment guide](https://vercel.com/docs/git).

1. Review the final files, then commit/push the intended state of `main` yourself.
   Include the lockfile, source JSON and logo; exclude dependencies, `.next`, local
   caches and secrets. If a Vercel project already imports this repository, a push
   may trigger deployment automatically: review its settings first.
2. In Vercel, open the existing project, or choose Add New > Project and import the
   existing GitHub repository under the intended account/team.
3. Select Next.js, repository root as Root Directory, npm, Install Command `npm ci`,
   Build Command `npm run build`, and the framework-default Output Directory.
4. Select Node.js 26.x in project settings to match local validation. Vercel currently
   supports it; see [supported versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
   No application environment variables, API keys or database settings are required.
   Do not set `NODE_ENV=development` or copy test-only `PRODUCT_API_URL` to production.
5. Confirm `main` as the intended production branch, deploy the reviewed revision
   (or redeploy the correct latest commit), and inspect install/build/runtime logs.
6. Open the deployment URL and perform the checklist below. Confirm image requests
   succeed through `/_next/image` and API filtering happens on the server.

No test/lint deployment gate is installed automatically. Run the checks above before
pushing; consider CI later. Account permissions, actual project settings, quotas,
remote image reachability and the deployed build have not been verified here.

## Delivery limitations and improvements

- Popularity semantics are unresolved. Ask for an authoritative ranking/badge mapping.
- The logo was cropped from supplied `resources/3.png`; Arial and a dark gradient
  approximate missing brand font/hero assets. Prefer official assets when available.
- Site-wide navigation/login/search are intentionally limited; the listing search works.
- Propose a design improvement: show a compact summary of applied filters with clear
  removal actions, helping keyboard/mobile users understand why results changed.
  This optional enhancement is not implemented; keep the supplied design primary.
- Production improvements: confirm data/branding contracts, validate future CMS input,
  add CI and browser/accessibility coverage, measure real-user performance, and
  document image availability/cost monitoring. No CMS/database architecture is needed
  for the exercise.
- Initial dependency audit reported eight moderate findings through minimatch in
  development lint tooling. No fresh registry audit was run for final delivery;
  review compatible upstream fixes separately. ESLint 9 has a recorded end-of-support
  warning; its installed React lint plugin supports that major. Do not apply a forced
  audit fix or dependency-major change without review.

## AI use and time recording

ChatGPT was used for planning, story breakdown and review. Codex assisted with
implementation, tests, investigation and documentation. The developer manually
reviewed, tested and accepted ST-01 through ST-07 and owns Git and deployment.
The developer should be prepared to explain and modify the submitted code.

The assessment suggests approximately 2-4 hours. Recorded time through ST-07 is
**4 hours 25 minutes**: 60 minutes planning/preparation and 205 minutes for
ST-01-ST-07 implementation, troubleshooting, manual verification, testing and
review, including AI-assisted work. ST-08 time is pending, so no final total is
reported. See [the sprint record](docs/Sprint.md). ST-08 awaits final review and
manual deployment.

## Final manual acceptance

- Confirm the deployed revision, HTTPS URL, install/build logs and runtime settings.
- Check default counts 46/36/19/50, combined filters, name sorts, reset and source links.
- Verify compatibility/disabled options, loading, no matches, API errors and retry.
- Inspect 375/768/1024/1440px, enlarged text and native dropdowns on a real device.
- Check keyboard/skip/focus, screen-reader announcements, WAVE and production Lighthouse.
- Verify cold/warm optimised images and API responses; record hosted limitations.
- Add the deployment URL and recorded ST-08 time, then update the final total.
