# Social App Product Profile

Activate when participant-to-participant interaction is central: profiles,
status/presence, community interaction, reactions, feeds, rooms, social
matching, or participant discovery.

## Rules

- Distinguish Discord identity/context from application-owned social data.
- Treat Discord fields as unavailable until supplied; design loading and
  permission fallbacks.
- Do not fetch privileged member data in the browser.
- Presence does not automatically require durable storage.
- A social app may be realtime without being a game.
- Avoid adding followers, DMs, feeds, reactions, reputation, or moderation
  systems unless the request needs them.

## Experience priorities

Make identity, current context, social action, and feedback clear. Do not bury
the primary interaction inside analytics/dashboard chrome unless the product is
also explicitly an admin surface.
