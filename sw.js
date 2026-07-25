/* お薬管理アプリのサービスワーカー
   一度開いたファイルを端末に保存しておくことで、
   電波が届かない場所でもアプリを起動できるようにします。 */

const CACHE = "okusuri-v3";

// 自分のサイト内のファイルは、インストール時にまとめて保存しておきます
const APP_SHELL = [
  "./",
  "./index.html",
  "./tailwind.css",
  "./app.js",
  "./manifest.webmanifest",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      // 1つでも失敗すると全部止まってしまうため、1件ずつ保存します
      await Promise.all(
        APP_SHELL.map((url) => cache.add(url).catch(() => null))
      );
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // 画面そのものの読み込みは、まずネットを試し、だめならキャッシュを使います
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // 404などの失敗した応答を保存してしまうと、直ったあとも壊れたままになります
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // それ以外のファイルは、保存済みがあればすぐ返し、裏で新しいものを取り直します
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
