import { getTheme, setTheme } from './state.js';

export function applyTheme(theme = getTheme()) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0F172A' : '#F8FAFC');
  const button = document.querySelector('#theme-toggle');
  if (button) {
    button.textContent = theme === 'dark' ? '☾' : '☀';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

export function initTheme() {
  applyTheme();
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  });
}
