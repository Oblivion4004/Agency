import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const source = await readFile("dist/server/index.js", "utf8");
const { default: worker } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
for (const route of [
  "/",
  "/privacy",
  "/work/atharva-coffee",
  "/work/daybreak-coffee",
  "/work/goodform-salon",
  "/work/homebase-services",
]) {
  const response = await worker.fetch(
    new Request("https://studio.example.com" + route),
    {},
  );
  assert.equal(response.status, 200, route);
  assert.match(await response.text(), /Arvion Studios/);
}
const demoUrl = "https://studio.example.com/demos/atharva-coffee/index.html";
const demo = await worker.fetch(new Request(demoUrl), {});
assert.equal(demo.status, 200);
const demoHtml = await demo.text();
assert.match(demoHtml, /Arvion Studios/);
assert.match(demoHtml, /Atharva Coffee/);
for (const [, reference] of demoHtml.matchAll(/(?:src|href)="((?:assets|src)\/[^"#]+)"/g)) {
  const asset = await worker.fetch(new Request(new URL(reference, demoUrl)), {});
  assert.equal(asset.status, 200, reference);
  assert.notEqual(asset.headers.get("Content-Type"), "text/html; charset=utf-8", reference);
}
assert.equal(
  (await worker.fetch(new Request("https://studio.example.com/missing"), {}))
    .status,
  404,
);
assert.deepEqual(
  await (
    await worker.fetch(
      new Request("https://studio.example.com/api/contact"),
      {},
    )
  ).json(),
  { ready: false, siteKey: null },
);
const head = await worker.fetch(
  new Request("https://studio.example.com/", { method: "HEAD" }),
  {},
);
assert.equal(await head.text(), "");
console.log(
  "Sites Worker verification passed: six portfolio routes, café demo and assets, real 404, contact configuration, HEAD.",
);
