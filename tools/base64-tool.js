import { createEditor } from '../components/editor.js';
import { createFileDropZone } from '../components/file-drop-zone.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { formatBytes } from '../scripts/utils.js';

function encodeUtf8(text) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)));
}
function decodeUtf8(base64) {
  const binary = atob(base64.replace(/\s+/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function render(container) {
  const input = createEditor({ label: 'Input', clear: true });
  const output = createEditor({ label: 'Output', copy: true });
  const info = document.createElement('p');
  const toolbar = createToolbar([
    { label: 'Encode text', variant: 'primary', onClick: () => { output.textarea.value = encodeUtf8(input.textarea.value); info.className = 'status-success'; info.textContent = 'Encoded UTF-8 text.'; } },
    { label: 'Decode text', onClick: () => { try { output.textarea.value = decodeUtf8(input.textarea.value); info.className = 'status-success'; info.textContent = 'Decoded UTF-8 text.'; } catch { info.className = 'status-warning'; info.textContent = 'Input is not valid Base64.'; } } },
    { label: 'Copy output', onClick: () => copyText(output.textarea.value) }
  ]);
  const drop = createFileDropZone({ label: 'Drop a file to convert it to a Base64 data URL', onFile: (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { output.textarea.value = String(reader.result); info.className = 'muted'; info.textContent = `Converted ${file.name} (${formatBytes(file.size)}).`; resolve(); };
    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  }) });
  const layout = document.createElement('div');
  layout.className = 'tool-layout';
  layout.append(input.wrapper, output.wrapper);
  container.append(drop, toolbar, layout, info);
}
