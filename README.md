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

Public entry points include `ludicord`, `ludicord/config`, `ludicord/metadata`, `ludicord/navigation`, `ludicord/activity`, `ludicord/discord`, `ludicord/auth`, `ludicord/server`, `ludicord/security`, `ludicord/ws`, `ludicord/ws/client`, `ludicord/ws/server`, `ludicord/runtime` (client status), `ludicord/runtime/server` (server tooling), and `ludicord/testing`.

See the public [documentation](https://github.com/mrcholer/ludicord/blob/main/docs/README.md), [latest release](https://github.com/mrcholer/ludicord/blob/main/releases/latest.md), [machine-readable type compatibility records](https://github.com/mrcholer/ludicord/blob/main/types/README.md), and [issue tracker](https://github.com/mrcholer/ludicord/issues). The public repository contains documentation and approved release information, not the private framework implementation.

Automatic files: `app/metadata.ts`, `proxy.ts`, `instrumentation.ts`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `minimize.tsx`, and `app/auth/{loading,error,denied}.tsx`. Embed folders may also inherit nested `layout.tsx` and nearest `loading.tsx`/`error.tsx`. Route groups such as `(games)` organize embed/API/WS source without changing URLs. Default-export the component or convention object and the framework connects it. Embeds use `export default function embed()`.

Development includes API/WS/proxy hot updates, TypeScript diagnostics, React Strict Mode, a Ludicord browser error panel with mapped source locations, and branded compile timing. Production uses atomic output and safe errors without source disclosure. Advanced tooling is documented in the full guide.

Discord helpers include complete raw user/channel/guild/member/role/participant/event payloads beside convenient normalized fields, Activity participants, voice/layout events, typed SDK commands, verified permission bitfields, channel/role/member resources, and paginated guild members. Full member lists require a server-only bot token and the GUILD_MEMBERS intent.

Activity hooks add scoped persistence, cached queries, lifecycle readiness, raw Discord-event callbacks, presence summaries, animation frames, and revision-safe shared instance state. Use normal React state for local UI and these helpers where Discord Activity behavior needs a framework-owned lifecycle.

Coding agents should begin with [`AGENTS.md`](AGENTS.md) and the canonical [`skills/ludicord/SKILL.md`](skills/ludicord/SKILL.md). Thin adapters support Claude Code, Gemini CLI, GitHub Copilot, Cursor, Google Antigravity, Codex, and Agent Skills-compatible tools without copying framework knowledge into conflicting files.
