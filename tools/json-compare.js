import { createEditor } from '../components/editor.js';
import { escapeHtml, safeJsonParse } from '../scripts/utils.js';
import { getSetting, setSetting } from '../scripts/state.js';

function compare(left, right, path = '$', output = []) {
  if (JSON.stringify(left) === JSON.stringify(right)) return output;
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    for (const key of keys) {
      const childPath = Array.isArray(left) || Array.isArray(right) ? `${path}[${key}]` : `${path}.${key}`;
      if (!(key in left)) output.push(['added', childPath, right[key]]);
      else if (!(key in right)) output.push(['removed', childPath, left[key]]);
      else compare(left[key], right[key], childPath, output);
    }
  } else output.push(['changed', path, { from: left, to: right }]);
  return output;
}

export function render(container) {
  const left = createEditor({ label: 'Left JSON', onInput: update });
  const right = createEditor({ label: 'Right JSON', onInput: update });
  const option = document.createElement('label');
  option.className = 'checkbox-row';
  option.innerHTML = `<input type="checkbox" ${getSetting('jsonCompareIgnoreOrder', true) ? 'checked' : ''}> Ignore object field order`;
  const result = document.createElement('section');
  result.className = 'panel';
  result.innerHTML = '<h2>Comparison</h2><div class="result-panel"></div>';
  const layout = document.createElement('div');
  layout.className = 'tool-layout';
  layout.append(left.wrapper, right.wrapper);
  container.append(option, layout, result);
  option.addEventListener('input', () => { setSetting('jsonCompareIgnoreOrder', option.querySelector('input').checked); update(); });
  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (option.querySelector('input').checked && value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
    return value;
  }
  function update() {
    const a = safeJsonParse(left.textarea.value || 'null');
    const b = safeJsonParse(right.textarea.value || 'null');
    const panel = result.querySelector('.result-panel');
    if (a.error || b.error) { panel.innerHTML = `<p class="status-danger">${escapeHtml(a.error?.message || b.error?.message)}</p>`; return; }
    const rows = compare(canonical(a.value), canonical(b.value));
    panel.innerHTML = rows.length ? rows.map(([type, path, value]) => `<div class="compare-${type}"><strong>${type}</strong> ${escapeHtml(path)}<pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre></div>`).join('') : '<p class="status-success">JSON documents are equivalent.</p>';
  }
  update();
}
