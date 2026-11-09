# Implementation sprint

## Purpose and authority

Build the Malvern Panalytical assessment as eight independently reviewed stories,
ST-01 through ST-08. Follow [AGENTS.md](../AGENTS.md), keep the implementation
proportionate and stop after each story for developer acceptance. This document
records the confirmed sequence and assessment requirements; it does not authorise
implementation of another story.

Sources inspected:

- [Original exercise PDF](../resources/malvern-panalytical-developer-exercise.pdf), all four pages.
- Design references [1](../resources/1.png), [2](../resources/2.png),
  [3](../resources/3.png) and [4](../resources/4.png).
- [Original dataset](../resources/products.json).
- Repository instructions, existing application and the developer's story requests.

The developer has restored the previously agreed eight-story plan below,
including names, scope and original budgets. The numbered sections in the PDF
are assignment requirements, not story definitions.

## Time limit and priorities

The visible assessment brief suggests approximately **2-4 hours**. Use the
developer's actual time log for reporting effort:

| Work | Recorded time |
| --- | --- |
| ST-00 planning and preparation | 60 minutes |
| ST-01-ST-07 implementation, manual review, testing and refinement | 205 minutes |
| Total through ST-07 | **265 minutes (4 hours 25 minutes)** |
| ST-08 | Pending recording |

The recorded time includes AI-assisted development, troubleshooting, manual
verification and review, not just coding. No final total is available until ST-08
time is recorded. Story budgets below are historical planning estimates, not
recorded actuals. Hidden PDF text is not used as submission timing guidance.

Prioritise a faithful responsive page and a working API with server-side filtering
and sorting. Use remaining time for accessibility, robustness and meaningful
verification. A production-ready application is not required. Preserve the
agreed story budgets below and record actual elapsed time separately.

## Assessment requirements and overall acceptance

- Implement the supplied design in Next.js: header, hero, product cards, display
  controls, category and technology filters, alphabetical and popularity sorting.
  Use the brand typography, colours and logo. Implement independently; do not copy
  HTML, CSS or JavaScript from the existing Malvern Panalytical website.
- Use the supplied JSON collections rather than hardcoding the screenshot products.
  Display can switch among products, categories, technologies and measurement types.
  Category and technology filters apply to products; document control behaviour
  for the other views.
- The frontend calls the application's read-only API when filters or sorting
  change. The API validates query parameters, performs filtering and sorting on
  the server and returns JSON. Make supporting display/filter data available to
  the frontend. Document endpoint structure, response format and invalid-input
  behaviour.
- Match mobile, tablet and desktop references and work at intermediate widths.
  Mobile filters must open and be usable. Product cards link to their source URLs.
  Header navigation, login and site-wide search need no working backend.
- Consider semantic HTML, keyboard accessibility, image handling, and loading,
  empty and error states. Keep data access, listing logic and presentation separate.
  No CMS instance, database, authentication, writes or separate backend is required.
- Include a small number of meaningful filtering/sorting checks if time permits;
  otherwise explain manual verification. Report actual validation results.
- Propose one design or interaction improvement: problem, affected users and
  solution. Keep the supplied design primary; an alternative implementation or
  sketch is optional.
- Submission expectations: source repository with meaningful incremental commits,
  working preview (preferably Vercel), and a short README covering setup, API usage,
  decisions, assumptions, AI/tool use, time spent, unfinished work and future
  improvements. Git operations belong to the developer. Deployment requires
  explicit instruction; these expectations do not authorise either action.
- The developer should be able to explain, verify and modify the implementation
  during the follow-up discussion.

## Resource observations

The screenshots show a single-column mobile card layout with collapsed filters
(1), a three-column tablet layout (2), and four-column desktop layouts with
alphabetical sorting (3) and popularity sorting (4). They illustrate layout and
interaction states, not an authoritative subset or count of records.

The JSON root contains `metadata`, `products` (46), `categories` (36),
`technologies` (19) and `measurementTypes` (50). The actual array lengths match
the metadata counts. Images are remote URLs; page URLs are relative. Preserve
all source fields, relationships, identifiers and Tridion-style `keywordTcmId`
values, including strings that look numeric.

