# AGENTS.md

Svelte 5 + Tailwind CSS v4 project. For Svelte, your training data is outdated, the docs are the source of truth.
docs: `https://svelte.dev/docs/kit/llms-small.txt`

- Package manager: `bun`
- prefer shadcn-svelte for ui (`src/lib/components/ui`).

## Expected Workflow for Agents

- Make minimal, focused changes.
- Preserve existing architectural style.
- Before adding helper functions, check if they already exist
- Avoid tiny helper files/functions for one-off logic
- Avoid useless one-line wrappers; call or export the real function directly.
- Optimize for readability and safe future changes over minimizing line count
- Keep functions small and focused on one decision or operation
- Prefer clear sequencing, guard clauses, and early returns over clever compact code
- Keep nesting shallow; avoid more than two levels of nested control flow
- Replace long `if`/`else if` chains and large inline booleans with named helpers or discriminated outcomes when clearer
- Preserve useful existing comments during refactors; do not delete comments just because code moved.
- Update comments when behavior changes so they stay accurate.

## Code Style Guidelines

### Components and pages

- Extract major or self-contained UI sections into separate component files instead of growing a single large component file
- Group related setup/state in clear sections instead of dumping many $state and $derived together.
- Use short section comments for state groups, refs, actions, and derived values when a component has several related concerns.
- Add short comments before `$effect` blocks that explain what the effect does, especially in large components or pages.

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
- Do not add classes that already exist in the component

### Accessibility and UX Safety

- Preserve semantic HTML structure.
- Ensure color contrast remains acceptable when adjusting theme tokens.

