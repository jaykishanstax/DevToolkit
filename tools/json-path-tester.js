import { createEditor } from '../components/editor.js';
import { escapeHtml, safeJsonParse } from '../scripts/utils.js';

function parseTokens(expression) {
  if (!expression.startsWith('$')) throw new Error('JSONPath must start with $.');
  const tokens = [];
  let index = 1;
  while (index < expression.length) {
    if (expression[index] === '.') {
      index += 1;
      const match = /^[A-Za-z_$][\w$]*/.exec(expression.slice(index));
      if (!match) throw new Error('Unsupported dot path segment.');
      tokens.push({ type: 'key', value: match[0] });
      index += match[0].length;
    } else if (expression[index] === '[') {
      const end = expression.indexOf(']', index);
      if (end < 0) throw new Error('Unclosed bracket.');
      const raw = expression.slice(index + 1, end);
      if (raw === '*') tokens.push({ type: 'wild' });
      else if (/^\d+$/.test(raw)) tokens.push({ type: 'index', value: Number(raw) });
      else {
        const quoted = /^['"](.+)['"]$/.exec(raw);
        if (!quoted) throw new Error('Only quoted keys, numeric indexes, and * wildcards are supported in brackets.');
        tokens.push({ type: 'key', value: quoted[1] });
      }
      index = end + 1;
    } else throw new Error(`Unsupported token near ${expression.slice(index)}.`);
  }
  return tokens;
}

function query(data, expression) {
  let matches = [{ path: '$', value: data }];
  for (const token of parseTokens(expression)) {
    const next = [];
    for (const match of matches) {
      if (token.type === 'wild') {
        const values = Array.isArray(match.value) ? match.value.map((item, i) => [i, item]) : match.value && typeof match.value === 'object' ? Object.entries(match.value) : [];
        values.forEach(([key, value]) => next.push({ path: `${match.path}${Array.isArray(match.value) ? `[${key}]` : `.${key}`}`, value }));
      } else {
        const value = match.value?.[token.value];
        if (value !== undefined) next.push({ path: token.type === 'index' ? `${match.path}[${token.value}]` : `${match.path}.${token.value}`, value });
      }
    }
    matches = next;
  }
  return matches;
}

export function render(container) {
  const editor = createEditor({ label: 'JSON document', onInput: update });
  const controls = document.createElement('section');
  controls.className = 'panel form-grid';
  controls.innerHTML = '<label class="form-field">JSONPath expression<input id="jsonpath" value="$.items[*]" aria-label="JSONPath expression"></label>';
  const result = document.createElement('section');
  result.className = 'panel';
  result.innerHTML = '<h2>Results</h2><div class="result-panel"></div><p class="muted">Supported: $, dot paths, bracket keys, array indexes, wildcards.</p>';
  container.append(controls, editor.wrapper, result);
  controls.addEventListener('input', update);
  function update() {
    const parsed = safeJsonParse(editor.textarea.value || '{}');
    const panel = result.querySelector('.result-panel');
    if (parsed.error) { panel.innerHTML = `<span class="status-danger">${escapeHtml(parsed.error.message)}</span>`; return; }
    try {
      const rows = query(parsed.value, controls.querySelector('#jsonpath').value);
      panel.innerHTML = rows.length ? rows.map((row) => `<div><strong>${escapeHtml(row.path)}</strong><pre>${escapeHtml(JSON.stringify(row.value, null, 2))}</pre></div>`).join('') : 'No matches.';
    } catch (error) { panel.innerHTML = `<span class="status-danger">${escapeHtml(error.message)}</span>`; }
  }
  update();
}
