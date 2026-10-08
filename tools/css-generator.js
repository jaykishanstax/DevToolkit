import { copyText } from '../scripts/clipboard.js';

export function render(container) {
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.innerHTML = '<div class="form-grid"><label class="form-field">Mode<select id="mode"><option>button</option><option>gradient</option><option>shadow</option><option>radius</option></select></label><label class="form-field">Primary color<input id="c1" type="color" value="#3b82f6"></label><label class="form-field">Accent color<input id="c2" type="color" value="#38bdf8"></label><label class="form-field">Radius<input id="radius" type="range" min="0" max="48" value="14"></label><label class="form-field">Depth<input id="depth" type="range" min="0" max="40" value="16"></label></div>';
  const preview = document.createElement('div');
  preview.className = 'css-preview';
  preview.innerHTML = '<button class="generated-button">Preview</button>';
  const output = document.createElement('textarea');
  output.className = 'code-editor monospace';
  output.setAttribute('aria-label', 'Generated CSS');
  const copy = document.createElement('button');
  copy.className = 'button button-primary';
  copy.type = 'button';
  copy.textContent = 'Copy CSS';
  copy.onclick = () => copyText(output.value);
  container.append(panel, preview, output, copy);
  panel.addEventListener('input', update);
  function update() {
    const value = (selector) => panel.querySelector(selector).value;
    const c1 = value('#c1');
    const c2 = value('#c2');
    const radius = value('#radius');
    const depth = value('#depth');
    const mode = value('#mode');
    let css = '';
    if (mode === 'button') css = `.button {
  background: linear-gradient(135deg, ${c1}, ${c2});
  border-radius: ${radius}px;
  box-shadow: 0 ${Math.round(depth / 2)}px ${depth}px ${c1}55;
  color: white;
  padding: 0.75rem 1rem;
}`;
    if (mode === 'gradient') css = `.gradient {
  background: linear-gradient(135deg, ${c1}, ${c2});
}`;
    if (mode === 'shadow') css = `.shadow {
  box-shadow: 0 ${Math.round(depth / 2)}px ${depth}px rgba(15, 23, 42, 0.28);
}`;
    if (mode === 'radius') css = `.rounded {
  border-radius: ${radius}px;
}`;
    output.value = css;
    preview.querySelector('button').style.cssText = css.replace(/\.\w+\s*{|}/g, '');
    preview.style.background = `linear-gradient(135deg, ${c1}33, ${c2}33)`;
  }
  update();
}
