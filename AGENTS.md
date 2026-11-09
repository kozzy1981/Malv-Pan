
# Malvern Panalytical Developer Assessment — Agent Instructions

## 1. Project Purpose

This repository contains a Next.js product listing prototype developed
for the Malvern Panalytical technical assessment.

The solution must be:
- Functional and responsive.
- Easy for a developer to read, understand and explain.
- Straightforward to debug and modify during a live interview.
- Appropriately structured without unnecessary complexity.
- Small enough to complete within a time-boxed assessment.

Prioritise clarity, correctness and maintainability over cleverness.

## 2. Readability and Naming

Use descriptive, human-readable names throughout the project.

- Prefer `filteredProducts` over `fp`.
- Prefer `selectedCategory` over `cat`.
- Prefer `handleCategoryChange` over `onCat`.
- Prefer `sortProductsByName` over `sortFn`.
- Name React components according to their actual responsibilities.
- Use descriptive names for filenames, types, interfaces and assets.
- Use PascalCase for React components and types.
- Use camelCase for functions, variables and properties.
- Use consistent naming throughout the application.

Avoid unnecessary abbreviations, single-letter variables,
cryptic helper names and overly compressed expressions.

Short conventional names, such as array indices, are acceptable
when they genuinely improve clarity.

## 3. Comments and Documentation

This is an assessment that the developer will study and explain.

Use more explanatory comments than would ordinarily be required
in a small production application.

For non-trivial functions, provide comments describing:
- What the function does.
- Important parameters and return values where useful.
- Any non-obvious behaviour or edge cases.
- Why a particular approach was chosen, when relevant.

Use TSDoc-style comments for significant functions, components,
types and utilities.

Add inline comments around meaningful business logic, API handling,
data transformations, state management and unusual framework behaviour.

Explain intent and reasoning rather than simply repeating the code.

Avoid commenting every statement or creating comments that become
misleading when the implementation changes.

Keep comments accurate and update them when changing behaviour.

## 4. Implementation Style

Prefer simple, explicit and understandable TypeScript.

- Use TypeScript types rather than `any` wherever practical.
- Prefer named functions for substantial logic.
- Use early returns when they simplify the control flow.
- Avoid deeply nested conditions.
- Avoid complex chained expressions when intermediate variables
  would improve readability.
- Do not introduce unnecessary generic abstractions.
- Do not over-engineer the architecture.
- Keep components and functions focused on one responsibility.
- Prefer standard Next.js, React and browser capabilities.
- Avoid additional dependencies unless justified.

Use functional React components and follow established React and
Next.js conventions.

Use server components where appropriate and client components
where interactivity requires them.

Do not introduce performance optimisations without a clear need.

## 5. Architecture and Data

Use the Next.js App Router and the existing project conventions.

Keep responsibilities understandable:
- Data types describe the supplied data.
- API routes handle API requests.
- Reusable utilities contain appropriate data transformations.
- Components present information and manage relevant interaction.

Keep the provided exercise data faithful to the source.
Do not silently change identifiers or invent product information.

Avoid duplicating business logic unnecessarily.

## 6. Development Workflow

Development follows eight independently reviewed stories,
ST-01 through ST-08.

For every story:
1. Inspect the current implementation.
2. Implement only the requested story.
3. Keep changes focused and proportional.
4. Run appropriate checks.
5. Explain the changes in a completion report.
6. Stop and await manual acceptance.

Do not implement future stories without explicit instruction.

Do not perform unrelated refactoring or speculative improvements.

The developer owns all Git operations:
- Do not create branches.
- Do not commit changes.
- Do not push to remotes.
- Do not merge branches.

Do not deploy without explicit instruction.

## 7. Testing and Validation

Run the smallest appropriate set of checks for the story.

Use existing package scripts for linting, type checking,
testing and production builds where available.

Do not repeatedly rebuild or retest unchanged code without reason.

Do not claim tests passed unless they were actually executed.

Report any test limitations or failures clearly.

Leave browser-based visual and interaction acceptance to the developer,
but provide practical manual testing instructions.

## 8. Completion Reports

At the end of each story, provide:

### Summary
A concise explanation of what was implemented.

### Files Changed
List significant files and their purposes.

### Implementation Explanation
Explain important design decisions, React/Next.js concepts,
data flow and any less-obvious code.

Assume the developer is an experienced C#/.NET engineer
learning the Next.js and React ecosystem.

Where helpful, briefly relate unfamiliar concepts to
equivalent or similar .NET concepts.

### Validation
List commands actually executed and their PASS/FAIL results.

### Manual Testing
Describe exactly what the developer should inspect or test.

### Limitations
Identify known issues, assumptions and deliberately deferred work.

### Story Status
State whether the requested implementation is complete
and ready for developer acceptance.

Do not begin the next story.

## 9. Time and Scope Discipline

This assessment has a limited development budget.

Prefer delivering a clear, working implementation over
adding optional features or architectural enhancements.

If an improvement is outside the current story, mention it
briefly in the completion report rather than implementing it.

Avoid generating excessive documentation or additional files
unless explicitly requested.
