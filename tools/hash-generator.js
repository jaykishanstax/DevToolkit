import { createEditor } from '../components/editor.js';
import { copyText } from '../scripts/clipboard.js';

function hex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
async function sha(algorithm, text) {
  return hex(await crypto.subtle.digest(algorithm, new TextEncoder().encode(text)));
}
function rotate(value, bits) {
  return (value << bits) | (value >>> (32 - bits));
}
function add(...values) {
  return values.reduce((sum, value) => (sum + value) | 0, 0);
}
function md5(input) {
  const bytes = [...new TextEncoder().encode(input)];
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i += 1) bytes.push((bitLength >>> (8 * i)) & 255);
  const shifts = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const constants = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0);
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  for (let chunk = 0; chunk < bytes.length; chunk += 64) {
    const words = Array.from({ length: 16 }, (_, j) => bytes[chunk + j * 4] | (bytes[chunk + j * 4 + 1] << 8) | (bytes[chunk + j * 4 + 2] << 16) | (bytes[chunk + j * 4 + 3] << 24));
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i += 1) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const temp = d;
      d = c;
      c = b;
      b = add(b, rotate(add(a, f, constants[i], words[g]), shifts[i]));
      a = temp;
    }
    a0 = add(a0, a); b0 = add(b0, b); c0 = add(c0, c); d0 = add(d0, d);
  }
  return [a0, b0, c0, d0].map((word) => [0, 8, 16, 24].map((shift) => ((word >>> shift) & 255).toString(16).padStart(2, '0')).join('')).join('');
}

export function render(container) {
  const editor = createEditor({ label: 'Text to hash', onInput: update, clear: true });
  const grid = document.createElement('section');
  grid.className = 'panel hash-grid';
  grid.innerHTML = '<h2>Hashes</h2>';
  container.append(editor.wrapper, grid);
  async function update() {
    const text = editor.textarea.value;
    grid.innerHTML = '<h2>Hashes</h2>';
    const values = { MD5: md5(text) };
    if (crypto?.subtle) {
      values['SHA-1'] = await sha('SHA-1', text);
      values['SHA-256'] = await sha('SHA-256', text);
      values['SHA-512'] = await sha('SHA-512', text);
    }
    for (const [name, value] of Object.entries(values)) {
      const row = document.createElement('div');
      row.className = 'hash-row';
      row.innerHTML = `<strong>${name}</strong><code>${value}</code>`;
      const button = document.createElement('button');
      button.className = 'button button-ghost';
      button.type = 'button';
      button.textContent = 'Copy';
      button.onclick = () => copyText(value);
      row.append(button);
      grid.append(row);
    }
  }
  update();
}
