# Installation

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


Node.js 20.19 or newer is required. A new project is the simplest installation:

```bash
npx create-ludicord-app my-activity
```

Choose a package manager explicitly when needed:

```bash
npx create-ludicord-app my-activity --package-manager pnpm
npx create-ludicord-app my-activity --package-manager npm --no-install
```

To add Ludicord to an existing React project:

```bash
pnpm add ludicord react react-dom
pnpm add -D typescript @types/node @types/react @types/react-dom
```

Add scripts for `ludicord dev`, `ludicord build`, and `ludicord start`, then create `app/pages.tsx` and at least one `app/embeds/<name>/embed.tsx`. `ludicord doctor` reports missing files, credentials, weak session secrets, stale builds, and unsafe client output.
