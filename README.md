# Malvern Panalytical technical exercise

ST-01 establishes a Next.js App Router application with React, TypeScript,
Tailwind CSS and ESLint. Application source lives in `src/`; `@/*` maps to `src/*`.

## Run locally

Use Node.js 20.9 or newer (an actively supported LTS release is recommended)
and npm. The initial baseline was validated with Node.js 26 and npm 11.

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Stop the server with Ctrl+C.

If Node.js is installed at `D:\Apps\Node` but missing from your terminal's PATH,
add it for the current PowerShell session before running the commands:

```powershell
$env:PATH = 'D:\Apps\Node;' + $env:PATH
```

## Validate and run production output

```powershell
npm run lint
npm run build
npm start
```

Linting is a separate check because Next.js 16 does not run ESLint during builds.
The build also checks TypeScript. `npm start` requires a successful build first.

`src/app/page.tsx` defines `/`, and `src/app/layout.tsx` supplies the shared HTML
document and metadata. The page reads `getProducts()` on the server and passes
initial records to an interactive, server-prerendered listing; hydration does not
trigger an internal API request. Subsequent control changes use the listing API.
Global styles load Tailwind through PostCSS.

Generated output, dependencies and local `.env*` files are ignored. Commit the
npm lockfile to preserve the resolved dependency versions.

## Listing presentation (ST-04)

The homepage renders all 46 source records in their original order. Reusable
header, hero, listing and card components establish four-column desktop,
three-column tablet and single-column mobile layouts; mobile cards place images
beside their copy. ST-05 adds native listing controls. Popularity and its badges
remain unavailable until a source mapping is confirmed.

Product links resolve the supplied relative URLs against
`https://www.malvernpanalytical.com`, matching the JSON's `metadata.sourceUrl`.
They open in the current tab. No local detail routes or product URLs are invented.
Missing image URLs show a placeholder, blank descriptions are omitted and missing
destination URLs render a non-linked card. Product images use Next.js's built-in
optimiser with a narrowly allowed HTTPS source host, responsive `sizes` matching
the grid, and native lazy loading. The fixed image regions and `object-fit: contain`
preserve layout and aspect ratios. Only the small header logo is prioritised;
product thumbnails remain lazy-loaded.

The default Next.js image cache and TTL are unchanged. Generated variants are
cached under `.next/cache/images`; their expiry follows the larger of Next.js's
minimum TTL and the upstream cache lifetime. The source host must be accessible
from the Next.js server on a cold cache. No custom cache or local copies of the
product assets are used.

The logo in `public/images/` was cropped from supplied reference `resources/3.png`;
the original remains untouched. No standalone brand font, logo or hero-pattern
asset was supplied. Arial/system sans-serif and a dark gradient approximate the
reference; the header includes working home/product navigation and a source-site
link rather than non-functional site-wide controls.

Accessibility targets WCAG 2.2 AA: semantic landmarks and lists, one page heading,
a skip link, named product links, image alternatives, visible two-colour focus
indicators, wrapping text and no sticky content. Links have generous target areas
(header links at least 24px high; primary navigation 44px high). Text colours were
checked numerically against their backgrounds. This is not a full conformance
claim: browser, screen-reader, zoom and keyboard acceptance remain necessary.

Manual acceptance at http://localhost:3000:

1. Inspect at 1440px, 768px, 390px and 320px widths, plus intermediate widths;
   verify 4/3/1 columns, readable cards, contained images and no horizontal scrolling.
2. Check all 46 cards and a few names/descriptions/images against the JSON.
   Follow a card and confirm it reaches the corresponding source website page.
3. Start with Tab: the skip link must become visible. Press Enter and verify the
   main content receives focus; subsequent Tab presses should reach the breadcrumb
   and each card, with a visible outline. Shift+Tab should work in reverse.
4. Check 200% text enlargement and 400% browser zoom (1280px viewport gives an
   effective 320px width). Confirm no clipped content, overlapping links or lost
   functionality. Check the page with a screen reader for meaningful heading,
   list, image and link announcements.

Browser automation was unavailable during ST-04 validation. HTTP/HTML checks
verified the rendered cards, source URLs, headings, skip target and image alt
attributes; these checks cannot establish visual or full accessibility compliance.

### Image performance verification

The earlier `unoptimized` setting sent full-resolution originals to browsers.
Three sampled sources were 7.3-26.5 MB and 4912-6436px wide, despite card images
being only a few hundred CSS pixels wide. Their upstream responses already sent
`Cache-Control: max-age=2592000, public`. That supports network reuse, but does not
prevent large decoded images consuming memory or needing to be decoded again.
There is no scroll observer, client state, unstable key or list virtualisation
that deliberately remounts images during scrolling. No scroll-linked animation,
backdrop filter, fixed background or persistent card shadow was found.

Production HTTP checks after enabling optimisation produced 384px-wide WebP
variants of 7.8-16.5 KB for those same three sources. Each returned
`x-nextjs-cache: MISS` then `HIT`, with a 30-day `Cache-Control` max-age inherited
from upstream. All 46 source URLs match the allowlist; a different host was
rejected with HTTP 400. This verifies sampled server optimisation/cache behaviour,
not browser scroll performance or every source asset's availability.

