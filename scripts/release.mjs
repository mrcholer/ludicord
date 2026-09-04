import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PUBLIC_REPOSITORY_NAME = "mrcholer/ludicord";
export const PUBLIC_REPOSITORY = `https://github.com/${PUBLIC_REPOSITORY_NAME}`;
export const PACKAGES = ["ludicord", "create-ludicord-app"];

const root = fileURLToPath(new URL("../", import.meta.url));
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));

export function releaseVersion(value) {
  assert.equal(typeof value, "string", "Release version is required");
  const version = value.replace(/^v/, "");
  assert.match(
    version,
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
    "Only explicit stable versions are supported",
  );
  return version;
}

export function assertIdentity(env) {
  assert.equal(env.GITHUB_REPOSITORY, PUBLIC_REPOSITORY_NAME);
  assert.equal(env.GITHUB_ACTIONS, "true");
  assert.ok(["push", "workflow_dispatch"].includes(env.GITHUB_EVENT_NAME));
  assert.equal(env.GITHUB_REF, "refs/heads/main");
  assert.ok(
    env.GITHUB_WORKFLOW_REF?.startsWith(
      `${PUBLIC_REPOSITORY_NAME}/.github/workflows/publish.yml@`,
    ),
    "Unexpected workflow identity",
  );
}

export function assertIntegrity(expected, actual) {
  assert.equal(actual, expected, "Registry package differs from the approved release tarball");
}

export function validatePublicPackage(pkg, name, version) {
  assert.equal(pkg.name, name);
  assert.equal(pkg.version, version);
  assert.notEqual(pkg.private, true);
  assert.equal(pkg.repository?.url, `git+${PUBLIC_REPOSITORY}.git`);
  assert.equal(pkg.repository?.directory, `packages/${name}`);
  assert.equal(pkg.homepage, `${PUBLIC_REPOSITORY}#readme`);
  assert.equal(pkg.bugs?.url, `${PUBLIC_REPOSITORY}/issues`);
  assert.equal(pkg.publishConfig?.access, "public");
  assert.equal(pkg.publishConfig?.registry, "https://registry.npmjs.org/");
  assert.equal(pkg.publishConfig?.provenance, true);
}

export function validateTarEntries(entries) {
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.match(
      entry,
      /^package\/(?:package\.json|README\.md|LICENSE(?:\.md)?|bin\/[a-zA-Z0-9_-]+\.js|dist\/[a-zA-Z0-9_./-]+(?:\.js|\.d\.ts))$/,
      `Unexpected tarball file: ${entry}`,
    );
    assert.ok(!entry.includes("/../") && !entry.endsWith(".map"));
  }
  for (const required of [
    "package/package.json",
    "package/README.md",
    "package/dist/index.js",
    "package/dist/index.d.ts",
  ]) {
    assert.ok(entries.includes(required), `Missing ${required}`);
  }
}

export function sanitizeReleaseNotes(source) {
  const result = source.replace(/\n## Credits\b[\s\S]*$/i, "").trim();
  assert.ok(result.length > 0);
  assert.doesNotMatch(
    result,
    /discord\.com\/api\/webhooks|private key|github_pat_|npm_[A-Za-z0-9]/i,
  );
  return `${result}\n`;
}

function command(executable, args, cwd = root) {
  const result = spawnSync(executable, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
    timeout: 300000,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(
      `${executable} failed: ${result.stderr || result.stdout || result.error?.message || result.status}`,
    );
  }
  return result.stdout.trim();
}

function versionFromEnvironment() {
  return releaseVersion(
    process.env.RELEASE_VERSION ??
      readJson(path.join(root, ".release", "current.json")).version,
  );
}

function tarText(tarball, entry) {
  return command("tar", ["-xOf", tarball, entry]);
}

function loadRelease() {
  const version = versionFromEnvironment();
  const directory = path.join(root, ".release", `v${version}`);
  const manifest = readJson(path.join(directory, "manifest.json"));
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.version, version);
  assert.equal(manifest.notes, "CHANGELOG.md");
  assert.deepEqual(
    manifest.packages.map(({ name }) => name),
    PACKAGES,
  );
  for (const item of manifest.packages) {
    assert.equal(item.version, version);
    assert.equal(item.filename, `${item.name}-${version}.tgz`);
    const tarball = path.join(directory, item.filename);
    const bytes = readFileSync(tarball);
    assertIntegrity(
      item.integrity,
      `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
    );
    const entries = command("tar", ["-tzf", tarball])
      .split(/\r?\n/)
      .filter(Boolean)
      .map((entry) => entry.replace(/^\.\//, ""));
    validateTarEntries(entries);
    const pkg = JSON.parse(tarText(tarball, "package/package.json"));
    validatePublicPackage(pkg, item.name, version);
    assert.match(
      tarText(tarball, "package/README.md"),
      /raw\.githubusercontent\.com\/mrcholer\/ludicord\/main\/\.github\/assets\/ludicord-banner\.png/,
    );
  }
  const notes = sanitizeReleaseNotes(readFileSync(path.join(directory, manifest.notes), "utf8"));
  return { version, directory, manifest, notes };
}

async function registry(name, version) {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`,
    { signal: AbortSignal.timeout(20000) },
  );
  if (response.status === 404) return null;
  assert.ok(response.ok, `npm registry request failed (${response.status})`);
  return response.json();
}

function compareVersions(left, right) {
  const a = releaseVersion(left).split(".").map(Number);
  const b = releaseVersion(right).split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

async function publish() {
  assertIdentity(process.env);
  const release = loadRelease();
  const existing = new Map();
  for (const item of release.manifest.packages) {
    const found = await registry(item.name, item.version);
    if (found) {
      assertIntegrity(item.integrity, found.dist?.integrity);
    } else {
      const latest = await registry(item.name, "latest");
      if (latest) {
        assert.ok(
          compareVersions(item.version, latest.version) > 0,
          `Refusing to move ${item.name} latest backwards`,
        );
      }
    }
    existing.set(item.name, found);
  }

  let newlyPublished = false;
  for (const item of release.manifest.packages) {
    if (existing.get(item.name)) {
      console.log(`${item.name}@${item.version} already matches; skipping`);
      continue;
    }
    command(
      "npm",
      [
        "publish",
        path.join(release.directory, item.filename),
        "--access",
        "public",
        "--tag",
        "latest",
        "--ignore-scripts",
        "--provenance",
      ],
      root,
    );
    let verified = false;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const found = await registry(item.name, item.version);
      if (found) {
        assertIntegrity(item.integrity, found.dist?.integrity);
        verified = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    assert.ok(verified, `${item.name}@${item.version} was not verified in npm`);
    newlyPublished = true;
    console.log(`Published and verified ${item.name}@${item.version}`);
  }
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `newly_published=${newlyPublished}\n`);
  }
}

function longDate() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date());
}

