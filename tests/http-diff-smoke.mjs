import http from 'node:http';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const contentTypes = new Map([
  ['.html', 'text/html'],
  ['.js', 'text/javascript'],
  ['.css', 'text/css'],
  ['.svg', 'image/svg+xml'],
  ['.webmanifest', 'application/manifest+json']
]);

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = normalize(join(root, relativePath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end('not found');
    return;
  }

  response.writeHead(200, { 'content-type': contentTypes.get(extname(filePath)) || 'text/plain' });
  response.end(readFileSync(filePath));
});

await new Promise((resolve) => server.listen(4181, '127.0.0.1', resolve));

try {
  for (const path of ['/', '/tools/text-diff.js', '/scripts/logic/text-diff.js', '/components/diff-viewer.js']) {
    const response = await fetch(`http://127.0.0.1:4181${path}`);
    const body = await response.text();
    assert.equal(response.ok, true, `${path} should load over HTTP`);
    assert.equal(body.length > 0, true, `${path} should return content`);
    console.log(`${path}: ${response.status} ${response.headers.get('content-type')} ${body.length}`);
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log('Diff HTTP smoke test passed.');
