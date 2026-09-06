# Package distribution and automated releases

> Documentation for Ludicord 3.0.0. See [release status](../releases/README.md).

Ludicord uses a two-stage release pipeline so its public package links and npm provenance are correct without publishing the original TypeScript implementation.

## Public source links and trusted publishing

- Both npm packages use this repository for `homepage`, `repository`, issues and release records.
- Package directories are `packages/ludicord` and `packages/create-ludicord-app`.
- The public directories contain package metadata and README files. They do not contain the original TypeScript implementation.
- npm publishing runs in this public repository through a workflow-bound OIDC identity. No long-lived npm publishing token is stored.
- Public provenance links each npm tarball to the public workflow and staged release payload that published it.

## Automated release flow

1. A matching version change in the maintained packages starts the private build and test pipeline.
2. The pipeline installs the locked dependency graph, builds packages/examples, typechecks and runs the framework, generator and release regression suites.
3. An explicit file policy rejects source maps, original source, dependencies, hidden files, path traversal and credential-like content.
4. Only the approved npm tarballs, package metadata, package READMEs and public release notes are staged in this repository.
5. The public `publish.yml` workflow validates the tarballs again and publishes both packages using npm trusted publishing with provenance.
6. Registry integrity is verified before the public changelog, package records, tag and GitHub release are created.
7. After the public release is visible, a Discord Components V2 card announces the `ludicord` framework release and links to its changelog.

Every package change requires a new aligned stable version because npm versions are immutable. Re-running a release is safe only when the registry integrity exactly matches the staged tarballs; the workflow refuses different bytes or a backwards `latest` move.

## Public and private boundaries

The npm packages necessarily expose compiled JavaScript and TypeScript declarations. The public release payload stores those same distributable bytes so trusted publishing can identify this repository honestly. Original TypeScript, source maps, private applications, credentials, environment files and private Git history remain excluded.

The Discord webhook credential stays in a protected repository secret. Release messages allow only the configured release-role mention and do not include credits or private metadata.

[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) · [Release history](../CHANGELOG.md) · [Security](security.md)