For a fair production comparison, stop `npm run dev`, run `npm run build`, then
`npm start`. Alternatively, keep development running and use
`npm start -- --port 3002` after building. Compare the same viewport, device scale,
throttling and extensions. Development includes compilation, hot reload and dev
tooling overhead; Lighthouse TBT alone cannot identify the source of scroll lag.
Do not compare a cold production image cache with a warm development cache.

In Chrome DevTools:

1. In Network, leave **Disable cache unchecked**, filter by **Img**, and scroll
   down then back up. Product requests should use `/_next/image?url=...&w=...&q=75`
   with appropriately sized `srcset` candidates, rather than fetching originals
   directly from the asset host. Native lazy loading may fetch near-screen images
   before they are visible.
2. Inspect transferred bytes, response dimensions, `Cache-Control` and
   `x-nextjs-cache`. A new optimised variant may be `MISS`, then `HIT` on another
   server request; the browser can instead serve memory/disk cache without making
   that request. Width, quality and negotiated format identify different variants.
   A changed viewport or device scale can legitimately select another width.
3. Watch whether scrolling back causes a network transfer at all. A memory/disk
   cache entry or a 304 response is not a full asset download. Keep cache settings
   unchanged between comparisons.
4. Record the same scroll in Performance. Check long main-thread tasks, image
   decoding, painting and raster work. Returning images can need decoding or
   rasterisation after browser memory eviction even without another download.
   Server cache hits do not prove browser-decoded pixels stay in memory.
5. Recheck thumbnail sharpness/transparency, lazy loading, responsive layout,
   keyboard focus and CLS. Run Lighthouse against production with a warm image
   cache separately from the first cold visit. No improved score or confirmed
   cause of TBT is claimed without those browser measurements.

## Products API (ST-03)

`GET /api/products` returns HTTP 200 with `{ "products": [...], "total": 46 }`.
`products` contains unchanged source records; `total` is the matching count.
With no parameters, all 46 records retain their original source order.

Optional query parameters can be combined:

- `search`: trimmed, case-insensitive substring matching against `title` or
  `strapline` (the supplied name and description text).
- `category`: trimmed, case-insensitive **exact title** matching against each
  product's nested `categories`. Titles are used because some nested categories
  have empty IDs and null Tridion identifiers. No identifiers are manufactured.
- `sort`: exactly `name-asc` or `name-desc`, using case-insensitive English title
  collation. Equal names retain source order. Sorting operates on a new array.

Search and category use AND semantics. Empty/whitespace search or category values
are absent. Unknown categories or unmatched searches return HTTP 200 with
`{ "products": [], "total": 0 }`. Any supplied invalid sort (including an empty
value) returns HTTP 400 with `{ "error": "Invalid sort. Use ..." }`.
Unknown parameter names are ignored; repeated parameters use their first value.

ST-05 adds `technology` (exact nested title, trimmed/case-insensitive, combined
with search/category using AND) and `mode` (`products`, `categories`,
`technologies`, `measurementTypes`). Default mode remains products. Each mode
returns its original collection through the existing `{ products, total }` keys;
taxonomy records have their source taxonomy fields rather than product-only fields.
Taxonomy views allow search/name sorting and ignore category/technology parameters.
Invalid modes return HTTP 400 with `{ error }`. There is no invented popularity
ranking: the UI disables it and the API continues to reject `sort=popular`.
See [ST-05 notes](docs/Sprint.md#st-05-implementation-notes) for control behaviour,
reset/error handling and manual acceptance checks.

In Products mode, category/technology selects keep all options visible but disable
incompatible combinations, derived from the complete source products already
passed to the listing. The All categories/All technologies options stay enabled. Selecting a filter clears any
incompatible opposite selection before the normal API request. Search and sorting
do not affect availability, including when a search returns no matches. Native
disabled semantics, unavailable labels and subdued colours communicate the state;
exact popup styling depends on the browser/OS. No extra API calls are needed.

Examples while `npm run dev` is running:

- http://localhost:3000/api/products
- http://localhost:3000/api/products?search=ZETASIZER
- http://localhost:3000/api/products?category=Density%20analyzers
- http://localhost:3000/api/products?sort=name-asc
- http://localhost:3000/api/products?search=pyc&category=Density%20analyzers&sort=name-desc

Run focused query tests with `npm test`. These use Node's built-in test runner
and native TypeScript stripping (Node.js 22.18+ or 24+; validated on Node.js 26).
No test framework or additional dependency is required. Run TypeScript separately
with `npx --no-install tsc --noEmit --incremental false`.

## Dependency notes

The initial install reported eight moderate audit findings through `minimatch`
in the Next.js ESLint tooling. npm's suggested forced fix downgrades
`eslint-config-next` to a different Next.js major, so it has not been applied.
ESLint 9 also reports that it is out of support; the installed React lint plugin
declares support through ESLint 9, so this baseline retains that compatible major.
Review these tooling dependencies when compatible upstream updates are available.
