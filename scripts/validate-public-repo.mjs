import assert from "node:assert/strict";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (...segments) => readFileSync(path.join(root, ...segments), "utf8");
const json = (...segments) => JSON.parse(read(...segments));
const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function filesBelow(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...filesBelow(target));
    else result.push(target);
  }
  return result;
}

function expectedEntrypoints(pkg) {
  return Object.entries(pkg.exports ?? {})
    .filter(([specifier, target]) => !["./internal", "./package.json"].includes(specifier) && typeof target?.types === "string")
    .map(([specifier, target]) => ({
      specifier: specifier === "." ? pkg.name : `${pkg.name}/${specifier.slice(2)}`,
      declaration: target.types,
    }));
}

function validateStagedRelease(version) {
  const directory = path.join(root, ".release", `v${version}`);
  const manifestFile = path.join(directory, "manifest.json");
  assert.ok(existsSync(manifestFile), `Missing staged manifest for ${version}`);
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  assert.equal(manifest.schema, 1);
  assert.equal(manifest.version, version);
  assert.equal(manifest.notes, "CHANGELOG.md");
  assert.deepEqual(manifest.packages.map(({ name }) => name), ["ludicord", "create-ludicord-app"]);
  assert.ok(existsSync(path.join(directory, manifest.notes)), `Missing staged notes for ${version}`);
  for (const item of manifest.packages) {
    assert.equal(item.version, version);
    assert.equal(item.filename, `${item.name}-${version}.tgz`);
    assert.ok(existsSync(path.join(directory, item.filename)), `Missing staged tarball: ${item.filename}`);
    assert.equal(json("packages", item.name, "package.json").version, version, `${item.name} record is stale`);
  }
}

function validateCurrentRelease() {
  const version = json(".release", "current.json").version;
  assert.match(version, stableVersion);
  const major = version.split(".", 1)[0];
  const note = path.join(root, "releases", `v${major}`, `${version}.md`);
  if (!existsSync(note)) {
    validateStagedRelease(version);
    return;
  }
  for (const name of ["ludicord", "create-ludicord-app"]) {
    assert.equal(json("packages", name, "package.json").version, version, `${name} record is stale`);
  }
  for (const file of ["releases/latest.md", "releases/published.md", "releases/README.md", `releases/v${major}/README.md`]) {
    assert.ok(read(...file.split("/")).includes(version), `${file} does not name ${version}`);
  }

  const latest = json("types", "latest.json");
  const versioned = json("types", `v${major}`, `${version}.json`);
  assert.deepEqual(latest, versioned, "types/latest.json must exactly mirror the current version record");
  assert.equal(latest.schema, 1);
  assert.equal(latest.status, "published");
  assert.equal(latest.version, version);
  assert.deepEqual(latest.unsupportedApplicationImports, ["ludicord/internal"]);
  for (const record of latest.packages) {
    const pkg = json("packages", record.name, "package.json");
    assert.equal(record.version, pkg.version);
    assert.equal(record.node, pkg.engines.node);
    assert.deepEqual(record.peerDependencies, pkg.peerDependencies ?? {});
    assert.deepEqual(record.typeEntrypoints, expectedEntrypoints(pkg));
  }
}

function validateReleaseLayout() {
  const flat = readdirSync(path.join(root, "releases"))
    .filter((name) => stableVersion.test(name.replace(/\.md$/, "")));
  assert.deepEqual(flat, [], `Versioned release notes must live under releases/v<major>/: ${flat.join(", ")}`);
  for (const entry of readdirSync(path.join(root, "releases"), { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^v\d+$/.test(entry.name)) continue;
    const major = entry.name.slice(1);
    const directory = path.join(root, "releases", entry.name);
    const index = readFileSync(path.join(directory, "README.md"), "utf8");
    for (const file of readdirSync(directory)) {
      if (!stableVersion.test(file.replace(/\.md$/, ""))) continue;
      assert.ok(file.startsWith(`${major}.`), `${file} is in the wrong major release directory`);
      assert.ok(index.includes(`](${file})`), `${entry.name}/README.md does not link ${file}`);
    }
  }
}

function validateAgentEntryPoints() {
  const required = [
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    "AGENT_SUPPORT.md",
    ".agents/skills/ludicord/SKILL.md",
    ".agents/rules/ludicord.md",
    ".cursor/rules/ludicord.mdc",
    ".github/copilot-instructions.md",
    "skills/ludicord/SKILL.md",
  ];
  for (const file of required) assert.ok(existsSync(path.join(root, file)), `Missing agent entry point: ${file}`);
  assert.ok(read(".agents", "skills", "ludicord", "SKILL.md").includes("../../../skills/ludicord/SKILL.md"));
  for (const file of required) {
    assert.ok(!/\bludicord doctor\b/i.test(read(...file.split("/"))), `${file} recommends the removed doctor command`);
  }
}

function validateMarkdownLinks() {
  for (const file of filesBelow(root).filter((item) => item.endsWith(".md"))) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = match[1].trim().replace(/^<|>$/g, "");
      if (!href || href.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(href)) continue;
      const withoutFragment = decodeURIComponent(href.split("#", 1)[0]);
      if (!withoutFragment) continue;
      const target = path.resolve(path.dirname(file), withoutFragment);
      assert.ok(existsSync(target), `Broken relative link in ${path.relative(root, file)}: ${href}`);
    }
  }
}

function validateRepositoryText() {
  const textFiles = filesBelow(root).filter((file) => !/[.](?:tgz|png)$/i.test(file));
  for (const file of textFiles) {
    assert.ok(!lstatSync(file).isSymbolicLink(), `Symlinks are not allowed in the public payload: ${path.relative(root, file)}`);
    const content = readFileSync(file, "utf8");
    assert.doesNotMatch(content, /^(?:<{7}|={7}|>{7})(?: .*)?$/m, `Unresolved merge conflict in ${path.relative(root, file)}`);
  }
  const currentGuides = ["AGENTS.md", ...filesBelow(path.join(root, "docs")).filter((file) => file.endsWith(".md")).map((file) => path.relative(root, file))];
  for (const file of currentGuides) {
    assert.doesNotMatch(read(...file.split(path.sep)), /^\s*(?:npx\s+|pnpm\s+(?:exec\s+)?|npm\s+run\s+)?ludicord doctor\b/im, `${file} recommends the removed doctor command`);
  }
}

validateCurrentRelease();
validateReleaseLayout();
validateAgentEntryPoints();
validateMarkdownLinks();
validateRepositoryText();
json("types", "schema.json");
console.log("Validated public release records, type indexes, links, and agent entry points.");
