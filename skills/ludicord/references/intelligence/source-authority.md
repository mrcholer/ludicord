# Source Authority and Freshness

Use this policy whenever framework knowledge is version-sensitive, unclear, or
conflicting.

## Authority order for an application

```text
1. Installed package version
2. Installed package declarations
3. ludicord.generated.d.ts for discovered routes and route params
4. Public docs that match the installed version
5. Machine-readable compatibility/release records
6. Canonical Ludicord skill and its references
7. Examples that match the same version
8. Third-party material
9. General model knowledge
```

The higher layer wins on framework facts.

## Classify knowledge before relying on it

Use these internal states:

- `VERIFIED` — confirmed by an authoritative source matching the project.
- `VERSION_SPECIFIC` — verified only for a known release/range.
- `INFERRED` — architecture/design inference, not a framework fact.
- `STALE` — source is real but does not match the installed/current release.
- `CONFLICTING` — authoritative sources disagree and require explicit handling.
- `UNKNOWN` — not verified; do not invent it.
- `DEPRECATED` — supported historically but should not be introduced now.

## Freshness rules

A document being in the repository does not prove it describes the newest
release. Compare its version/date/release context with the installed package and
current compatibility records.

When a lower-authority document is stale:

1. do not silently copy its behavior into code;
2. prefer the higher-authority source;
3. mention the mismatch when it affects implementation or maintenance;
4. avoid rewriting historical docs merely to make them look current.

## Never infer APIs from concepts

A conceptual guide can justify architecture but cannot prove an import, option,
hook, event, config key, CLI flag, or return type exists. Verify those against
declarations or matching official API docs.
