import { createEditor } from '../components/editor.js';
import { escapeHtml } from '../scripts/utils.js';

export function render(container) {
  const controls = document.createElement('section');
  controls.className = 'panel form-grid';
  controls.innerHTML = '<label class="form-field">Pattern<input id="regex-pattern" placeholder="\bword\b"></label>' + ['g', 'i', 'm', 's'].map((flag) => `<label class="checkbox-row"><input type="checkbox" value="${flag}" ${flag === 'g' ? 'checked' : ''}> ${flag}</label>`).join('');
  const input = createEditor({ label: 'Test string', placeholder: 'Paste text to match...', onInput: update });
  const result = document.createElement('section');
  result.className = 'panel';
  result.innerHTML = '<h2>Matches</h2><div class="result-panel" id="regex-result"></div><div id="regex-details" class="output-list"></div>';
  container.append(controls, input.wrapper, result);
  controls.addEventListener('input', update);
  function update() {
    const pattern = controls.querySelector('#regex-pattern').value;
    const flags = [...controls.querySelectorAll('input[type="checkbox"]:checked')].map((item) => item.value).join('');
    const output = result.querySelector('#regex-result');
    const details = result.querySelector('#regex-details');
    if (!pattern) { output.textContent = 'Enter a pattern to begin.'; details.replaceChildren(); return; }
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const text = input.textarea.value;
      let html = '';
      let last = 0;
      let count = 0;
      let match;
      details.replaceChildren();
      while ((match = regex.exec(text)) !== null) {
        count += 1;
        html += escapeHtml(text.slice(last, match.index)) + `<mark class="match-highlight">${escapeHtml(match[0])}</mark>`;
        last = match.index + match[0].length;
        const item = document.createElement('div');
        item.className = 'panel';
        item.textContent = `#${count} at ${match.index}: ${match[0] || '(zero-width match)'}`;
        details.append(item);
        if (match[0] === '') regex.lastIndex += 1;
      }
      output.innerHTML = count ? html + escapeHtml(text.slice(last)) : 'No matches.';
    } catch (error) {
      output.innerHTML = `<span class="status-danger">${escapeHtml(error.message)}</span>`;
      details.replaceChildren();
    }
  }
  update();
}
