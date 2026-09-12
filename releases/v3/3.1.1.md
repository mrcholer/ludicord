# Ludicord 3.1.1

Ludicord 3.1.1 refreshes the generated application so a new Discord Activity starts from a polished, production-shaped interface instead of a generic demo grid.

## Generated application design

- Rebuilt the starter around a responsive Activity canvas with a clear visual hierarchy, compact sticky navigation, safe-area support, and a focused mobile layout.
- Added an intentional hero, live connection state, runtime topology visualization, realtime metrics, server-health feedback, and practical extension points.
- Redesigned the profile embed to present verified Discord identity data with useful browser-preview fallbacks.
- Added active navigation states driven by the current Ludicord embed path.
- Kept Tailwind CSS and plain CSS generation at feature parity, with no external image or icon dependency.
- Preserved the existing authenticated API, WebSocket audience example, Activity-instance participant data, and production build workflow.

## Compatibility

- This is a backward-compatible patch release for Ludicord 3.1 applications.
- Existing applications are not restyled automatically. Generate a new app with `create-ludicord-app@3.1.1` to use the refreshed starter.
- Generated projects continue to expose only `dev`, `build`, and `start` as package scripts. Advanced framework commands remain available through the installed Ludicord CLI.
