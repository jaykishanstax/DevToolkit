import { closeModal, openModal } from '../components/modal.js';

function helpContent() {
  const content = document.createElement('div');
  content.innerHTML = '<p>Keyboard shortcuts:</p><ul><li><kbd>Ctrl/Cmd + K</kbd> Focus global search</li><li><kbd>Ctrl/Cmd + B</kbd> Toggle sidebar/drawer</li><li><kbd>Ctrl/Cmd + /</kbd> Open this help</li><li><kbd>Esc</kbd> Close modal, search, or drawer</li><li><kbd>Ctrl/Cmd + S</kbd> Save current prompt draft where supported</li></ul>';
  return content;
}

export function initShortcuts({ toggleSidebar, closeSidebar }) {
  document.addEventListener('keydown', (event) => {
    const meta = event.metaKey || event.ctrlKey;
    if (meta && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.querySelector('#global-search')?.focus();
    } else if (meta && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      toggleSidebar();
    } else if (meta && event.key === '/') {
      event.preventDefault();
      openModal({ title: 'Shortcuts', content: helpContent() });
    } else if (event.key === 'Escape') {
      closeModal();
      closeSidebar();
      const results = document.querySelector('#search-results');
      if (results) results.hidden = true;
    }
  });
}
