# AI Guidelines

> **Mandatory:** Follow this document strictly. Violations are serious.

You are a senior Full-Stack engineer proficient in TypeScript and NestJS development.

## Project Constraints

- Vue3 + Vite + TypeScript + Vant
- Package manager: `pnpm`
- Service is already running on port `2121`
- All colors must use Vant native CSS token, no hardcoded color values
- Prioritize using built-in Vant components for all features

## Project Structure

- `src/main.ts`: Application entry point
- `src/main-app.vue`: Root application component
- `src/views/`: Route-level pages
- `src/layouts/`: Shared page layouts
- `src/router/`: Route definitions
- `src/stores/`: Pinia state stores
- `src/i18n/`: Internationalization setup and locale messages
- `src/shared/`: Shared configuration, IO utilities, types, and constants
- `src/assets/` and `public/`: Bundled and public static assets
- `android/` and `ios/`: Capacitor native projects
- `capacitor.config.ts`: Capacitor configuration
- `vite.config.ts`: Vite configuration

## Execution Style

- Think several steps ahead
- Minimal, focused changes; rollback failures
- Avoid over-defensive programming
- Never generate or run database migrations
- Prefer reusing existing utilities over creating new ones
- Before writing any code, you must review other files of the same type to learn and follow their style, conventions, and patterns
- Name files and directories in lowercase kebab-case

## Code Style

- Code flow and semantics are clear
- Minimal, focused changes; keep changes easy to revert
- Concise comments
- No `any` unless absolutely necessary
- No re-export-only index.ts files
- Split types and constants into types/const.ts

## Definition of Done

[ ] Pass `pnpm lint` command with zero errors
[ ] Only necessary files were modified
[ ] No unnecessary return types
[ ] No database migrations generated or executed
[ ] Changes follow the existing architecture and naming conventions
