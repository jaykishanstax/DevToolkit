import { escapeHtml } from '../scripts/utils.js';

const NEW_LINE = String.fromCharCode(10);

function renderWordTokens(tokens, markerClass) {
  return tokens.map((token) => {
    const value = escapeHtml(token.value);
    return token.type === 'same' ? value : `<mark class="diff-token ${markerClass}">${value}</mark>`;
  }).join('');
}

export function renderInlineDiff(rows) {
  const lines = rows.flatMap((row) => {
    if (row.type === 'same') return [`  ${escapeHtml(row.left)}`];
    if (row.type === 'add') return [`+ ${escapeHtml(row.right)}`];
    if (row.type === 'remove') return [`- ${escapeHtml(row.left)}`];
    return [
      `~ - ${renderWordTokens(row.words.removed, 'removed')}`,
      `~ + ${renderWordTokens(row.words.added, 'added')}`
    ];
  });
  return `<pre class="diff-inline" aria-label="Unified inline diff">${lines.join(NEW_LINE)}</pre>`;
}

export function renderSideBySideDiff(rows) {
  const body = rows.map((row) => {
    const typeClass = row.type === 'add' ? 'added' : row.type === 'remove' ? 'removed' : row.type === 'change' ? 'changed' : 'same';
    const marker = row.type === 'add' ? '+' : row.type === 'remove' ? '-' : row.type === 'change' ? '~' : ' ';
    const left = row.type === 'change' ? renderWordTokens(row.words.removed, 'removed') : escapeHtml(row.left);
    const right = row.type === 'change' ? renderWordTokens(row.words.added, 'added') : escapeHtml(row.right);
    return `<tr class="diff-${typeClass}"><td class="diff-marker" aria-label="${row.type}">${marker}</td><td>${left}</td><td>${right}</td></tr>`;
  }).join('');

  return `<table class="diff-table" aria-label="Side-by-side diff"><thead><tr><th>Type</th><th>Original</th><th>Changed</th></tr></thead><tbody>${body}</tbody></table>`;
}

export function renderDiffSummary(summary) {
  return `<div class="diff-summary" aria-live="polite"><span class="status-success">+${summary.added} added</span><span class="status-danger">-${summary.removed} removed</span><span class="status-warning">~${summary.changed} modified</span></div>`;
}
