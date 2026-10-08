import { createEditor } from '../components/editor.js';
import { escapeHtml } from '../scripts/utils.js';

function decodeBase64Url(part) {
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}
function formatTime(value) {
  return value ? new Date(value * 1000).toLocaleString() : 'Not present';
}

export function render(container) {
  const input = createEditor({ label: 'JWT token', placeholder: 'eyJhbGciOi...', clear: true, onInput: update });
  const output = document.createElement('section');
  output.className = 'panel';
  output.innerHTML = '<h2>Decoded token</h2><div class="result-panel"></div>';
  container.append(input.wrapper, output);
  function update() {
    const panel = output.querySelector('.result-panel');
    const token = input.textarea.value.trim();
    if (!token) { panel.textContent = 'Paste a JWT to decode.'; return; }
    const parts = token.split('.');
    if (parts.length !== 3) { panel.innerHTML = '<p class="status-danger">Invalid token shape. JWTs have three dot-separated parts.</p>'; return; }
    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      const warnings = ['Signature is not verified in this browser-only decoder.'];
      if (payload.exp && payload.exp * 1000 < Date.now()) warnings.push('Token is expired.');
      panel.innerHTML = `<h3>Header</h3><pre>${escapeHtml(JSON.stringify(header, null, 2))}</pre><h3>Payload</h3><pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre><h3>Signature</h3><p class="jwt-segment">${escapeHtml(parts[2])}</p><h3>Timestamps</h3><ul><li>Expires: ${escapeHtml(formatTime(payload.exp))}</li><li>Issued at: ${escapeHtml(formatTime(payload.iat))}</li><li>Not before: ${escapeHtml(formatTime(payload.nbf))}</li></ul><h3>Warnings</h3>${warnings.map((warning) => `<p class="status-warning">${escapeHtml(warning)}</p>`).join('')}`;
    } catch (error) {
      panel.innerHTML = `<p class="status-danger">Invalid JWT JSON/Base64URL: ${escapeHtml(error.message)}</p>`;
    }
  }
  update();
}