Products contain nested `categories`, `technologies` and `measTypes` arrays;
`measTypes` differs from the root collection name `measurementTypes`. All 46
products currently have `isproduct: true` and `promotions: null`.
`productOrderNumber` contains strings `1` through `15`, followed by empty strings.
Taxonomy `shortName` values can be null, and three root measurement-type
`strapline` values are null. Distinguish null, empty and missing values when
modelling the source; do not invent replacement content.

## Eight-story sequence

| Story | Name | Budget | Status | Scope and acceptance |
| --- | --- | --- | --- | --- |
| ST-01 | Bootstrap & Setup | 10 minutes | Completed, per developer | Next.js App Router, React, TypeScript, Tailwind CSS and ESLint; npm, `src/`, `@/*`, suitable scripts and ignore rules; default homepage on localhost:3000. Lint, production build and local HTTP smoke check passed during ST-01. |
| ST-02 | Data Models & Access | 15 minutes | Next; not implemented | Preserve the original JSON, define descriptive TypeScript models matching the real structure and expose records through a small reusable server-side data-access module. No API, filtering, sorting, pagination or UI. Acceptance: type checking and ESLint pass; module reads the supplied records; report loaded product count and data assumptions. |
| ST-03 | API, Filtering & Sorting | 30 minutes | Planned | Read-only Next.js API using the data-access module; category/technology query parameters, alphabetical/popularity sorting, deliberate validation and JSON responses. Make display/filter supporting data available. Acceptance: document contract; verify valid, combined, invalid and empty-result requests and server-side sorting/filtering. Exact parameters and sort semantics must be settled in this story. |
| ST-04 | Page Structure & Components | 35 minutes | Planned | Build the header, hero, listing controls and reusable cards from the supplied designs; present source content and link cards to source URLs. Acceptance: developer checks page structure, component responsibilities and source-backed content. Interactive behaviour belongs to ST-05; responsive refinement and visual checks across widths belong to ST-06. |
| ST-05 | Interactive Product Listing | 30 minutes | Implemented; awaiting acceptance | Implement four display modes (Products, Categories, Technologies, Measurement Types), category and technology filtering, alphabetical/popularity sorting, mobile filters, API-driven interactions and empty/loading/error states. Acceptance: changing controls updates results through the API; combined controls, all display modes, mobile filter interaction and result states work according to documented decisions. Product filtering and sorting remain server-side. |
| ST-06 | Responsive Design | 30 minutes | Implemented; awaiting acceptance | Refine layouts and image handling against the mobile, tablet and desktop references, including widths between them. Acceptance: developer checks visual fidelity, usable controls and cards, and absence of horizontal overflow at reference and intermediate widths. |
| ST-07 | Accessibility, Testing & Refinement | 15 minutes | Implemented; awaiting acceptance | Review semantic HTML, keyboard access and edge cases; refine issues and verify filtering/sorting and integrated behaviour. Acceptance: run appropriate checks and document results, manual accessibility checks and remaining limitations. Include meaningful automated checks if time permits; otherwise document how filtering and sorting are verified. |
| ST-08 | Deployment & Documentation | 15 minutes | Prepared; developer deployment pending | Vercel deployment, README instructions, improvement proposals, time recording and AI disclosure. Acceptance: with explicit deployment authorisation, verify the working preview; document setup, API usage, decisions, assumptions, proposed improvements, actual time, AI/tool use and unfinished work. Git operations remain developer-owned. |

## Decisions still needed

- Define popularity order and badge behaviour from the available source fields.
  The JSON has no explicit popularity score or badge flag, and every product's
  `promotions` is null. Whether `productOrderNumber` represents popularity, how
  blank values sort, and how badges are derived need an explicit documented
  decision; do not invent source values to match screenshots.
- Decide filter combination rules, defaults, identifier choice and invalid query
  handling in ST-03; document behaviour for sorting and filters outside products.
- Resolve relative product links against the source website as appropriate for
  the eventual UI, rather than assuming corresponding local product routes exist.
- The PDF mentions clickable brand-guideline links, but no URI annotations were
  found during inspection. Confirm brand assets/guidelines before precise visual
  implementation; screenshots provide a visual reference in the meantime.
- Confirm elapsed development time and remaining budget. Any preview deployment
  and all Git work remain under developer control.

## Story completion and review

