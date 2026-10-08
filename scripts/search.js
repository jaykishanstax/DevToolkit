import { tools } from './tools-registry.js';
import { debounce, escapeHtml } from './utils.js';

export function initSearch() {
  const input = document.querySelector('#global-search');
  const results = document.querySelector('#search-results');
  if (!input || !results) return;

  function close() {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  }

  function render(query) {
    const normalized = query.trim().toLowerCase();
    results.replaceChildren();
    if (!normalized) return close();
    const matches = tools.filter((tool) => [tool.title, tool.category, tool.description, ...(tool.keywords || [])].join(' ').toLowerCase().includes(normalized)).slice(0, 8);
    if (!matches.length) {
      results.innerHTML = '<div class="search-result muted">No tools found</div>';
    } else {
      for (const tool of matches) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'search-result';
        button.setAttribute('role', 'option');
        button.innerHTML = `<strong>${escapeHtml(tool.title)}</strong><br><span class="muted">${escapeHtml(tool.category)} · ${escapeHtml(tool.description)}</span>`;
        button.addEventListener('click', () => {
          location.hash = `#/tool/${tool.id}`;
          input.value = '';
          close();
        });
        results.append(button);
      }
    }
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('input', debounce(() => render(input.value)));
  input.addEventListener('keydown', (event) => {
    const options = [...results.querySelectorAll('.search-result[role="option"]')];
    const current = document.activeElement;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowDown' && options.length) {
      event.preventDefault();
      (options[options.indexOf(current) + 1] || options[0]).focus();
    }
  });
  results.addEventListener('keydown', (event) => {
    const options = [...results.querySelectorAll('.search-result[role="option"]')];
    const index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') { close(); input.focus(); }
    if (event.key === 'ArrowDown') { event.preventDefault(); (options[index + 1] || options[0])?.focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); (options[index - 1] || options.at(-1))?.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!results.contains(event.target) && event.target !== input) close();
  });
}
