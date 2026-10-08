import { renderDiffSummary, renderInlineDiff, renderSideBySideDiff } from '../components/diff-viewer.js';
import { createEditor } from '../components/editor.js';
import { showToast } from '../components/toast.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { createLineDiff, diffToText, splitLines, summarizeDiff } from '../scripts/logic/text-diff.js';
import { getSetting, setSetting } from '../scripts/state.js';

const MAX_DIFF_LINES = 1500;

export function render(container) {
  const original = createEditor({ label: 'Original text', clear: true, onInput: update, placeholder: 'Paste the original text...' });
  const changed = createEditor({ label: 'Changed text', clear: true, onInput: update, placeholder: 'Paste the changed text...' });
  const ignore = document.createElement('label');
  ignore.className = 'checkbox-row';
  const ignoreInput = document.createElement('input');
  ignoreInput.type = 'checkbox';
  ignoreInput.checked = getSetting('textDiffIgnoreWhitespace', true);
  ignore.append(ignoreInput, ' Ignore whitespace');

  const view = document.createElement('select');
  view.innerHTML = '<option value="side">Side-by-side</option><option value="inline">Unified inline</option>';
  view.setAttribute('aria-label', 'Diff view');

  const status = document.createElement('p');
  status.className = 'muted';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const result = document.createElement('section');
  result.className = 'panel';
  result.innerHTML = '<h2>Diff result</h2><div class="result-panel"></div>';
  const resultPanel = result.querySelector('.result-panel');

  const options = document.createElement('div');
  options.className = 'toolbar';
  options.append(ignore, view);

  const toolbar = createToolbar([
    { label: 'Copy diff', variant: 'primary', onClick: () => copyCurrentDiff() },
    { label: 'Clear', variant: 'danger', onClick: () => clearInputs() }
  ]);

  const layout = document.createElement('div');
  layout.className = 'tool-layout diff-editor-layout';
  layout.append(original.wrapper, changed.wrapper);
  container.append(options, toolbar, layout, status, result);

  ignoreInput.addEventListener('input', () => {
    setSetting('textDiffIgnoreWhitespace', ignoreInput.checked);
    update();
    showToast(`Whitespace is now ${ignoreInput.checked ? 'ignored' : 'included'} in comparisons.`, 'info');
  });
  view.addEventListener('input', update);

  function currentRows() {
    const lineCount = splitLines(original.textarea.value).length + splitLines(changed.textarea.value).length;
    if (lineCount > MAX_DIFF_LINES) {
      throw new Error(`Diff is limited to ${MAX_DIFF_LINES} total lines for browser responsiveness.`);
    }
    return createLineDiff(original.textarea.value, changed.textarea.value, { ignoreWhitespace: ignoreInput.checked });
  }

  function update() {
    try {
      const rows = currentRows();
      const summary = summarizeDiff(rows);
      status.className = 'muted';
      status.textContent = `${summary.added} additions, ${summary.removed} removals, ${summary.changed} modifications.`;
      resultPanel.innerHTML = renderDiffSummary(summary) + (view.value === 'inline' ? renderInlineDiff(rows) : renderSideBySideDiff(rows));
    } catch (error) {
      status.className = 'status-danger';
      status.textContent = error.message;
      resultPanel.textContent = '';
      showToast(error.message, 'error');
    }
  }

  function copyCurrentDiff() {
    try {
      const rows = currentRows();
      const text = diffToText(rows);
      if (!text.trim()) {
        showToast('There is no diff output to copy.', 'warning');
        return;
      }
      copyText(text, 'Diff copied to clipboard.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  function clearInputs() {
    original.textarea.value = '';
    changed.textarea.value = '';
    update();
    showToast('Diff inputs cleared.', 'success');
    original.textarea.focus();
  }

  update();
}
