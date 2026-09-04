# CLI reference

> Documentation for Ludicord 2.2.5. See [release status](../releases/README.md).

Run commands through your generated package scripts or the locally installed `ludicord` executable.

| Command | Purpose |
| --- | --- |
| `ludicord --help` | Show commands |
| `ludicord --version` | Print installed framework version |
| `ludicord dev` | Development server, hot updates and diagnostics |
| `ludicord build` | Validate, typecheck and produce a production build |
| `ludicord start` | Serve an existing production build |
| `ludicord routes` | List discovered routes |
| `ludicord doctor` | Diagnose configuration and build issues |
| `ludicord info` | Show environment/project information |
| `ludicord clean` | Remove generated `.ludicord` build/cache output |

`dev` supports `--port`/`-p`, `--host`/`-H`, `--open`, `--debug` and `--no-hmr`. `start` supports host/port overrides; it does not compile or open a development preview.

```bash
npx ludicord dev --port 3000 --host 127.0.0.1
npx ludicord build
npx ludicord start --port 3000
```

Use `npx ludicord` inside an application where the package is already installed. Review diagnostics before sharing them publicly.

## Project generator

```bash
npx create-ludicord-app@latest my-activity
npx create-ludicord-app@latest my-activity --tailwind
npx create-ludicord-app@latest my-activity --no-tailwind
npx create-ludicord-app@latest my-activity --package-manager pnpm
npx create-ludicord-app@latest my-activity --package-manager npm --no-install
```

The target must be empty. In an interactive terminal, the creator asks whether to add Tailwind CSS when neither styling flag is supplied. Automated runs keep Tailwind by default for compatibility; pass `--no-tailwind` for the polished plain-CSS starter. `--no-install` writes the starter without installing dependencies. The generator package version and generated framework dependency can differ; inspect `package.json` and the lockfile. Check [release status](../CHANGELOG.md) before pinning an unpublished version.
