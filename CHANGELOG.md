# Release history

## 2.2.5 — September 4, 2026

## Project creator

- Choose Tailwind CSS interactively when creating a project.
- Use `--tailwind` or `--no-tailwind` in scripts and automated setup.
- Start from a polished responsive interface with either Tailwind CSS or plain CSS.

## Package and documentation experience

- Added the Ludicord banner and live package badges to both npm package pages.
- Pointed package home, source, issues and release links to the public Ludicord repository.
- Added public package metadata snapshots, an LLM documentation index and agent instructions.
- Added a reusable Ludicord skill that teaches coding agents the framework's conventions, security boundaries and validation workflow.

## Release delivery

- Public npm trusted publishing now runs from the public repository with provenance.
- Private builds hand off only approved compiled tarballs, declarations and public notes; original TypeScript and private application code remain excluded.
- Version changes automatically stage the public payload, publish both packages, verify integrity, update the changelog and package records, and create matching public and maintainer releases.
- Discord announcements now use Components V2 with a role mention, branded container, changelog button and install command.

[GitHub release](https://github.com/mrcholer/ludicord/releases/tag/v2.2.5) · [ludicord on npm](https://www.npmjs.com/package/ludicord/v/2.2.5) · [creator on npm](https://www.npmjs.com/package/create-ludicord-app/v/2.2.5)


Verified against npm on September 4, 2026. Times are UTC. The packages have separate publication histories.

[GitHub release records](https://github.com/mrcholer/ludicord/releases) mirror this published-version list. GitHub records were created for this documentation repository; their creation dates are not the original npm publication dates, and their archives contain only documentation.

## 2.2.4 — September 4, 2026

Both packages are published at 2.2.4 through GitHub Actions trusted publishing.

Read the [changes and limitations](releases/2.2.4.md) and [upgrade guide](docs/migration.md).

## ludicord

| Version | npm publication (UTC) | Status |
| --- | --- | --- |
| [2.2.4](https://www.npmjs.com/package/ludicord/v/2.2.4) | 2026-09-04 17:57:43 | Current latest |
| [2.2.1](https://www.npmjs.com/package/ludicord/v/2.2.1) | 2026-09-04 12:03:18 | Historical |
| [2.2.0](https://www.npmjs.com/package/ludicord/v/2.2.0) | 2026-09-03 12:49:49 | Historical |
| [2.1.0](https://www.npmjs.com/package/ludicord/v/2.1.0) | 2026-09-02 11:39:29 | Historical |

## create-ludicord-app

| Version | npm publication (UTC) | Status |
| --- | --- | --- |
| [2.2.4](https://www.npmjs.com/package/create-ludicord-app/v/2.2.4) | 2026-09-04 17:57:47 | Current latest |
| [2.2.3](https://www.npmjs.com/package/create-ludicord-app/v/2.2.3) | 2026-09-04 12:04:52 | Historical |
| [2.2.2](https://www.npmjs.com/package/create-ludicord-app/v/2.2.2) | 2026-09-03 13:50:52 | Historical |
| [2.2.1](https://www.npmjs.com/package/create-ludicord-app/v/2.2.1) | 2026-09-03 13:09:52 | Historical |
| [2.2.0](https://www.npmjs.com/package/create-ludicord-app/v/2.2.0) | 2026-09-03 12:54:07 | Historical |
| [2.1.0](https://www.npmjs.com/package/create-ludicord-app/v/2.1.0) | 2026-09-02 11:40:11 | Historical |

Detailed per-version notes for these historical publications were not recorded here; no feature changes are inferred from version numbers.

## Check current registry status

```bash
npm view ludicord version
npm view create-ludicord-app version
npm view ludicord versions --json
npm view create-ludicord-app versions --json
```

Documentation updates and GitHub release notices do not publish npm packages.
