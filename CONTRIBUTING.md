# Contributing to Ludicord

Thank you for helping improve Ludicord. This public repository contains the
framework documentation, release records, compatibility metadata, examples,
and coding-agent guidance. The private framework implementation is not part of
this repository.

## Choose the right contribution path

- Ask usage questions in [GitHub Discussions](https://github.com/mrcholer/ludicord/discussions/categories/q-a).
- Report reproducible framework defects with the bug form.
- Propose public API, tooling, documentation, or example improvements with the
  feature form.
- Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

Search existing issues and discussions before creating a new report. Never
include credentials, cookies, access tokens, private source archives, customer
data, or unredacted local paths.

## Documentation and example changes

1. Fork the repository and create a focused branch.
2. Preserve the release-specific structure under `releases/`, `types/`, and
   `versions/`.
3. Use the installed Ludicord package and its bundled declarations as the API
   authority for examples.
4. Keep examples small enough to understand and complete enough to build.
5. Run the public repository validator:

   ```bash
   node scripts/validate-public-repo.mjs
   ```

6. For changes under `examples/full-stack-starter`, install and build it:

   ```bash
   cd examples/full-stack-starter
   npm ci
   npm run build
   ```

## Writing guidance

- Lead with the user problem and the behavior the guide enables.
- Use exact file paths and commands.
- Keep security boundaries explicit: browser input is untrusted, while
  `request.ludicord` and `client.ludicord` contain verified session context.
- State the Ludicord version when behavior is version-sensitive.
- Prefer links to canonical guides over duplicated instructions.
- Use inclusive, direct language and meaningful headings.

## Pull requests

Keep each pull request focused. Explain the problem, the resulting behavior,
and the validation performed. Generated release records should only change as
part of the release workflow. A maintainer may ask for an example, migration
note, or compatibility record when a public contract changes.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
