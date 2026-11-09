# Malvern Panalytical product listing

I built this responsive Next.js product listing and read-only API for the Malvern
Panalytical developer assessment. It uses the supplied JSON and an independently
implemented presentation based on the supplied designs. This is a technical
assessment prototype, not an official or commercially production-ready website.

**[Live demonstration](https://ryanh-mp-assessment.vercel.app)**
**[Source repository](https://github.com/kozzy1981/Malv-Pan)**

## Features

- Four display modes: 46 products, 36 categories, 19 technologies and 50 measurement types.
- Search, category/technology filtering, alphabetical sorting, reset and mobile filters.
- Context-aware filter options: incompatible choices remain visible but disabled;
  changing a filter clears an incompatible opposite selection. All stays available.
- Loading, empty/error states, retry and cancellation of superseded requests.
- Responsive cards, keyboard-accessible controls and optimised lazy-loaded images.

Popularity sorting is **not implemented**; the control remains unavailable rather
than presenting an invented ranking.

## Local setup and testing

Use npm and a Node version appropriate to the commands you run. Next.js's framework
minimum is Node **20.9**; the native TypeScript test workflow needs a newer release
(Node **22.18+** on the 22.x line, or **24+**). I validated the project using
**Node 26.13.0 and npm 11.20.0**, rather than testing every compatible version.

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. No application environment variables or credentials
are required. Use Ctrl+C to stop the server.

| Command | Purpose |
| --- | --- |
| `npx --no-install tsc --noEmit --incremental false` | TypeScript validation |
| `npm run lint` | ESLint; warnings fail the check |
| `npm test` | 31 unit tests; no server required |
| `npm run build` | Production build, including TypeScript |
| `npm start` | Serve an existing production build on port 3000 |
| `npm run test:api` | Four HTTP integration tests; requires a running server |

To run API tests, start production on port 3002 in one terminal:

```powershell
npm run build
npm start -- --port 3002
```

Then run `npm run test:api` in another terminal. Optional `PRODUCT_API_URL` overrides
the test origin; its default is `http://localhost:3002`. Stop the server afterwards.
Linting and tests run separately from the production build. Previous validation
passed TypeScript, ESLint, all 31 unit tests, all four API tests and the build.

## API usage

`GET /api/products` returns `{ products, total }`, where `products` contains the
original matching records and `total` is their count. Without parameters it returns
all 46 products in source order, which is distinct from alphabetical sorting.

### Query parameters

| Parameter | Behaviour |
| --- | --- |
| `mode` | `products` (default), `categories`, `technologies`, `measurementTypes` |
| `search` | Trimmed, case-insensitive substring of title or strapline; all modes |
| `category` | Trimmed, case-insensitive exact nested category title; Products only |
| `technology` | Trimmed, case-insensitive exact nested technology title; Products only |
| `sort` | Exactly `name-asc` or `name-desc`; omit to retain source order |

### Example requests

Append these paths to either `http://localhost:3000` or
`https://ryanh-mp-assessment.vercel.app`:

| Example path | Demonstrates |
| --- | --- |
| `/api/products` | All 46 products in original source order |
| `/api/products?search=ZETASIZER` | Case-insensitive search of product titles and straplines |
| `/api/products?category=Density%20analyzers&sort=name-asc` | Category filtering combined with alphabetical sorting |
| `/api/products?category=Particle%20size%20analyzers&technology=Laser%20Diffraction` | Products matching both category and technology |
| `/api/products?mode=measurementTypes&search=particle` | Searching the measurement-type collection |

### Validation and error handling

Search, category and technology filters combine with AND semantics: a product must
match every supplied criterion. Taxonomy modes ignore product-only filters and
return their root records under the same `products` response key.

Empty or whitespace-only search, category and technology values are treated as
absent. Unknown filter titles or unmatched searches are valid requests and return
HTTP 200 with `{ "products": [], "total": 0 }`.

Invalid modes or sorts, including empty mode/sort values, return HTTP 400 with a
JSON error such as `{ "error": "Invalid mode. Use products, categories, technologies or measurementTypes." }`.
Unknown parameter names are ignored; repeated parameters use their first value.

Name sorting uses case-insensitive English collation, retains the source order of
equal names and never mutates the dataset. Omitting `sort` preserves original
source order; `sort=popular` is deliberately rejected because popularity sorting
is not available.

## Architecture and technical decisions

I used Next.js App Router, React and TypeScript, with Tailwind CSS imported through
PostCSS and custom CSS providing the component styling.
The initial listing is server-rendered and hydrated without an initial API fetch.
Select changes call the API; search applies on Search/Enter or the next selection
change, avoiding a request on every keystroke.

- `src/data/products.ts` provides server-only access to the original JSON.
- `src/types/` describes source records and shared presentation fields.
- `src/lib/` keeps query validation/filtering/sorting and filter compatibility separate.
- `src/app/api/products/route.ts` maps HTTP requests to that logic.
- `src/components/` contains the header, hero, interactive listing and reusable cards.

I preserved the original JSON, field names, IDs, Tridion references and null/empty
values. Some nested taxonomy IDs are missing, so filtering uses category/technology
titles rather than manufacturing identifiers. Options include root and nested titles.
This separation would allow the data-access layer to be replaced by Sitecore or
another headless CMS without moving filtering logic into presentation components.

Mode changes clear category/technology but retain search/sort; Reset clears the
current mode's search, filters and sort. Compatibility uses all original products,
independently of text search. Previous results remain visible during loading/errors.
Product links resolve supplied relative URLs against the source website, in the
current tab; missing images/URLs and nullable descriptions have graceful fallbacks.

## Responsive design, accessibility and performance

Cards use one column below 640px, two at 640-1023px, three at 1024-1279px and four
from 1280px. Mobile cards place images beside text; controls stack or wrap.
Semantic landmarks, headings/lists, a skip link, labelled native controls, visible
focus, 44px form targets and result/error announcements support keyboard use.
Card links take their names from visible headings; redundant thumbnails use empty
alt text, while the logo retains its alternative.

My Lighthouse results against the local production build were:

| Profile | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 98 | 100 | 100 | 100 |

WAVE recorded zero accessibility/contrast errors and AIM 10/10, with three alerts.
I subsequently added explicit Display/Sort label associations; the home
link duplication serves brand navigation and breadcrumbs. A repeat WAVE result
following that change has not been recorded. Automated scores do not establish
WCAG conformance or replace screen-reader, keyboard, zoom and real-device checks.

Product images use `next/image`, a restricted remote-host allowlist, responsive
`sizes`, fixed regions, `object-fit: contain`, lazy loading and the default cache.
Only the small logo is prioritised. Unit tests cover combined queries, sorting,
compatibility/reset, empty results and source preservation; API tests check HTTP
status codes, response shape and invalid parameters. I have opened and tested the
live demonstration; equivalent hosted audit results have not been recorded.

## Assumptions and known limitations

- **Popularity sorting:** `productOrderNumber` has no confirmed popularity semantics.
  An authoritative ranking or CMS data contract would be required before
  implementing popularity sorting. Sorting and badges based on popularity remain unavailable.
- **Branding assumption:** the PDF references clickable brand-guideline links,
  but no usable embedded links were found. I used the supplied screenshots,
  cropped their supplied logo and approximated the font/hero styling. Official
  logo, typography and hero assets would improve fidelity.
- **Permitted scope:** site-wide navigation, login and site-wide search have no
  working backend, as allowed by the brief. The listing's own search is functional.
- **Browser limitation:** native dropdown popups vary by OS/browser and may extend
  beyond desktop-emulated mobile viewports. Full selected titles wrap below controls.
- **Production follow-up:** confirm CMS/data contracts, add CI/browser accessibility
  coverage and monitor remote-image availability and optimisation costs.

## Proposed UX improvement: active filter summary

With several filters selected, particularly when mobile controls are collapsed,
it can be difficult to see why results are restricted. Mobile and keyboard users,
and anyone combining filters, would benefit from compact removable filter chips
above the results. Each chip would clear one selection without reopening the
controls. This is a proposal, not an implemented feature.

## What I'd improve next

Given more time, I'd prioritise:

1. **Complete popularity sorting:** Agree an authoritative ranking or CMS data
   contract rather than infer popularity from an unrelated field.
2. **Improve visual fidelity:** Replace approximated typography and hero styling
   with official brand assets and guidelines.
3. **Expand automated coverage:** Add browser-level user-journey and accessibility
   checks, ideally integrated into CI.
4. **Prepare for CMS integration:** Define and validate a clear Sitecore data
   contract, retaining the separation between data access and presentation.

The active filter summary proposed above would also be a useful subsequent UX enhancement.

## AI assistance and time

ChatGPT assisted with planning, story breakdown and technical review. Codex assisted
with implementation, automated testing, debugging and documentation. I reviewed,
manually tested and accepted the work, handled Git commits and deployed to Vercel.

Total recorded time was approximately **4 hours 40 minutes**, including planning,
AI-assisted work, troubleshooting, manual verification, documentation and deployment.

## Additional technical notes

- [Sprint record](docs/Sprint.md): detailed validation evidence, troubleshooting
  history and story progression. On Windows, use the checkout's actual path casing;
  mismatched casing reproduced build failures despite one installed React copy.
- Vercel project: `ryanh-mp-assessment`. The documented deployment settings are the
  repository root, `npm ci`, `npm run build` and framework-default output. Node 26.x
  is recommended to match local validation; the deployed runtime version has not
  been verified, and no Node version is pinned in the project configuration.
  No custom deployment file or application environment variables are required.
- An initial audit reported eight moderate findings in development lint dependencies;
  no fresh registry audit is claimed. ESLint 9's support warning and the Node test
  runner's module-type detection warning remain documented in the sprint record.
