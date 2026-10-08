export function createToolbar(actions = []) {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  for (const action of actions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `button button-${action.variant || 'secondary'}`;
    button.textContent = action.label;
    if (action.ariaLabel) button.setAttribute('aria-label', action.ariaLabel);
    if (action.onClick) button.addEventListener('click', action.onClick);
    toolbar.append(button);
  }
  return toolbar;
}
