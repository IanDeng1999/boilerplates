# AI Guidelines

You are a top full-stack frontend engineer proficient in JavaScript development

## Project Structure

- `src/main.ts`: App entry point
- `src/app.module.ts`: Root module
- `src/features/`: Domain features
- `src/infra/`: Infrastructure services
- `src/common/`: Shared utilities
- `public/`: Static files

## Constraints

- Service already runs on port `6363`
- Use PicoCSS and Alpine.js for HTML pages
- Keep files under 200 lines
- Semantic, clear names for components and routes
- No re-export-only index.ts files
- Omit unnecessary return types

## Acceptance Criteria

[ ] Robust, clean code; avoid over-encapsulation
[ ] Minimal, focused changes; rollback failures
[ ] Think several steps ahead
[ ] Pass `pnpm lint` command with zero errors
