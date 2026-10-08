import assert from 'node:assert/strict';
import { createLineDiff, createWordDiff, diffToText, normalizeDiffLine, summarizeDiff } from '../scripts/logic/text-diff.js';

assert.equal(normalizeDiffLine('hello   world  ', { ignoreWhitespace: true }), 'hello world');
assert.equal(normalizeDiffLine('hello   world  ', { ignoreWhitespace: false }), 'hello   world  ');

const rows = createLineDiff(`alpha
beta
gamma`, `alpha
better
gamma
delta`);
assert.deepEqual(rows.map((row) => row.type), ['same', 'change', 'same', 'add']);
assert.equal(rows[1].left, 'beta');
assert.equal(rows[1].right, 'better');

const summary = summarizeDiff(rows);
assert.deepEqual(summary, { added: 1, removed: 0, changed: 1 });

const text = diffToText(rows);
assert.equal(text.includes('~ - beta'), true);
assert.equal(text.includes('~ + better'), true);
assert.equal(text.includes('+ delta'), true);

const wordDiff = createWordDiff('const color = blue;', 'const colour = red;');
assert.equal(wordDiff.removed.some((token) => token.type === 'remove' && token.value === 'color'), true);
assert.equal(wordDiff.added.some((token) => token.type === 'add' && token.value === 'colour'), true);
assert.equal(wordDiff.added.some((token) => token.type === 'add' && token.value === 'red;'), true);

const whitespaceIgnored = createLineDiff(`a   b
next`, `a b
next`, { ignoreWhitespace: true });
assert.deepEqual(whitespaceIgnored.map((row) => row.type), ['same', 'same']);

console.log('Text diff logic tests passed.');
