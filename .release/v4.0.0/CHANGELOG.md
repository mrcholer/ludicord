# Ludicord 4.0.0

Ludicord 4.0 introduces unified file-system routing and automatic development recovery while retaining the existing Discord, authentication, realtime and production architecture.

## Bundled docs and AI skills

- Ships version-matched guides in `dist/docs/`, skills in `dist/skills/ludicord/`, and package agent instructions.
- Agent instructions, guides, and skills live only under the npm package's `dist/`; generated projects do not receive extra root agent files.
- AI guidance defaults to one root with embeds; prefixes require project scale or a concrete independent-surface requirement.
- Release checks validate documentation links and required resources in the installed tarball.

## Unified file-system router

- Discover page.tsx, route.ts, socket.ts and embed.tsx throughout app/.
- Enforce one route type per directory and reject ambiguous public route patterns.
- Match static, nested and dynamic page, HTTP and socket paths.
- Resolve each embed against its nearest ancestor page and inherit page parameters.
- Use plain pages with an automatic Activity boundary, or explicit boundaries for local embed defaults.
- Keep legacy pages.tsx trees supported while providing an explicit migration path.
- Preserve compatible state during page, embed, component and CSS Fast Refresh.
- Regenerate route manifests/types after additions, deletions, renames and moves.
- Rebuild HTTP/socket modules in place and close stale sockets with code 1012.
- Use the new Ludicord logo in the development error badge and package headers.

## Navigation and generated types

- Added `PrefixLink` for accessible links between Activity pathname scopes.
- Added `prefixHref(prefix, embed?)` for typed full URL generation.
- Added `useActivityPrefix()` for the concrete pathname and `usePageParams()` for typed dynamic page parameters.
- Generated declarations now include the prefix union and embeds owned by each prefix.
- Existing root embed types remain available as compatibility aliases.

## Project-root imports

- Added configurable `imports.aliases` mappings to client compilation.
- Added the same alias map to API, WebSocket, instrumentation, and proxy server bundles.
- Generated applications configure `@/components`, `@/lib`, and root `@` mappings plus matching TypeScript `baseUrl` and `@/*` paths automatically.
- Starter imports now use `@/components/...` and `@/lib/...` instead of depth-sensitive relative paths.

## Generated application

- Carries forward the 3.1.1 Activity-canvas starter with a responsive visual hierarchy, sticky navigation, mobile safe areas, and accessible active states.
- Presents runtime topology, Activity-instance participants, global and channel presence, and authenticated API health without turning the starter into a product-specific template.
- Includes a focused Discord identity screen with useful browser-preview fallbacks.
- Keeps Tailwind CSS and plain CSS output at feature parity with no external image or icon dependency.
- Uses the V4 alias map throughout generated components so deeply nested prefix embeds do not require traversal imports.

## Development lifecycle

- The HTTP listener starts before initial source validation.
- Local and network URLs are announced before compilation errors.
- Initial structural errors keep the development server alive.
- Invalid projects receive a styled 503 diagnostics document at Activity paths.
- Fixing the source triggers manifest regeneration and automatic recovery without changing the port.
- Startup output includes a PAGE/HTTP/SOCKET/EMBED route table for every discovered scope.
- Route inspection and project information include recursive prefix ownership.

## Diagnostics interface

- Rebuilt the development error panel with a clearer hierarchy and documentation-aligned colors.
- Header and actions remain fixed while diagnostic content scrolls.
- Source excerpts and call stacks provide independent horizontal overflow.
- Vertical and horizontal native scrollbars are visually hidden without disabling scrolling.
- Error codes can link to the matching documentation guide when `LUDICORD_DOCS_ORIGIN` is configured.
- Retry, copy, source opening, keyboard issue navigation, automatic recovery, redaction, and Shadow DOM isolation remain supported.

## Build and manifests

- Production build schema advances to version 4.
- Added `.ludicord/manifests/prefix-manifest.json`.
- Build summaries list every prefix and scoped embed.
- Production serves all static and dynamic manifest page paths through one runtime.
- Client-secret scanning, atomic output replacement, API/WebSocket bundling, and sanitized production errors remain intact.

## Discord Activity origin policy

- `server.allowedOrigins` now defaults to `"discord-activity"` in the framework rather than being repeated by generated applications.
- The default accepts normal same-origin calls and this application's exact `https://<clientId>.discordsays.com` Activity proxy origin for both HTTP and WebSocket traffic.
- The proxy hostname is derived from `discord.clientId` or `LUDICORD_DISCORD_CLIENT_ID`; Ludicord does not allow a wildcard for other applications on `discordsays.com`.
- Explicit policies remain supported. Use `"same-origin"` for a strict host-only policy. Arrays must include both `"same-origin"` and `"discord-activity"` when retaining both built-in policies alongside another trusted HTTPS caller.

## Compatibility

- Existing V3 applications with only `app/pages.tsx` and `app/embeds/` remain valid.
- Additional page scopes are optional and should be justified by project scale or a concrete requirement.
- Unified routing and legacy directory conventions must not be mixed.
- Applications should use generated prefix and embed types rather than handwritten route unions.
- V4 requires Node.js 20.19 or newer and supports React 18.3 through React 19.

## Validation

- Recursive scanner and manifest generation tests.
- Development and production requests for root and six nested prefix paths.
- Generated prefix, scoped-embed, and parameter declaration tests.
- Listener-first failure and source-recovery tests.
- Client and server custom-alias compilation tests, including project-boundary validation.
- Package build, strict TypeScript, lint, production build, and tracked framework test suite.

Read the full [Prefix Router guide](https://github.com/mrcholer/ludicord/blob/main/docs/prefix-router.md) and [migration guide](https://github.com/mrcholer/ludicord/blob/main/docs/migration-v4.md). The npm registry remains authoritative for package installability.
