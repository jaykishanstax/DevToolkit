import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');

const requiredFiles = [
  'index.html',
  'manifest.webmanifest',
  'service-worker.js',
  'README.md',
  'assets/favicon.svg',
  'assets/icons/icon.svg',
  'assets/icons/github.svg',
  'styles/tokens.css',
  'styles/base.css',
  'styles/layout.css',
  'styles/components.css',
  'styles/tools.css',
  'styles/responsive.css',
  'scripts/app.js',
  'scripts/router.js',
  'scripts/state.js',
  'scripts/tools-registry.js',
  'scripts/search.js',
  'scripts/theme.js',
  'scripts/shortcuts.js',
  'scripts/clipboard.js',
  'scripts/download.js',
  'scripts/storage.js',
  'scripts/utils.js',
  'scripts/logic/html-preview.js',
  'scripts/logic/text-diff.js',
  'scripts/logic/text-formatter.js',
  'scripts/logic/uuid-generator.js',
  'components/button.js',
  'components/diff-viewer.js',
  'components/editor.js',
  'components/file-drop-zone.js',
  'components/modal.js',
  'components/toast.js',
  'components/tool-card.js',
  'components/toolbar.js'
];

for (const file of requiredFiles) {
  assert.equal(existsSync(join(root, file)), true, `Missing required file: ${file}`);
}

const html = read('index.html');
for (const marker of [
  'id="global-search"',
  'id="theme-toggle"',
  'id="sidebar-toggle"',
  'id="route-view"',
  'type="module" src="./scripts/app.js"'
]) {
  assert.equal(html.includes(marker), true, `Missing HTML marker: ${marker}`);
}

const manifest = JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.name, 'DevToolkit');
assert.equal(manifest.display, 'standalone');

const toolFiles = readdirSync(join(root, 'tools')).filter((file) => file.endsWith('.js')).sort();
assert.equal(toolFiles.length, 14, 'Expected 14 tool modules');

const registry = read('scripts/tools-registry.js');
for (const file of toolFiles) {
  const id = file.replace(/\.js$/, '');
  assert.equal(registry.includes(`id: '${id}'`), true, `Registry missing id ${id}`);
  assert.equal(registry.includes(`../tools/${file}`), true, `Registry missing module ${file}`);
  assert.equal(read(`tools/${file}`).includes('export function render'), true, `${file} must export render`);
}

const serviceWorker = read('service-worker.js');
for (const file of toolFiles) {
  assert.equal(serviceWorker.includes(`./tools/${file}`), true, `Service worker missing ${file}`);
}

const jsFiles = [
  ...requiredFiles.filter((file) => file.endsWith('.js')),
  ...toolFiles.map((file) => `tools/${file}`),
  'service-worker.js'
];
for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'pipe' });
}

const forbidden = /https?:\/\/(?:cdn|unpkg|cdn\.jsdelivr)|GPL|commercial dependency/i;
for (const file of jsFiles) {
  assert.equal(forbidden.test(read(file)), false, `Forbidden dependency/license marker in ${file}`);
}

console.log(`Smoke test passed: ${requiredFiles.length} required files, ${toolFiles.length} tools, ${jsFiles.length} JavaScript syntax checks.`);
