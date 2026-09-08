# Installation

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).


Node.js 20.19 or newer is required. A new project is the simplest installation:

```bash
npx create-ludicord-app my-activity
```

Choose a package manager explicitly when needed:

```bash
npx create-ludicord-app my-activity --package-manager pnpm
npx create-ludicord-app my-activity --package-manager npm --no-install
npx create-ludicord-app my-activity --tailwind
npx create-ludicord-app my-activity --no-tailwind
```

Interactive creation asks whether to include Tailwind CSS. Without Tailwind, the generated Activity uses a responsive plain-CSS theme and does not install Tailwind dependencies.

To add Ludicord to an existing React project:

```bash
pnpm add ludicord react react-dom
pnpm add -D typescript @types/node @types/react @types/react-dom
```

Add scripts for `ludicord dev`, `ludicord build`, and `ludicord start`, then create `app/pages.tsx` and at least one `app/embeds/<name>/embed.tsx`. Use `ludicord routes` to inspect discovery, `ludicord info` for project details, and `ludicord build` for the production validation and client-secret scan.
