import { readTextFile } from '../scripts/utils.js';
import { showToast } from './toast.js';

export function createFileDropZone({ label = 'Drop a file here or click to choose', accept = '', onText, onFile } = {}) {
  const zone = document.createElement('label');
  zone.className = 'file-drop-zone';
  zone.tabIndex = 0;
  zone.textContent = label;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.className = 'sr-only';
  zone.append(input);

  async function handleFile(file) {
    if (!file) return;
    try {
      if (onFile) await onFile(file);
      else if (onText) onText(await readTextFile(file), file);
      showToast(`Loaded ${file.name}.`, 'success');
    } catch (error) {
      showToast(error.message || 'Unable to load file.', 'error');
    }
  }

  input.addEventListener('change', () => handleFile(input.files?.[0]));
  zone.addEventListener('dragover', (event) => { event.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove('drag-over');
    handleFile(event.dataTransfer.files?.[0]);
  });
  zone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      input.click();
    }
  });
  return zone;
}
