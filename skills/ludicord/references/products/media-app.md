# Media App Product Profile

Activate when watching, listening, browsing, presenting, or controlling media
is the main experience.

## Rules

- The media surface is primary; controls and metadata support it.
- Design for interruption, loading, unavailable media, and compact/minimized
  Activity layouts.
- Shared playback is collaborative/realtime capability, not game architecture.
- Do not add scoring, rounds, matchmaking, or game HUD concepts unless the
  media experience intentionally includes gameplay.
- Avoid large dashboard shells that reduce the media viewport without a clear
  product reason.

## Shared media

If multiple participants control or synchronize playback, define:

```text
controller policy
authoritative playback position
seek/play/pause ordering
late join behavior
reconnect behavior
```

Use realtime guidance only if synchronization is required.
