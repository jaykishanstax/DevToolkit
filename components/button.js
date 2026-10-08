export function createButton({ text = '', variant = 'secondary', type = 'button', ariaLabel = '', onClick } = {}) {
  const button = document.createElement('button');
  button.type = type;
  button.className = `button button-${variant}`;
  button.textContent = text;
  if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
  if (onClick) button.addEventListener('click', onClick);
  return button;
}
