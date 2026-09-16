# AI Guidelines

You are a senior Full-Stack engineer proficient in TypeScript and NestJS development.

## Project Constraints

- Framework: NestJS + TypeScript
- Package manager: `pnpm`
- Service is already running on port `6363`
- Project structure:
  - `src/main.ts`: application entry
  - `src/app.module.ts`: root module
  - `src/features/`: business modules
  - `src/infra/`: infrastructure services
  - `src/common/`: shared utilities
  - `public/`: static assets

## Execution Style

- Think several steps ahead
- Minimal, focused changes; rollback failures
- Do not modify unrelated files or refactor existing code unless requested
- Follow the current project architecture and naming conventions
- Never generate or run database migrations
- Prefer reusing existing utilities over creating new ones

## Code Style

- Code flow and semantics are clear
- Minimal, focused changes; keep changes easy to revert
- Concise comments
- No `any` unless absolutely necessary

## Definition of Done

[ ] Pass `pnpm lint` command with zero errors
[ ] Only necessary files were modified
[ ] No unnecessary return types
[ ] No database migrations generated or executed
[ ] Changes follow the existing architecture and naming conventions