For each authorised story: inspect current code, implement only that story, run
the smallest appropriate checks, and report summary, significant files, design
decisions, validation commands/results, manual checks, limitations and status.
Explain unfamiliar React/Next.js concepts for a C#/.NET developer where useful.
Leave browser acceptance to the developer. Stop for manual acceptance before
starting the next story.

## ST-05 implementation notes

Implemented for developer acceptance; stop here before ST-06. ST-01 through ST-04
were confirmed complete by the developer before this story. Original story budgets
remain unchanged, including ST-05's 30-minute allocation.

- Four modes expose original source collections: Products (46), Categories (36),
  Technologies (19), Measurement Types (50), before searching.
- `/api/products` preserves its default `{ products, total }` contract. Optional
  `mode` accepts `products`, `categories`, `technologies` or `measurementTypes`;
  the existing `products` key contains taxonomy records in alternate modes.
  Invalid modes return HTTP 400 with `{ error }`.
- Optional `technology` matches trimmed, case-insensitive exact nested titles,
  just like `category`. Search, category and technology combine with AND semantics.
  Unknown filters return HTTP 200 with no matches; blank filters are absent.
  Existing name sorts, invalid-sort errors and default source order are retained.
- Taxonomy views support search and name sorting. Product-only filters are disabled
  there and ignored by the API. Mode switching clears category/technology but keeps
  search/sort. Reset clears search, both filters and sorting in the current mode.
- Option titles include root and nested records, preserving selection of categories
  without IDs. No source identifiers, metrics or content are manufactured.
- Products-mode dropdowns retain every option but disable incompatible opposite
  titles using relationships from the complete original products prop. Native
  disabled options also carry an unavailable suffix and subdued colours. All
  placeholder options (All categories/All technologies) remain enabled, and clearing/resetting filters removes the corresponding
  restrictions. Changing one filter clears an incompatible opposite selection
  before making the existing single API request. Search and sorting never constrain
  option availability; no relationship requests or hardcoded mappings are added.
- The server provides initial products and option titles. The client listing is
  prerendered and hydrated without an initial fetch. Select changes request results
  immediately; search text applies on Search/Enter or the next selection change,
  avoiding a request for every keystroke. Superseded requests are aborted.
- Native details/summary makes search/filters collapsible on mobile and desktop,
  initially expanded. Labels, visible focus and 44px control heights are provided.
  Loading has a status message/busy region. Errors are announced with retry, and
  previous results remain visible during loading/failure. Empty results offer reset
  guidance. Existing responsive cards and lazy optimised images remain in place.
- Popularity remains unavailable with a disabled option and explanation. There is
  no defined popularity metric; `productOrderNumber` and `promotions` have not been
  reinterpreted. A confirmed source mapping is needed before enabling it or badges.
- Validation: TypeScript, ESLint, the production build and 23 pure-query tests passed
  (14 existing, nine added). Production HTTP checks verified default compatibility,
  all mode counts, combined filters, missing-ID categories, invalid requests and
  initial HTML with 46 cards and optimised lazy images. Browser interaction and visual accessibility remain
  manual acceptance checks; these checks do not establish full WCAG conformance.

Manual review: reset in each mode and check 46/36/19/50 results; combine search,
category, technology and both name sorts; select Density analyzers (missing source
IDs); test no matches and reset. Open/close filters and operate controls using a
mobile viewport and keyboard. Throttle the API to inspect loading and rapid changes;
block `/api/products` to check retained results/error handling, then unblock and
retry. Confirm no initial API request and unchanged optimised image URLs.

Dropdown refinement review: select Particle size analyzers and inspect disabled
technologies; select Laser Diffraction and inspect disabled categories. Confirm
All categories/technologies remain selectable and clearing/reset restores options.
Use keyboard navigation to confirm disabled options cannot be selected. Search
for an unmatched term and verify relationship availability remains unchanged.
The invalidation helpers are tested in both directions; native dropdowns normally
prevent choosing an incompatible pair in the first place. Native option colours
vary by browser/OS, so explicit unavailable labels supplement disabled semantics.
Refinement validation: TypeScript, ESLint, all 31 tests (including eight new
compatibility/reset tests) and the production build passed.

## ST-06 implementation notes

Implemented for developer acceptance; do not start ST-07. The original ST-06
budget remains 30 minutes.

