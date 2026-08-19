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
