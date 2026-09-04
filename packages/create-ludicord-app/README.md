<p align="center">
  <a href="https://github.com/mrcholer/ludicord"><img src="https://raw.githubusercontent.com/mrcholer/ludicord/main/.github/assets/ludicord-banner.png" alt="Ludicord" width="900" /></a>
</p>

<h1 align="center">create-ludicord-app</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/create-ludicord-app"><img alt="npm version" src="https://img.shields.io/npm/v/create-ludicord-app?style=flat-square&color=5865F2" /></a>
  <a href="https://www.npmjs.com/package/create-ludicord-app"><img alt="npm downloads" src="https://img.shields.io/npm/dm/create-ludicord-app?style=flat-square&color=00B0F4" /></a>
  <img alt="Tailwind CSS optional" src="https://img.shields.io/badge/Tailwind-optional-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Node.js 20.19 or newer" src="https://img.shields.io/badge/node-%3E%3D20.19-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
</p>

Create a complete Ludicord Discord Activity project.

```bash
npx create-ludicord-app my-activity
npx create-ludicord-app my-activity --tailwind
npx create-ludicord-app my-activity --no-tailwind
npx create-ludicord-app my-activity --package-manager pnpm --no-install
```

The interactive generator asks whether to include Tailwind CSS. Scripts can use `--tailwind` or `--no-tailwind`; non-interactive runs retain Tailwind by default for compatibility. Both starters include a polished responsive interface.

The generator creates the Activity root, starter embeds, auth UI states, strict TypeScript configuration, environment templates, production scripts, mobile safe-area CSS, and typed route bootstrap files. Add API and WebSocket routes when your Activity needs them. It refuses to overwrite a non-empty target directory.

Read the [documentation](https://github.com/mrcholer/ludicord/blob/main/docs/README.md), [release history](https://github.com/mrcholer/ludicord/blob/main/CHANGELOG.md), or [report an issue](https://github.com/mrcholer/ludicord/issues). The public repository contains documentation, package metadata and approved release distributions, not the original TypeScript implementation.
