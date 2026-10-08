const CACHE_NAME = 'devtoolkit-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/favicon.svg',
  './assets/icons/icon.svg',
  './assets/icons/github.svg',
  './styles/tokens.css',
  './styles/base.css',
  './styles/layout.css',
  './styles/components.css',
  './styles/tools.css',
  './styles/responsive.css',
  './components/button.js',
  './components/diff-viewer.js',
  './components/editor.js',
  './components/file-drop-zone.js',
  './components/modal.js',
  './components/toast.js',
  './components/tool-card.js',
  './components/toolbar.js',
  './scripts/logic/html-preview.js',
  './scripts/logic/text-diff.js',
  './scripts/logic/text-formatter.js',
  './scripts/logic/uuid-generator.js',
  './scripts/app.js',
  './scripts/router.js',
  './scripts/state.js',
  './scripts/tools-registry.js',
  './scripts/search.js',
  './scripts/theme.js',
  './scripts/shortcuts.js',
  './scripts/clipboard.js',
  './scripts/download.js',
  './scripts/storage.js',
  './scripts/utils.js',
  './tools/base64-tool.js',
  './tools/css-generator.js',
  './tools/hash-generator.js',
  './tools/html-preview.js',
  './tools/json-compare.js',
  './tools/json-formatter.js',
  './tools/json-path-tester.js',
  './tools/jwt-decoder.js',
  './tools/prompt-builder.js',
  './tools/regex-tester.js',
  './tools/text-diff.js',
  './tools/text-formatter.js',
  './tools/token-counter.js',
  './tools/uuid-generator.js'
];

const isSupportedProtocol = self.location.protocol === 'http:' || self.location.protocol === 'https:';

if (isSupportedProtocol) {
  self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => undefined));
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => undefined);
        return response;
      }).catch(() => caches.match('./index.html')))
    );
  });
}
