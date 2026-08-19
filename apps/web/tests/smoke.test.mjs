import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("frame mockup declares the Korean locale", async () => {
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /<html lang="ko">/);
});

test("shadcn configuration uses the neutral base", async () => {
  const raw = await readFile(new URL("../components.json", import.meta.url), "utf8");
  const config = JSON.parse(raw);
  assert.equal(config.tailwind.baseColor, "neutral");
  assert.equal(config.style, "new-york");
});

test("live deal action pages are always rendered dynamically", async () => {
  const page = await readFile(
    new URL("../src/app/deals/[id]/[action]/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /export const dynamic = ["']force-dynamic["']/);
});

test("header add button has distinct local, staging, and production colors", async () => {
  const environment = await readFile(
    new URL("../src/lib/deployment-environment.ts", import.meta.url),
    "utf8",
  );
  const header = await readFile(
    new URL("../src/components/screen-header.tsx", import.meta.url),
    "utf8",
  );

  assert.match(environment, /local:\s*"bg-zinc-800/);
  assert.match(environment, /staging:\s*"bg-amber-400/);
  assert.match(environment, /production:\s*undefined/);
  assert.match(environment, /return "local"/);
  assert.match(environment, /local:\s*"LOCAL"/);
  assert.match(environment, /staging:\s*"STAGING"/);
  assert.match(environment, /production:\s*"PRODUCTION"/);
  assert.match(environment, /local:\s*"border-transparent bg-zinc-800/);
  assert.match(environment, /staging:\s*"border-transparent bg-amber-400/);
  assert.match(environment, /production:\s*"border-transparent bg-primary/);
  assert.match(header, /data-deployment-environment=/);
  assert.match(header, /data-environment-label/);
});
