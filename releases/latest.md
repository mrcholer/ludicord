# Latest Ludicord release

The latest synchronized public release is **Ludicord 4.0.1**, published for both `ludicord` and `create-ludicord-app`.

## Install

Create a new Activity:

```bash
npx create-ludicord-app@latest my-activity
```

Update an existing Activity:

```bash
npm install ludicord@4.0.1
```

Use the equivalent command for the project's existing package manager and commit the updated lockfile.

## Release summary

Ludicord 4.0.1 fixes Discord Activity startup when the initial iframe navigation does not include an `Origin` header. It also makes the effective Discord application ID consistent across the browser SDK, HTTP routes, authentication, and WebSockets.

## Release records

- [Ludicord 4.0.1 notes](v4/4.0.1.md)
- [Ludicord v4 archive](v4/README.md)
- [Published package links](published.md)
- [Migration guide](../docs/migration.md)
- [Machine-readable compatibility data](../types/README.md)

The npm registry is authoritative for installable versions. Features planned for a later release are not part of 4.0.1 until matching packages are published.
