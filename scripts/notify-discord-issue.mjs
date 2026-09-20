import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repository = "mrcholer/ludicord";

function clean(value, maximum) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximum);
}

export function buildIssueNotification(event) {
  assert.ok(event && typeof event === "object", "GitHub issue payload is required");
  assert.ok(event.action === "opened" || event.action === "reopened", "Unsupported issue action");
  const issue = event.issue;
  assert.ok(issue && Number.isInteger(issue.number), "GitHub issue number is required");
  const url = String(issue.html_url ?? "");
  assert.match(
    url,
    /^https:\/\/github\.com\/mrcholer\/ludicord\/issues\/\d+$/,
    "Unexpected issue URL",
  );

  const issueAuthor = clean(issue.user?.login, 80) || "unknown";
  const actor = clean(event.sender?.login, 80) || issueAuthor;
  const title = clean(issue.title, 220) || "Untitled issue";
  const labels = Array.isArray(issue.labels)
    ? issue.labels
        .map((label) => clean(typeof label === "string" ? label : label?.name, 50))
        .filter(Boolean)
        .join(", ")
        .slice(0, 900)
    : "";
  const activity = event.action === "reopened"
    ? `Reopened by @${actor}`
    : `Opened by @${issueAuthor}`;

  return {
    username: "Ludicord Issues",
    allowed_mentions: { parse: [] },
    embeds: [
      {
        color: event.action === "reopened" ? 0xfee75c : 0x5865f2,
        title: `#${issue.number} · ${title}`,
        url,
        description: activity,
        ...(labels ? { fields: [{ name: "Labels", value: labels }] } : {}),
        footer: { text: repository },
        ...(issue.updated_at ? { timestamp: issue.updated_at } : {}),
      },
    ],
  };
}

async function main() {
  const webhook = process.env.DISCORD_ISSUES_WEBHOOK?.trim();
  if (!webhook) {
    console.log("DISCORD_ISSUES_WEBHOOK is not configured; issue notification skipped.");
    return;
  }
  assert.match(
    webhook,
    /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/,
    "DISCORD_ISSUES_WEBHOOK is not a Discord webhook URL",
  );
  const eventPath = process.env.GITHUB_EVENT_PATH;
  assert.ok(eventPath, "GITHUB_EVENT_PATH is missing");
  const payload = buildIssueNotification(JSON.parse(readFileSync(eventPath, "utf8")));
  const response = await fetch(`${webhook}?wait=true`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  assert.ok(response.ok, `Discord issue notification failed (${response.status})`);
  assert.ok((await response.json()).id, "Discord did not acknowledge the issue notification");
  console.log("Discord acknowledged the GitHub issue notification.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    const secret = process.env.DISCORD_ISSUES_WEBHOOK;
    let message = error instanceof Error ? error.message : "Issue notification failed";
    if (secret) message = message.replaceAll(secret, "[redacted webhook]");
    console.error(message);
    process.exitCode = 1;
  }
}
