/* お薬管理アプリの組み立て（ビルド）スクリプト
   ------------------------------------------------------------------
   src/ のソースコードと public/ のファイルから、公開用のファイル一式を
   dist/ に作ります。dist/ の中身をそのままサーバーに置けば動きます。

     npm run build   … dist/ を作り直します
     npm run dev     … ファイルを直すたびに作り直し、http://localhost:5173 で確認できます
   ------------------------------------------------------------------ */
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");

// index.html と sw.js の中でこの文字を見つけたら、ビルドごとの版番号に置き換えます。
// 版番号が変わると、端末に保存された古いファイルではなく新しいファイルが読み込まれます。
const VERSION_MARK = "__BUILD_VERSION__";
const TEXT_WITH_VERSION = new Set(["index.html", "sw.js"]);

async function buildAll() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // 1. 画面のプログラム（React込み）を1つの app.js にまとめます
  await build({
    entryPoints: [path.join(SRC, "main.jsx")],
    outfile: path.join(DIST, "app.js"),
    bundle: true,
    minify: true,
    format: "iife",
    target: ["safari14", "chrome90"],
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    legalComments: "none",
    logLevel: "warning",
  });

  // 2. 使っているクラスだけを集めた tailwind.css を作ります
  const tw = spawnSync(
    path.join(ROOT, "node_modules", ".bin", "tailwindcss"),
    ["-c", "tailwind.config.cjs", "-i", "src/styles.css", "-o", "dist/tailwind.css", "--minify"],
    { cwd: ROOT, encoding: "utf8" },
  );
  if (tw.status !== 0) throw new Error("tailwind.css を作れませんでした\n" + tw.stderr);

  // 3. public/ のファイルを写し、版番号を書き込みます
  const hash = createHash("sha256");
  for (const f of ["app.js", "tailwind.css"]) hash.update(fs.readFileSync(path.join(DIST, f)));
  const version = hash.digest("hex").slice(0, 10);

  for (const name of fs.readdirSync(PUBLIC)) {
    const from = path.join(PUBLIC, name);
    const to = path.join(DIST, name);
    if (TEXT_WITH_VERSION.has(name)) {
      fs.writeFileSync(to, fs.readFileSync(from, "utf8").replaceAll(VERSION_MARK, version));
    } else {
      fs.copyFileSync(from, to);
    }
  }
  return version;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
};

function serve(port) {
  http
    .createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = path.join(DIST, urlPath.endsWith("/") ? urlPath + "index.html" : urlPath);
      if (!file.startsWith(DIST) || !fs.existsSync(file)) {
        res.writeHead(404).end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    })
    .listen(port, () => console.log(`確認用のページ: http://localhost:${port}`));
}

const run = async () => {
  const started = Date.now();
  try {
    const version = await buildAll();
    console.log(`dist/ を作りました（版 ${version}、${Date.now() - started}ms）`);
  } catch (e) {
    console.error(e.message || e);
    if (!process.argv.includes("--watch")) process.exit(1);
  }
};

await run();

if (process.argv.includes("--watch")) {
  let timer = null;
  const onChange = () => {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  };
  fs.watch(SRC, { recursive: true }, onChange);
  fs.watch(PUBLIC, { recursive: true }, onChange);
  serve(Number(process.env.PORT) || 5173);
}
