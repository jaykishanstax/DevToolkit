import assert from 'node:assert/strict';
import { DEFAULT_HTML_PREVIEW, getHtmlPreviewStatus, normalizeHtmlDocument } from '../scripts/logic/html-preview.js';

assert.equal(DEFAULT_HTML_PREVIEW.includes('<!doctype html>'), true);
assert.equal(DEFAULT_HTML_PREVIEW.includes('Hello DevToolkit'), true);

assert.equal(normalizeHtmlDocument(''), '');
assert.equal(normalizeHtmlDocument('<main>Hi</main>').startsWith('<!doctype html>'), true);
assert.equal(normalizeHtmlDocument('<!doctype html><html></html>'), '<!doctype html><html></html>');

assert.deepEqual(getHtmlPreviewStatus('').type, 'warning');
assert.deepEqual(getHtmlPreviewStatus('<h1>Hello</h1>').type, 'success');
assert.deepEqual(getHtmlPreviewStatus('x'.repeat(250001)).type, 'warning');

console.log('HTML Preview logic tests passed.');
