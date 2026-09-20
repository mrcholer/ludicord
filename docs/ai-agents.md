# AI coding agents

Ludicord 4.0.1 ships documentation and agent skills with the npm package. They
are available offline and change together with the installed framework:

```text
node_modules/ludicord/
├── AGENTS.md
└── dist/
    ├── docs/README.md
    └── skills/ludicord/
        ├── SKILL.md
        ├── manifest.yaml
        ├── agents/openai.yaml
        └── references/
```

The short `AGENTS.md` entry point sits at the npm package root, following the
same discovery pattern used by Next.js. Detailed, version-matched docs and the
reusable skill stay under `dist/`. Upgrading Ludicord upgrades all of these
resources. The generated application receives no extra agent file, and no
postinstall hook or external docs download is required.

## Install from skills.sh

Install the public skill from the canonical repository:

```bash
npx skills add mrcholer/ludicord --skill ludicord
```

The searchable listing is [Ludicord on skills.sh](https://skills.sh/mrcholer/ludicord/ludicord).
The public copy helps discovery, while the skill under
`node_modules/ludicord/dist/skills/` stays version-matched to the project.

For an existing project, add this instruction to its existing `AGENTS.md`,
preserving the project's own rules:

```md
Before Ludicord work, read node_modules/ludicord/AGENTS.md and the relevant
guide in node_modules/ludicord/dist/docs/. Use the installed declarations and
ludicord.generated.d.ts as the API authority. The reusable skill lives at
node_modules/ludicord/dist/skills/ludicord/SKILL.md.
```

Resolve the package from the application directory in a monorepo. If the
package manager uses a different layout, locate `ludicord/package.json` with
the project's resolver and read `dist` beside it. Read only task-relevant
references; do not load the entire documentation tree on every request.

## Additional pathname pages are optional

Agents should keep ordinary applications on `app/page.tsx` and `app/`.
Add another pathname page only when project scale calls for independent product
surfaces, or an important requirement needs distinct pathname entry points,
shells, or provider lifetimes. Explain that requirement before creating the
page. A v4 upgrade, additional screens, realtime, or a deep directory tree
alone does not justify one. There is no structural `prefix/` folder in unified
mode. See [Page scopes and unified routing](prefix-router.md) when it applies.

Installed declarations and generated route types take precedence over older
online guidance or a globally installed skill. For v3 applications, use the
matching v3 docs instead of adding v4-only imports.

Use this authority order when sources disagree:

1. installed declarations and `ludicord.generated.d.ts`;
2. matching files in `node_modules/ludicord/dist/docs/`;
3. the bundled skill;
4. public docs and the skills.sh copy;
5. remembered examples from another Ludicord release.
