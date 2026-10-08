import { createEditor } from '../components/editor.js';
import { createFileDropZone } from '../components/file-drop-zone.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { downloadText } from '../scripts/download.js';
import { escapeHtml, safeJsonParse } from '../scripts/utils.js';

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])]));
  return value;
}

function tree(value) {
  if (value && typeof value === 'object') {
    const entries = Array.isArray(value) ? value.map((item, index) => [index, item]) : Object.entries(value);
    return '<ul class="tree-list">' + entries.map(([key, item]) => `<li><strong>${escapeHtml(key)}:</strong> ${tree(item)}</li>`).join('') + '</ul>';
  }
  return `<code>${escapeHtml(JSON.stringify(value))}</code>`;
}

export function render(container) {
  const editor = createEditor({ label: 'JSON input', clear: true, placeholder: '{"hello":"world"}' });
  const status = document.createElement('p');
  const output = document.createElement('section');
  output.className = 'panel';
  output.innerHTML = '<h2>Tree view</h2><div class="result-panel"></div>';
  const drop = createFileDropZone({ accept: '.json,application/json', onText: (text) => { editor.textarea.value = text; update(); } });
  const toolbar = createToolbar([
    { label: 'Pretty print', variant: 'primary', onClick: () => format(2) },
    { label: 'Minify', onClick: () => format(0) },
    { label: 'Sort keys', onClick: () => format(2, true) },
    { label: 'Copy', onClick: () => copyText(editor.textarea.value) },
    { label: 'Download', onClick: () => downloadText('formatted.json', editor.textarea.value, 'application/json') }
  ]);
  container.append(drop, toolbar, editor.wrapper, status, output);
  editor.textarea.addEventListener('input', update);
  function parse() {
    const parsed = safeJsonParse(editor.textarea.value || 'null');
    status.className = parsed.error ? 'status-danger' : 'status-success';
    status.textContent = parsed.error ? parsed.error.message : 'Valid JSON';
    return parsed;
  }
  function format(spaces, sort = false) {
    const parsed = parse();
    if (!parsed.error) { editor.textarea.value = JSON.stringify(sort ? sortKeys(parsed.value) : parsed.value, null, spaces); update(); }
  }
  function update() {
    const parsed = parse();
    output.querySelector('.result-panel').innerHTML = parsed.error ? 'Unable to render invalid JSON.' : tree(parsed.value);
  }
  update();
}
