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

The original core budget is **four hours (240 minutes)**: ST-00 planning and
environment preparation was allocated **60 minutes**, and ST-01 through ST-08
total **180 minutes**. ST-00 is preparation outside the eight implementation
stories. These are agreed allocations, not measured elapsed times.

The assessment's separate overall maximum is **eight hours, including
AI-assisted work**. It does not replace or expand the original story budgets.
Track actual time spent and report unfinished work; do not assume the full
budget remains after ST-01 and preparation.

The PDF has inconsistent timing content: its rendered pages show an expected
2-4 hours, while extracted text also contains a 4-8 hour estimate and an explicit
eight-hour maximum. Use the developer's eight-hour cap for this sprint and note
the discrepancy rather than silently rewriting the brief.

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
| ST-05 | Interactive Product Listing | 30 minutes | Planned | Implement four display modes (Products, Categories, Technologies, Measurement Types), category and technology filtering, alphabetical/popularity sorting, mobile filters, API-driven interactions and empty/loading/error states. Acceptance: changing controls updates results through the API; combined controls, all display modes, mobile filter interaction and result states work according to documented decisions. Product filtering and sorting remain server-side. |
| ST-06 | Responsive Design | 30 minutes | Planned | Refine layouts and image handling against the mobile, tablet and desktop references, including widths between them. Acceptance: developer checks visual fidelity, usable controls and cards, and absence of horizontal overflow at reference and intermediate widths. |
| ST-07 | Accessibility, Testing & Refinement | 15 minutes | Planned | Review semantic HTML, keyboard access and edge cases; refine issues and verify filtering/sorting and integrated behaviour. Acceptance: run appropriate checks and document results, manual accessibility checks and remaining limitations. Include meaningful automated checks if time permits; otherwise document how filtering and sorting are verified. |
| ST-08 | Deployment & Documentation | 15 minutes | Planned | Vercel deployment, README instructions, improvement proposals, time recording and AI disclosure. Acceptance: with explicit deployment authorisation, verify the working preview; document setup, API usage, decisions, assumptions, proposed improvements, actual time, AI/tool use and unfinished work. Git operations remain developer-owned. |

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

This documentation preparation does not implement ST-02. Resume it only on an
explicit instruction after review of this plan.
