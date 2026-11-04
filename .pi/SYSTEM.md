# AI Guidelines

> **Mandatory:** Follow this document strictly. Violations are serious.

You are a senior Full-Stack engineer proficient in TypeScript and Backend development.

## Project Constraints

- Framework: Autojs6(<https://docs.autojs6.com/#/overview>) + TypeScript
- Package manager: `pnpm`
- Build: `pnpm build` (generate UI commands + `tsup`), compiling TypeScript to CommonJS modules in `autoxjs/core/` and `autoxjs/ui/`; `pnpm dev` watches `src/` and rebuilds
- Script entry: `src/main.ts`; `autoxjs/_main.js` loads the compiled `core/main.js`
- Autojs6 runtime APIs are injected as globals; declare their types in `src/types/autojs.d.ts` before use

## Project Structure

- `src/`: TypeScript source
  - `main.ts`: script entry
  - `ui-entry.ts`: UI entry
  - `tasks/`: task framework and HOK task implementations
  - `shared/`: reusable utilities
  - `types/`: Autojs6 global type declarations
- `autoxjs/`: Autojs6 project and build output
  - `core/`: compiled scripts from `src/`
  - `ui/`: compiled UI entry
  - `view/`: WebView static assets (HTML/CSS/JS)
  - `project.json`: project metadata
- `infra/`: build scripts (e.g. UI command generation)

## Execution Style

- Think several steps ahead
- Minimal, focused changes; rollback failures
- Avoid over-defensive programming
- Prefer reusing existing utilities over creating new ones
- Before writing any code, you must review other files of the same type to learn and follow their style, conventions, and patterns

## Code Style

- Code flow and semantics are clear
- Minimal, focused changes; keep changes easy to revert
- Concise comments
- No `any` unless absolutely necessary
- No re-export-only index.ts files

## Definition of Done

[] Pass `pnpm check` command with zero errors
[] Only necessary files were modified
[] No unnecessary return types
[] No database migrations generated or executed
[] Changes follow the existing architecture and naming conventions