Already responsive: fluid/capped content widths, wrapping header/hero text,
fixed-aspect-ratio image regions with `object-fit: contain`, horizontal mobile
cards, flexible labelled controls, visible focus states and 44px form targets.
No API, interaction, source-data or image-cache changes were needed.

Targeted refinements:

- Below 640px: retain one column of horizontal cards and explicitly stack controls
  and action buttons at full width. Reset vertical flex bases so controls do not
  inherit a 12rem height when their parent changes to a column.
- 640-1023px: two card columns, allowing more room for longer source descriptions
  than the previous three-column tablet rule. This follows the requested comfort
  guideline while retaining the reference card composition; the supplied tablet
  reference itself shows three columns.
- 1024-1279px: three columns, avoiding the previous jump to four just above 1024px.
- 1280px and above: retain the existing four-column desktop appearance and cap.
- Responsive image `sizes` now follow these same breakpoints and widths. Lazy
  loading, optimisation, fixed regions and source-image aspect ratios are preserved.

Validation: TypeScript, ESLint, all 31 existing tests and the production build
passed. Automated stylesheet-rule checks using the installed PostCSS parser
verified 375/768/1024/1440px as 1/2/3/4 columns, mobile stacking, contained images
and 44px inputs. Boundary checks at 639/640/1023/1279/1280px also passed. Production
HTML retains 46 cards with optimised lazy images and the updated sizes. These
checks assume a normal 16px media-query root; they do not measure browser layout,
overflow, text clipping or visual fidelity. Browser tooling reported that its
access host was unavailable, so visual acceptance remains outstanding.

Manual acceptance at 375px, 768px, 1024px and 1440px (and between breakpoints):

1. Verify 1/2/3/4 card columns, contained images, readable headings/descriptions
   and no horizontal page scrolling. Check all four listing modes, including
   records with long titles or missing images.
2. Below 640px, verify full-width stacked search, category, technology, sort,
   mode and action controls. At larger widths, inspect wrapping rows and confirm
   the 1440px desktop card appearance is retained.
3. Inspect long selected filter values and unavailable option labels using the
   native dropdown popup. Popup sizing and truncation of closed select text vary
   by browser/OS; the complete option text remains in the native control.
4. Tab/Shift+Tab through controls and cards, activate the skip link and disclosure,
   and verify visible, unobscured focus. Check touch targets on a mobile device.
5. Recheck combined filters, reset, loading/errors, 200% text enlargement and
   400% browser zoom. Confirm no loss of content/functionality or new overflow.

Full accessibility conformance and device-specific visual behaviour are not
claimed from stylesheet or query tests.

## ST-07 implementation notes

Implemented for manual acceptance within the focused quality-review scope; do not
begin ST-08. The original allocation remains 15 minutes.

- Reviewed landmarks, heading hierarchy, labels/names, focus rules, native
  keyboard semantics, disabled options, image alternatives, status/error handling,
  text colours and touch-target rules. Kept the existing semantic structure and
  empty product-thumbnail alternatives: adjacent linked titles already identify
  them. The informative brand-logo alternative remains.
- Shortened disabled option suffixes to `(unavailable)` while retaining complete
  source titles and native disabled attributes. Explicit category/technology
  labels stay separate from wrapping selected-value text below the control row.
  Closed fields are bounded to their container. This reduces application-driven
  width/label issues without replacing native selects or hiding overflow.
- The expanded popup at 375px and awkward label at 768px involve native UI whose
  sizing/wrapping depends on the browser/OS, especially desktop device emulation.
  CSS cannot guarantee popup containment. The full selected title is now readable
  in page content even when the closed select truncates it. Real-device/manual
  checks remain necessary; those observations are not claimed fully resolved.
- Result-status messages now identify the collection, explain zero matches and
  label retained counts as previous results after failures. Existing error alerts,
  retry, reset, request cancellation and normal focus order are preserved.
- Existing 31 tests already cover filtering/sorting, combined queries, compatibility
  and resets, empty results, invalid parameters and source preservation. Added four
  separate production HTTP integration tests for route wiring, JSON/status/error
  contracts and unchanged source collections. Run `npm run test:api` against a
  running server (default localhost:3002); normal unit tests need no server.
