import { showToast } from '../components/toast.js';

export async function copyText(text, successMessage = 'Copied to clipboard.') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage, 'success');
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    showToast(copied ? successMessage : 'Copy failed.', copied ? 'success' : 'error');
    return copied;
  }
}
