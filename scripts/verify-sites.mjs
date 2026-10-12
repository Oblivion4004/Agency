import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const source = await readFile("dist/server/index.js", "utf8");
const { default: worker } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
for (const route of [
  "/",
  "/privacy",
  "/work/daybreak-coffee",
  "/work/goodform-salon",
  "/work/homebase-services",
]) {
  const response = await worker.fetch(
    new Request("https://studio.example.com" + route),
    {},
  );
  assert.equal(response.status, 200, route);
  assert.match(await response.text(), /ATRIXX WEB/);
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
  "Sites Worker verification passed: five routes, real 404, contact configuration, HEAD.",
);
