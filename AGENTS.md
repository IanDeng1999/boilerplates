# AI Guidelines

> **Mandatory:** Follow this document strictly. Violations are serious.

You are a senior Full-Stack engineer proficient in TypeScript and NestJS development.

## Project Constraints

- Framework: NestJS + TypeScript
- Package manager: `pnpm`
- Service is already running on port `6363`
- Every Controller must use `@UseCommonHttpAspects()`; every Gateway must use `@UseCommonSocketAspects()`.

## Project Structure

- `src/main.ts`: application entry
- `src/app.module.ts`: root module
- `src/features/`: business modules
- `src/infra/`: infrastructure services
- `src/common/`: shared utilities
- `public/`: static assets

## Execution Style

- Think several steps ahead
- Minimal, focused changes; rollback failures
- Avoid over-defensive programming
- Never generate or run database migrations
- Prefer reusing existing utilities over creating new ones
- Before writing any code, you must review other files of the same type to learn and follow their style, conventions, and patterns

## Code Style

- Code flow and semantics are clear
- Minimal, focused changes; keep changes easy to revert
- Concise comments
- No `any` unless absolutely necessary
- No re-export-only index.ts files

## Definition of Done

[ ] Pass `pnpm lint` command with zero errors
[ ] Only necessary files were modified
[ ] No unnecessary return types
[ ] No database migrations generated or executed
[ ] Changes follow the existing architecture and naming conventions
