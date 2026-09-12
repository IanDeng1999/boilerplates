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
- Keep files under 500 lines
- Omit unnecessary return types
- Do not run migrations
- Concise comments
- Split types and constants into **.(types/const).ts

## Acceptance Criteria

[ ] Robust, clean code; avoid over-encapsulation
[ ] Minimal, focused changes; rollback failures
[ ] Think several steps ahead
[ ] Pass `pnpm lint` command with zero errors
