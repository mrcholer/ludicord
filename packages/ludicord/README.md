<p align="center">
  <a href="https://github.com/mrcholer/ludicord"><img src="https://raw.githubusercontent.com/mrcholer/ludicord/main/.github/assets/ludicord-banner.png" alt="Ludicord" width="900" /></a>
</p>

<h1 align="center">ludicord</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/ludicord"><img alt="npm version" src="https://img.shields.io/npm/v/ludicord?style=flat-square&color=5865F2" /></a>
  <a href="https://www.npmjs.com/package/ludicord"><img alt="npm downloads" src="https://img.shields.io/npm/dm/ludicord?style=flat-square&color=00B0F4" /></a>
  <img alt="Node.js 20.19 or newer" src="https://img.shields.io/badge/node-%3E%3D20.19-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img alt="React 18.3 and 19" src="https://img.shields.io/badge/react-18.3%20%7C%2019-61DAFB?style=flat-square&logo=react&logoColor=111" />
  <a href="https://github.com/mrcholer/ludicord/blob/main/SECURITY.md"><img alt="Security policy" src="https://img.shields.io/badge/security-policy-6D5DFC?style=flat-square" /></a>
</p>

The full-stack React framework and CLI for Discord Activities.

```bash
ludicord dev
ludicord build
ludicord start
```

Public entry points include `ludicord`, `ludicord/config`, `ludicord/navigation`, `ludicord/discord`, `ludicord/auth`, `ludicord/server`, `ludicord/security`, `ludicord/ws/client`, `ludicord/ws/server`, `ludicord/runtime` (client status), `ludicord/runtime/server` (server tooling), and `ludicord/testing`.

See the public [documentation](https://github.com/mrcholer/ludicord/blob/main/docs/README.md), [release history](https://github.com/mrcholer/ludicord/blob/main/CHANGELOG.md), and [issue tracker](https://github.com/mrcholer/ludicord/issues). The public repository contains documentation and release information, not the framework implementation.

Automatic files: `app/layout.tsx`, `loading.tsx`, `error.tsx`, `minimize.tsx`, and `app/auth/{loading,error,denied}.tsx`. Default-export the component and the framework connects it. Embeds use `export default function embed()`.

Development includes API/WS hot updates, TypeScript diagnostics, a Ludicord browser error panel with mapped source locations, and branded compile timing. Production uses safe errors without source disclosure.

Discord helpers include detailed channel/guild hooks, Activity participants, voice/layout events, typed SDK commands, and permission-gated paginated guild members. Full member lists require a server-only bot token and the GUILD_MEMBERS intent.
