let previousFocus = null;

export function openModal({ title, content }) {
  const root = document.querySelector('#modal-root');
  if (!root) return;
  closeModal();
  previousFocus = document.activeElement;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal();
  });

  const modal = document.createElement('section');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.tabIndex = -1;

  const header = document.createElement('header');
  const heading = document.createElement('h2');
  heading.id = 'modal-title';
  heading.textContent = title;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'icon-button';
  close.setAttribute('aria-label', 'Close dialog');
  close.textContent = '×';
  close.addEventListener('click', closeModal);
  header.append(heading, close);

  const body = document.createElement('div');
  if (typeof content === 'string') body.innerHTML = content;
  else body.append(content);
  modal.append(header, body);
  backdrop.append(modal);
  root.append(backdrop);
  modal.focus();
}

export function closeModal() {
  document.querySelector('#modal-root .modal-backdrop')?.remove();
  if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
}