- Validation passed: TypeScript, ESLint, 31 unit tests, four production HTTP tests
  and production build. Rendered HTML checks found one main/page heading, five
  labelled controls, unique IDs, valid ARIA references, a skip target, the logo
  alternative and 46 lazy optimised thumbnails. Sampled text/background contrast
  ratios were 6.08:1 or higher. These are focused checks, not a full accessibility
  scan, interactive-browser verification or proof of WCAG conformance.
- No image optimisation/cache, source data, API behaviour, filtering/sorting,
  dependencies or request-frequency changes. No performance regression was apparent
  from code inspection, but Lighthouse and scroll measurements were not repeated.

Manual acceptance: keyboard-only navigation and skip link; native dropdown opening,
disabled-option behaviour and long selected titles at 375px/768px; all ST-06 widths
and zoom checks; screen-reader loading/empty/error updates; blocked-request retry;
WAVE and Lighthouse against production. No manual browser, screen-reader or
Lighthouse results are claimed for this pass. Git operations remain developer-owned.

### Developer-reported ST-07 manual audit

The developer supplied the following production results after the implementation
pass; these were not independently rerun by the agent:

| Audit | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Lighthouse desktop | 100 | 100 | 100 | 100 |
| Lighthouse mobile | 98 | 100 | 100 | 100 |

WAVE: **0 accessibility errors, 0 contrast errors, 3 alerts** (two orphaned form
labels and one redundant link); reported AIM score **10/10**. These favourable
automated scores do not establish full WCAG conformance or replace keyboard and
screen-reader checks.

Alert investigation against current source and production-prerendered HTML:

- The developer clarified that the two label alerts target **Display** and
  **Sort** on initial load, with Products and Original order selected. These are
  the intended defaults. The earlier category/technology hypothesis does not
  describe the reported alerts.
- Display and Sort already had valid implicit associations through wrapping
  labels. Added explicit associations as a small robustness refinement:
  `label[for="listing-mode"]` targets `select#listing-mode`, and
  `label[for="listing-sort"]` targets `select#listing-sort`. The labels and
  controls remain visually unchanged; no redundant ARIA names or extra labels
  were added. Category and Technology retain their valid explicit associations;
  Search retains its valid wrapping label. WAVE must be rerun before claiming
  the two alerts are resolved; the original associations were not proven invalid.
- The only duplicate destination found in the prerendered links is `/`:
  `SiteHeader.tsx`'s `a.brand-link` (Malvern Panalytical home), and
  `ProductsHero.tsx`'s breadcrumb `a[href="/"]` (Home). This is the apparent
  redundant-link pair; WAVE's precise flagged node still requires its element
  details. They serve distinct brand-navigation and breadcrumb contexts with
  meaningful names. Retaining them is an accepted duplication, with no demonstrated
  usability defect requiring their removal.

The initial follow-up was documentation-only. Following the developer's label
identification, `ProductListing.tsx` also received the two explicit associations.
Manual follow-up: rerun WAVE on a refreshed production page in its default state,
check Display/Sort accessible names and click-to-focus behaviour, and retain the
accepted home-link duplication and native popup/browser limitations. ST-08 has
not begun.

Explicit-label follow-up validation: TypeScript, ESLint, all 31 unit tests and
the production build passed. Production HTML confirms one explicit label and
one matching select for each of `listing-mode` and `listing-sort`. WAVE was not
rerun by the agent.


## ST-08 delivery preparation

ST-01 through ST-07 were confirmed implemented and manually accepted by the
 developer before this story. ST-08 documentation/readiness work is prepared for
review; the developer owns all Git work and actual deployment. No Vercel account,
project settings or hosted application were accessed or verified by the agent.
The original 15-minute story allocation remains an allocation, not elapsed time.

Files changed: README.md was finalised around the completed prototype, and this
sprint record was extended. Application source, configuration, dependencies,
original resources and AGENTS.md were not changed.

### Documentation and readiness

- README covers overview/features, Node/npm prerequisites, setup, all validation
  commands, API contract, architecture/data decisions, responsive/accessibility
  behaviour, image optimisation, testing, limitations, improvement proposal and
  manual Vercel deployment. Prior story evidence remains in this sprint history.
