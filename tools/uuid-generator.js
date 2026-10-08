import { showToast } from '../components/toast.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { downloadText } from '../scripts/download.js';
import { clampUuidQuantity, formatUuidList, generateUuids } from '../scripts/logic/uuid-generator.js';

export function render(container) {
  const controls = document.createElement('section');
  controls.className = 'panel form-grid';

  const field = document.createElement('label');
  field.className = 'form-field';
  field.textContent = 'Quantity (1-1000)';
  const quantity = document.createElement('input');
  quantity.id = 'uuid-quantity';
  quantity.type = 'number';
  quantity.min = '1';
  quantity.max = '1000';
  quantity.value = '10';
  field.append(quantity);
  controls.append(field);

  const status = document.createElement('p');
  status.className = 'muted';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const output = document.createElement('textarea');
  output.className = 'code-editor monospace';
  output.setAttribute('aria-label', 'Generated UUIDs');
  output.readOnly = true;

  const toolbar = createToolbar([
    { label: 'Generate', variant: 'primary', onClick: generate },
    { label: 'Copy', onClick: copyOutput },
    { label: 'Clear', variant: 'danger', onClick: clearOutput },
    { label: 'Export .txt', onClick: exportOutput }
  ]);

  container.append(controls, toolbar, status, output);

  function generate() {
    try {
      const count = clampUuidQuantity(quantity.value);
      quantity.value = String(count);
      output.value = formatUuidList(generateUuids(count));
      status.className = 'status-success';
      status.textContent = `${count} UUID${count === 1 ? '' : 's'} generated.`;
      showToast(status.textContent, 'success');
    } catch (error) {
      status.className = 'status-danger';
      status.textContent = error.message || 'Unable to generate UUIDs.';
      showToast(status.textContent, 'error');
    }
  }

  function copyOutput() {
    if (!output.value) {
      showToast('There are no UUIDs to copy.', 'warning');
      return;
    }
    copyText(output.value, 'UUIDs copied to clipboard.');
  }

  function clearOutput() {
    output.value = '';
    status.className = 'muted';
    status.textContent = 'UUID output cleared.';
    showToast('UUID output cleared.', 'success');
    quantity.focus();
  }

  function exportOutput() {
    if (!output.value) {
      showToast('There are no UUIDs to export.', 'warning');
      return;
    }
    downloadText('uuids.txt', output.value);
    showToast('UUID export started.', 'success');
  }

  generate();
}
