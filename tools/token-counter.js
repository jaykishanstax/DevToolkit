import { createEditor } from '../components/editor.js';
import { getSetting, setSetting } from '../scripts/state.js';

const models = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 5, output: 15 },
  'claude-sonnet': { input: 3, output: 15 }
};
function estimate(text) {
  const words = (text.trim().match(/\S+/g) || []).length;
  return Math.max(0, Math.ceil(Math.max(text.length / 4, words * 1.33)));
}

export function render(container) {
  const model = getSetting('tokenModel', 'gpt-4o-mini');
  const controls = document.createElement('section');
  controls.className = 'panel form-grid';
  controls.innerHTML = `<label class="form-field">Model preset<select id="model">${Object.keys(models).map((name) => `<option ${name === model ? 'selected' : ''}>${name}</option>`).join('')}</select></label><label class="form-field">Expected output tokens<input id="out" type="number" min="0" value="1000"></label>`;
  const editor = createEditor({ label: 'Prompt text', onInput: update, clear: true });
  const metrics = document.createElement('div');
  metrics.className = 'metric-grid';
  const note = document.createElement('p');
  note.className = 'muted';
  note.textContent = 'Token counts are browser-only estimates, not tokenizer-exact vendor counts.';
  container.append(controls, editor.wrapper, metrics, note);
  controls.addEventListener('input', () => { setSetting('tokenModel', controls.querySelector('#model').value); update(); });
  function update() {
    const inputTokens = estimate(editor.textarea.value);
    const outputTokens = Number(controls.querySelector('#out').value) || 0;
    const pricing = models[controls.querySelector('#model').value];
    metrics.innerHTML = `<div class="metric"><span>Characters</span><strong>${editor.textarea.value.length}</strong></div><div class="metric"><span>Words</span><strong>${(editor.textarea.value.trim().match(/\S+/g) || []).length}</strong></div><div class="metric"><span>Estimated tokens</span><strong>${inputTokens}</strong></div><div class="metric"><span>Estimated cost</span><strong>$${((inputTokens * pricing.input + outputTokens * pricing.output) / 1000000).toFixed(4)}</strong></div>`;
  }
  update();
}
