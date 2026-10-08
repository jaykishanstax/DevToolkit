import { createEditor } from '../components/editor.js';
import { showToast } from '../components/toast.js';
import { createToolbar } from '../components/toolbar.js';
import { copyText } from '../scripts/clipboard.js';
import { downloadText } from '../scripts/download.js';
import { DEFAULT_HTML_PREVIEW, getHtmlPreviewStatus, normalizeHtmlDocument } from '../scripts/logic/html-preview.js';

export function render(container) {
  const editor = createEditor({ label: 'HTML', value: DEFAULT_HTML_PREVIEW, placeholder: '<h1>Hello</h1>', onInput: update });
  const frame = document.createElement('iframe');
  frame.className = 'preview-frame';
  frame.title = 'HTML preview';
  frame.sandbox = 'allow-forms allow-modals';

  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const toolbar = createToolbar([
    { label: 'Copy HTML', onClick: copyHtml },
    { label: 'Clear', variant: 'danger', onClick: clearHtml },
    { label: 'Download HTML', variant: 'primary', onClick: downloadHtml }
  ]);

  const panel = document.createElement('section');
  panel.className = 'panel';
  const heading = document.createElement('h2');
  heading.textContent = 'Live preview';
  panel.append(heading, frame);

  const layout = document.createElement('div');
  layout.className = 'tool-layout html-preview-layout';
  layout.append(editor.wrapper, panel);
  container.append(toolbar, status, layout);

  function update() {
    try {
      frame.srcdoc = normalizeHtmlDocument(editor.textarea.value);
      const previewStatus = getHtmlPreviewStatus(editor.textarea.value);
      status.className = previewStatus.type === 'success' ? 'status-success' : 'status-warning';
      status.textContent = previewStatus.message;
    } catch (error) {
      status.className = 'status-danger';
      status.textContent = error.message || 'Unable to update preview.';
      showToast(status.textContent, 'error');
    }
  }

  function copyHtml() {
    if (!editor.textarea.value.trim()) {
      showToast('There is no HTML to copy.', 'warning');
      return;
    }
    copyText(editor.textarea.value, 'HTML copied to clipboard.');
  }

  function clearHtml() {
    editor.textarea.value = '';
    update();
    showToast('HTML editor cleared.', 'success');
    editor.textarea.focus();
  }

  function downloadHtml() {
    const html = normalizeHtmlDocument(editor.textarea.value);
    if (!html) {
      showToast('There is no HTML to download.', 'warning');
      return;
    }
    downloadText('preview.html', html, 'text/html');
    showToast('HTML download started.', 'success');
  }

  update();
}
