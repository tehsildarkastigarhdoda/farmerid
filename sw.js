const CACHE = 'farmerid-v47';
const SHELL = ['./', './index.html', './app.html', './dash.js', './logo.svg', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './fonts/geist-400.woff2', './fonts/geist-500.woff2', './fonts/geist-600.woff2', './fonts/geist-mono-500.woff2', './fonts/nunito-400.woff2', './fonts/nunito-700.woff2', './fonts/nunito-800.woff2', './fonts/nunito-900.woff2', './fonts/ah-400.woff2', './fonts/ah-700.woff2', './fonts/ah-800.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // pages and the dashboard script: the phone's copy at once; the newest is fetched quietly for next time
  const page = e.request.mode === 'navigate' || /\/$|\.html$|dash\.js$/.test(u.pathname);
  if (page) {
    const key = u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname;
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(key);
      const net = fetch(e.request).then(async r => { if (r.ok) { const tag = x => x ? (x.headers.get('etag') || x.headers.get('last-modified') || '') : ''; const o = tag(hit), n = tag(r);
          await c.put(key, r.clone()); if (hit && o && n && o !== n) (await self.clients.matchAll()).forEach(x => x.postMessage('upd82')); } return r; })
        .catch(() => hit || c.match(/app\.html$/.test(key) ? './app.html' : './index.html'));
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    }));
    return;
  }
  // Libraries in /lib/ and icons: from the phone's cache once fetched, so Excel and PDF work offline too.
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.ok && u.pathname.indexOf('/lib/') >= 0) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return res;
  })));
});
