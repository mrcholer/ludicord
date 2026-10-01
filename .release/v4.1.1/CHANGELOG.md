# Ludicord 4.1.1

Ludicord 4.1.1 improves Activity opening behavior and makes repeat openings reuse production assets safely.

## Activity startup

- Show an accessible loading shell in the initial HTML before client modules finish downloading.
- Start the selected page import alongside its layout, loading component, and metadata.
- Load unopened embeds' layouts and optional error, sign-in, not-found, and minimized screens on demand.
- Preserve shared embed layout state during hash navigation and respect custom loading screens.
- Replace failed startup imports with a safe reload screen and prevent stale mounts after entry disposal.
- Record local browser startup timings for page imports, Discord initialization, authentication, and React commits, without sending telemetry.

## Production caching

- Cache compiler-emitted hashed assets for one year with immutable caching and HTTP validators.
- Revalidate HTML and mutable public files so deployments and runtime configuration stay current.
- Keep authenticated responses and failures uncached by default, while preserving explicit API cache policies.
- Return an uncached 404 for missing compiled assets and retain conservative caching for older builds.

Release announcements now require an explicit workflow opt-in. Read [startup measurements](https://ludicord.extra.codes/docs/development#startup-measurements), [page loading](https://ludicord.extra.codes/docs/pages#automatic-ui), and [production caching](https://ludicord.extra.codes/docs/deployment) for details.
