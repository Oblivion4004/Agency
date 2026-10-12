import { spawnSync } from "node:child_process";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
// Keep the standard Next.js server build intact. Sites serves the prerendered
// Next.js pages and runs the same contact handler in a portable ESM Worker.
const result = spawnSync(
  process.execPath,
  ["node_modules/next/dist/bin/next", "build"],
  { stdio: "inherit", env: { ...process.env, SITES_EXPORT: "1" } },
);
if (result.status !== 0) process.exit(result.status || 1);
const assets = {};
const types = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".png": "image/png",
};
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(file);
    else {
      const key =
        "/" + path.relative(".next-sites", file).split(path.sep).join("/");
      assets[key] = {
        data: (await readFile(file)).toString("base64"),
        type: types[path.extname(file)] || "application/octet-stream",
      };
    }
  }
}
await collect(".next-sites");
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
const bundled = await build({
  entryPoints: ["src/lib/contact.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: true,
});
const source = bundled.outputFiles[0].text.replace(/export\{[^}]+\};?\s*$/, "");
// Resolve the minified public symbol without changing its implementation.
const exported = bundled.outputFiles[0].text.match(
  /(?:,|\{)(\w+) as handleContact/,
);
if (!exported) throw Error("Contact handler export missing");
const worker = `${source}\nconst assets=${JSON.stringify(assets)};\nexport default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/contact')return ${exported[1]}(request,env);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});let pathname;try{pathname=decodeURIComponent(url.pathname)}catch{return new Response('Bad request',{status:400})}const normalized=pathname.replace(/\\/$/,'');let asset=assets[pathname]||assets[normalized+'.html']||assets[(normalized||'')+'/index.html'];let status=200;if(!asset){asset=assets['/404.html'];status=404;}if(!asset)return new Response('Not found',{status:404});const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(request.method==='HEAD'?null:bytes,{status,headers:{'Content-Type':asset.type,'Cache-Control':pathname.startsWith('/_next/static/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'}})}};`;
await writeFile("dist/server/index.js", worker);
await writeFile(
  "dist/.openai/hosting.json",
  await readFile(".openai/hosting.json"),
);
console.log(
  `Sites Worker: ${Object.keys(assets).length} assets; ${(Buffer.byteLength(worker) / 1024 / 1024).toFixed(2)} MiB. API uses the tested contact handler.`,
);
