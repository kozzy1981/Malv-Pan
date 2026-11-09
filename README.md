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
document and metadata. Both are Server Components by default; no client-side
state is needed for this initial page. Global styles load Tailwind through PostCSS.

Generated output, dependencies and local `.env*` files are ignored. Commit the
npm lockfile to preserve the resolved dependency versions. Product features are
implemented incrementally in later stories.

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