- AI disclosure states ChatGPT supported planning/story breakdown/review, Codex
  assisted implementation/testing/documentation, and the developer manually
  reviewed/tested/accepted the work. No AI or automated check substitutes for the
  developer's ability to explain the code.
- Standard Next.js App Router configuration and npm scripts are suitable for
  Vercel. No static export, custom server, deployment file or runtime secrets are
  needed. The JSON is imported at build time, avoiding machine-specific runtime
  filesystem paths. Remote images are restricted to their source HTTPS host.
- Recommend Node 26.x in the Vercel dashboard, matching local Node 26.13.0/npm
  11.20.0 validation. Vercel's supported-version documentation lists 26.x; no
  package engine/configuration change was necessary.
- The app has no environment-variable requirements. PRODUCT_API_URL is an optional
  integration-test origin only. Do not deploy development NODE_ENV overrides.
- Read-only file/index inspection (without Git commands) found the lockfile and
  original source JSON in the index and no application/resource/test files missing
  from it at inspection time. No tracked generated output, cache, backup, private
  key or environment-file paths were found. Generated build/cache folders and
  local environment secrets are covered by existing ignore rules.
- Common secret-pattern checks found no matches in inspected text files; no local
  environment files or machine-specific paths were found in application/config
  inputs. This is a limited pattern scan, not proof that secrets cannot exist.
  README's previous local installation path was replaced by portable setup and
  canonical-path guidance. AGENTS.md's SHA-256 was checked unchanged.
- Windows manual-build failures were reproduced earlier from differently cased
  working directories. Both engines passed from the canonical path; README now
  explains that correction. No dependency upgrade, reinstall or failure-suppression
  workaround was introduced.

### Final local validation (9 November 2026)

| Command/check actually executed | Result |
| --- | --- |
| `node --version` / `npm.cmd --version` | PASS: v26.13.0 / 11.20.0 |
| `npm.cmd ls next react react-dom` | PASS: Next 16.4.5, React/React DOM 19.3.1; deduplicated |
| `.\node_modules\.bin\tsc.cmd --noEmit --incremental false` | PASS, exit 0 |
| `npm.cmd run lint` | PASS, exit 0; no ESLint warnings |
| `npm.cmd test` | PASS: 31 tests, no failures/skips |
| `npm.cmd run build` | PASS: normal Turbopack production build, including static generation |
| `npm.cmd start -- --port 3002` | PASS: local production server started |
| `npm.cmd run test:api` | PASS: four production HTTP integration tests, no failures/skips |

The temporary production server was stopped after testing. Node emitted the
existing MODULE_TYPELESS_PACKAGE_JSON warning while importing TypeScript in unit
tests; all tests passed. No fresh registry audit was run. The initial eight
moderate development-tool findings and ESLint 9 support limitation remain recorded,
without claiming they were re-audited or resolved. Previous developer-reported
Lighthouse/WAVE scores remain historical local evidence, not deployed results.

### Remaining developer actions

1. Review README and the final files; record ST-08 time and then calculate the
   final total. Recorded effort through ST-07 is 4 hours 25 minutes, including
   planning, AI-assisted work, troubleshooting, manual verification and review.
2. Review Vercel settings before pushing main if Git integration may auto-deploy.
   Commit/push the intended state yourself. Import the existing GitHub repository
   if not linked; select Next.js, repository root, Node 26.x, npm ci, npm run build
   and the default output directory. No application environment variables are needed.
3. Deploy the reviewed revision yourself. Check logs, runtime settings and account
   quotas, then record the real deployment URL. No deployment is performed here.
4. On that URL, verify four mode counts, combined filtering/search/sort, reset,
   disabled options, loading/no-match/error/retry states and source links. Check
   cold/warm optimised image responses and upstream availability.
5. Recheck desktop/mobile/intermediate layouts, keyboard/skip/focus, screen-reader
   announcements, native dropdowns, zoom, WAVE and production Lighthouse. In
   particular, rerun WAVE after the explicit Display/Sort label changes. Retained
   home-link duplication and native popup limits are documented, not hidden.

Outstanding limitations: popularity needs an authoritative source mapping; official
brand assets should replace the screenshot crop/system-font approximation when
available; hosted image behaviour, account settings, ST-08 time and deployed
acceptance remain unverified. No full WCAG conformance or production readiness
beyond the assessment prototype is claimed. Stop for developer review.
