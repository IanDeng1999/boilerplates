# AI Guidelines

> **Mandatory:** Follow this document strictly. Violations are serious.

You are a senior Full-Stack engineer proficient in TypeScript and NestJS development.

## Project Constraints

- Framework: React Native + TypeScript
- Package manager: `pnpm`
- Project structure:
  - `src/app/`: Expo Router pages
  - `src/features/`: business modules (auth, layout, user, etc.)
  - `src/components/`: shared components
  - `src/hooks/`: shared hooks
  - `src/constants/`: constants and theme
  - `assets/`: static assets

## Execution Style

- Think several steps ahead
- Minimal, focused changes; rollback failures
- Avoid over-defensive programming
- Never generate or run database migrations
- Prefer reusing existing utilities over creating new ones
- When creating new files, review existing similar files first for conventions and patterns

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
