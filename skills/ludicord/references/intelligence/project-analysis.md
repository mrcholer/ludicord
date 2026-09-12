# Project Analysis

Inspect before editing. The goal is to understand what the project already is,
not to replace it with a preferred template.

## Required inspection for an existing Ludicord project

Read the smallest set that establishes the current architecture:

1. `package.json` — installed Ludicord version, package manager, scripts,
   dependencies, styling/tooling choices.
2. `ludicord.config.mjs` — framework configuration and declared boundaries.
3. `ludicord.generated.d.ts` — discovered embed/API/WS routes and parameter
   maps. Never infer routes when this file exists.
4. `app/pages.tsx` — persistent Activity root and long-lived providers/state.
5. Relevant `app/embeds/**`, `app/api/**`, and `app/ws/**` files for the task.
6. Shared `components/`, `lib/`, styles, state modules, tests, and data helpers
   used by those routes.
7. Existing automatic files only when the task touches them.

## Build a project snapshot

Before implementation, know these facts internally:

```yaml
project:
  mode: existing | greenfield
  ludicord_version:
  package_manager:
  styling:
  primary_product_profile:
  route_shape:
  state_shape:
  server_shape:
  persistence_shape:
  test_shape:
  existing_design_language:
  constraints:
```

Do not invent values. Mark unknown facts as unknown until inspected.

## Preserve project decisions

Unless the request requires a change, preserve:

- package manager;
- TypeScript strictness and module style;
- Tailwind vs plain CSS vs existing styling system;
- component naming and folder organization;
- existing API/WS ownership boundaries;
- persistence technology;
- test framework;
- visual language and interaction patterns;
- current product profile.

A feature request is not permission to migrate frameworks, add a design system,
replace state management, or reorganize unrelated directories.

## Greenfield projects

For a new project, infer the simplest architecture that satisfies the request.
Do not pre-install optional systems. Start with:

```text
product profile
→ required capabilities
→ Ludicord primitives
→ files needed now
```

Not:

```text
all possible infrastructure
→ all possible routes
→ all possible stores
→ user feature somewhere inside
```

## Architecture drift check

Before finishing, ask:

- Did the change preserve the original product unless the user requested a
  redesign?
- Did an implementation detail accidentally become the architecture?
- Were unrelated files or dependencies introduced?
- Was an existing pattern replaced without a concrete reason?
