import { createEditor } from '../components/editor.js';
import { showToast } from '../components/toast.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { getTextStats, textTransforms } from '../scripts/logic/text-formatter.js';

export function render(container) {
  const input = createEditor({ label: 'Input text', placeholder: 'Paste text to transform...', onInput: update });
  const output = createEditor({ label: 'Output text', copy: true });
  const stats = document.createElement('div');
  stats.className = 'metric-grid';
  stats.setAttribute('aria-live', 'polite');

  const toolbar = createToolbar([
    ...textTransforms.map((transform) => ({ label: transform.label, onClick: () => applyTransform(transform) })),
    { label: 'Copy output', variant: 'primary', onClick: () => copyOutput() },
    { label: 'Clear', variant: 'danger', onClick: () => clearText() }
  ]);

  const layout = document.createElement('div');
  layout.className = 'tool-layout';
  layout.append(input.wrapper, output.wrapper);
  container.append(toolbar, layout, stats);

  function applyTransform(transform) {
    try {
      output.textarea.value = transform.apply(input.textarea.value);
      update();
      showToast(`${transform.label} applied.`, 'success');
    } catch (error) {
      showToast(error.message || 'Unable to format text.', 'error');
    }
  }

  function copyOutput() {
    if (!output.textarea.value) {
      showToast('There is no formatted text to copy.', 'warning');
      return;
    }
    copyText(output.textarea.value, 'Formatted text copied to clipboard.');
  }

  function clearText() {
    input.textarea.value = '';
    output.textarea.value = '';
    update();
    showToast('Text Formatter cleared.', 'success');
    input.textarea.focus();
  }

  function update() {
    const text = input.textarea.value;
    const values = getTextStats(text);
    stats.replaceChildren(
      metric('Characters', values.characters),
      metric('Words', values.words),
      metric('Lines', values.lines)
    );
  }

  update();
}

function metric(label, value) {
  const element = document.createElement('div');
  element.className = 'metric';
  const name = document.createElement('span');
  name.textContent = label;
  const count = document.createElement('strong');
  count.textContent = String(value);
  element.append(name, count);
  return element;
}
