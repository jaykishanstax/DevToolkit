import { copyText } from '../scripts/clipboard.js';

let editorCounter = 0;

export function createEditor({ label, value = '', helper = '', rows = 12, placeholder = '', copy = false, clear = false, onInput } = {}) {
  editorCounter += 1;
  const id = `editor-${editorCounter}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-field';

  const labelRow = document.createElement('div');
  labelRow.className = 'editor-label-row';
  const labelElement = document.createElement('label');
  labelElement.htmlFor = id;
  labelElement.textContent = label || 'Editor';
  labelRow.append(labelElement);

  const actions = document.createElement('div');
  actions.className = 'toolbar';
  labelRow.append(actions);

  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.className = 'code-editor monospace';
  textarea.rows = rows;
  textarea.placeholder = placeholder;
  textarea.value = value;
  if (onInput) textarea.addEventListener('input', () => onInput(textarea.value, textarea));

  if (copy) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-ghost';
    button.textContent = 'Copy';
    button.addEventListener('click', () => copyText(textarea.value));
    actions.append(button);
  }

  if (clear) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-ghost';
    button.textContent = 'Clear';
    button.addEventListener('click', () => {
      textarea.value = '';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    actions.append(button);
  }

  wrapper.append(labelRow, textarea);
  if (helper) {
    const help = document.createElement('p');
    help.className = 'editor-help';
    help.textContent = helper;
    wrapper.append(help);
  }
  return { wrapper, textarea };
}
