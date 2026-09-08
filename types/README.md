# Ludicord compatibility records

This directory gives tools and coding agents a small machine-readable index of the public TypeScript surface shipped by each retained release payload.

- [`latest.json`](latest.json) mirrors the latest synchronized public release.
- [`v3/`](v3/) contains Ludicord 3 records.
- [`v2/`](v2/) contains retained Ludicord 2 records.
- [`schema.json`](schema.json) defines the record format.

Each record lists package versions, supported typed import specifiers, Node.js and React requirements, and generated project declaration files. It does not duplicate the package's `.d.ts` files.

## Authority order

When implementing an Activity, use this order:

1. The exact `ludicord` version installed in the Activity.
2. Its exported declaration files and editor completion.
3. The generated `ludicord.generated.d.ts` route registry.
4. The matching record in this directory for discovery and compatibility checks.

Never import `ludicord/internal` in application code even if an older package exposes it. That path is compiler-owned and unsupported.

Historical records are included only when an approved public release payload is retained in `.release/`; the npm registry remains authoritative for installability.
