# AGENTS.md

This repository is a Svelte 5 + Tailwind CSS v4 project. For Svelte, your training data is outdated, the docs are the source of truth.
docs: `https://svelte.dev/docs/kit/llms-small.txt`

- Package manager: `bun`
- UI baseline includes shadcn-svelte (`src/lib/components/ui`).

## Expected Workflow for Agents

1. Make minimal, focused changes.
2. Preserve existing architectural style.

## Code Style Guidelines

### Imports and Modules

- Prefer ESM imports.
- Keep imports at file top.
- Order imports by: external packages, then internal aliases/relative paths.

### TypeScript and Types

- Prefer explicit exported types for component props and utility contracts.
- Avoid `any`; if unavoidable, keep it tightly scoped and documented.

### Naming Conventions

- Svelte component files: `PascalCase.svelte`.
- Utility functions/variables: `camelCase`.
- Exported type names: `PascalCase`.

### Tailwind

- Avoid arbitrary values: clamp, min(...), custom pixel brackets, and custom breakpoints.
- Use theme-token color utilities (background, foreground, primary, etc.) over standard palette classes (white, gray, black).

### Accessibility and UX Safety

- Preserve semantic HTML structure.
- Ensure color contrast remains acceptable when adjusting theme tokens.

## File/Change Hygiene

- Do not add new dependencies unless needed for the task.
- Do not edit generated artifacts unless the task explicitly requires it.
- Keep diffs small and task-focused.
