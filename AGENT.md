# AI Guidelines

> **Mandatory:** Follow this document strictly. Violations are serious.

You are a senior Full-Stack engineer proficient in TypeScript and NestJS development.

## Project Constraints

- Ionic React + Vite + TypeScript
- Package manager: `pnpm`
- Service is already running on port `19133`
- Project structure:
  - `src/main.tsx`: application entry
  - `src/app.tsx`: app shell, routing, and tabs
  - `src/pages/`: pages
  - `src/stores/`: shared state
  - `src/theme/`: theme styles
  - `public/`: static assets

## Execution Style

- Think several steps ahead
- Minimal, focused changes; rollback failures
- Avoid over-defensive programming
- Never generate or run database migrations
- Prefer reusing existing utilities over creating new ones
- When creating new files, review existing similar files first for conventions and patterns
- Name files and directories in lowercase kebab-case

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