function changelogEntry(version, notes) {
  const body = notes.replace(/^# .*\r?\n+/, "").trim();
  return `## ${version} — ${longDate()}\n\n${body}\n\n[GitHub release](${PUBLIC_REPOSITORY}/releases/tag/v${version}) · [ludicord on npm](https://www.npmjs.com/package/ludicord/v/${version}) · [creator on npm](https://www.npmjs.com/package/create-ludicord-app/v/${version})`;
}

function finalize() {
  if (process.env.GITHUB_ACTIONS === "true") assertIdentity(process.env);
  const release = loadRelease();
  mkdirSync(path.join(root, "releases"), { recursive: true });
  writeFileSync(path.join(root, "releases", `${release.version}.md`), release.notes);

  for (const item of release.manifest.packages) {
    const packageDirectory = path.join(root, "packages", item.name);
    mkdirSync(packageDirectory, { recursive: true });
    const tarball = path.join(release.directory, item.filename);
    writeFileSync(
      path.join(packageDirectory, "package.json"),
      `${JSON.stringify(JSON.parse(tarText(tarball, "package/package.json")), null, 2)}\n`,
    );
    writeFileSync(
      path.join(packageDirectory, "README.md"),
      `${tarText(tarball, "package/README.md").trim()}\n`,
    );
  }

  const changelogFile = path.join(root, "CHANGELOG.md");
  let changelog = readFileSync(changelogFile, "utf8");
  if (!new RegExp(`^## ${release.version.replaceAll(".", "\\.")}\\b`, "m").test(changelog)) {
    const entry = changelogEntry(release.version, release.notes);
    changelog = changelog.replace(
      /^(# Release history\r?\n)/,
      `$1\n${entry}\n\n`,
    );
    writeFileSync(changelogFile, changelog);
  }
  writeFileSync(
    path.join(root, "releases", "published.md"),
    `# Published packages\n\nCurrent synchronized release: **${release.version}**.\n\n- [ludicord ${release.version}](https://www.npmjs.com/package/ludicord/v/${release.version})\n- [create-ludicord-app ${release.version}](https://www.npmjs.com/package/create-ludicord-app/v/${release.version})\n- [Release notes](./${release.version}.md)\n\nPackage metadata and tarball integrity are verified before this file is updated.\n`,
  );
  for (const file of readdirSync(path.join(root, "docs"))) {
    if (!file.endsWith(".md")) continue;
    const documentationFile = path.join(root, "docs", file);
    const current = readFileSync(documentationFile, "utf8");
    const updated = current.replace(
      /Documentation for Ludicord \d+\.\d+\.\d+\./,
      `Documentation for Ludicord ${release.version}.`,
    );
    if (updated !== current) writeFileSync(documentationFile, updated);
  }
  writeFileSync(
    path.join(root, "releases", "README.md"),
    `# Releases\n\n- [Current ${release.version} release notes](./${release.version}.md).\n- [Published version list and dates](../CHANGELOG.md).\n- [GitHub release records](${PUBLIC_REPOSITORY}/releases).\n- [Current published packages](published.md).\n- [Migration guide](../docs/migration.md).\n\nThe npm registry is authoritative for installable versions. Public release payloads contain the same compiled package files distributed through npm; original TypeScript, source maps, credentials and private application code are excluded.\n`,
  );
  console.log(`Updated public release records for ${release.version}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const action = process.argv[2];
    if (action === "validate") {
      if (process.env.GITHUB_ACTIONS === "true") assertIdentity(process.env);
      console.log(`Validated public release ${loadRelease().version}`);
    } else if (action === "publish") await publish();
    else if (action === "finalize") finalize();
    else throw new Error("Usage: node scripts/release.mjs validate|publish|finalize");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Release operation failed");
    process.exitCode = 1;
  }
}
