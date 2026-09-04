# Package distribution and automated releases

Ludicord 2.2.4 and create-ludicord-app 2.2.4 are published from a private source repository using GitHub Actions and npm trusted publishing.

## Repository links

- Documentation, issues and public release notes are in this public repository.
- Package `repository.url` identifies the actual private source repository required by npm's trust configuration.
- The framework's `repository.directory` is `packages/ludicord`; the starter's is `packages/create-ludicord-app`.
- The source repository link requires maintainer access. This does not prevent installing the public npm packages.

## Release checks

The release workflow checks version alignment, installs the locked dependencies, builds the packages/examples, typechecks and runs regression tests before publishing. Tarballs are checked against an explicit file policy. The framework is published and verified before the starter; both versions are verified before the Discord announcement.

Original TypeScript implementation, source maps, private apps and environment files are excluded. Compiled JavaScript and type declarations remain public. This does not change package licenses or make shipped JavaScript secret.

npm OIDC uses short-lived workflow-bound credentials rather than a stored npm publishing token. Public provenance is not available from private source repositories. See [npm's trusted-publishing documentation](https://docs.npmjs.com/trusted-publishers/).

Discord release notifications contain public package/documentation links only, disable mentions and do not forward private repository payloads. The webhook credential is stored outside Git as a repository secret.

[Release history](../CHANGELOG.md) · [2.2.4 notes](../releases/2.2.4.md)
