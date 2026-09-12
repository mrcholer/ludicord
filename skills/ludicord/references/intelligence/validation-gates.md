# Validation Gates

Do not equate "build passed" with "product is correct". Validate in layers.

## Gate 1 — Product fidelity

- Does the result still match the requested product type?
- Did the implementation accidentally become a dashboard, game, landing page,
  or generic SaaS shell that the user did not ask for?
- Is the primary user outcome obvious and direct?
- Did optional technology drive the UX instead of the product need?

## Gate 2 — Scope

- Are all added subsystems required?
- Are there unused abstractions, routes, state stores, or dependencies?
- Were unrelated files changed?
- Were future ideas kept out of current implementation?

## Gate 3 — State and authority

- Is local UI state local?
- Is shared state actually shared by the required scope?
- Is durable state stored durably?
- Are trusted decisions enforced on the server when required?
- Are reconnect/duplicate/stale-update cases covered when realtime state needs
  them?

## Gate 4 — Ludicord correctness

Use the canonical references:

- [`../embeds-navigation.md`](../embeds-navigation.md)
- [`../server-routes.md`](../server-routes.md)
- [`../react-state.md`](../react-state.md)
- [`../discord-data.md`](../discord-data.md)
- [`../auth-security.md`](../auth-security.md)
- [`../validation.md`](../validation.md)

Verify discovered routes, generated types, server/client boundaries, automatic
files, and installed-version APIs.

## Gate 5 — Security

- No client secret, bot token, or server-only credential in browser code.
- Do not trust client-supplied identity.
- Validate request/event payloads and authorization.
- Do not expose production stacks or filesystem paths.

## Gate 6 — Product-specific behavior

Load only the relevant profile:

- dashboard: workflows, loading/error/empty states, destructive actions;
- collaborative: conflict/reconnect/shared-artifact correctness;
- media: playback/control lifecycle and interruption behavior;
- utility: direct completion and invalid-input behavior;
- game: use [`../game/testing.md`](../game/testing.md).

## Gate 7 — Runtime/build

Follow [`../validation.md`](../validation.md). Runtime-changing work is not done
from typechecking alone. Run the production build and test in the Discord frame
when the feature depends on Discord-specific behavior.
