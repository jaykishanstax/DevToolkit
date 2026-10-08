import { createToolCard } from '../components/tool-card.js';
import { showToast } from '../components/toast.js';
import { categories, getCategory, getTool, getToolsByCategory, tools } from './tools-registry.js';
import { getLastTool, isFavorite, setLastTool, toggleFavorite } from './state.js';

const routeView = () => document.querySelector('#route-view');

function toolHeader(tool) {
  const header = document.createElement('div');
  header.className = 'tool-header';
  const copy = document.createElement('div');
  copy.innerHTML = `<h1>${tool.title}</h1><p>${tool.description}</p>`;
  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = 'button button-ghost';
  favorite.textContent = isFavorite(tool.id) ? '★ Favorite' : '☆ Favorite';
  favorite.addEventListener('click', () => {
    const active = toggleFavorite(tool.id);
    favorite.textContent = active ? '★ Favorite' : '☆ Favorite';
    window.dispatchEvent(new CustomEvent('devtoolkit:navigation-change'));
    showToast(active ? 'Added to favorites.' : 'Removed from favorites.', 'success');
  });
  header.append(copy, favorite);
  return header;
}

export function parseRoute() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'tool' && parts[1]) return { type: 'tool', id: parts[1] };
  if (parts[0] === 'category' && parts[1]) return { type: 'category', id: parts[1] };
  return { type: 'home' };
}

export function navigateTo(hash) {
  location.hash = hash;
}

export async function renderRoute() {
  const target = routeView();
  if (!target) return;
  const route = parseRoute();
  target.replaceChildren();

  if (route.type === 'tool') {
    const tool = getTool(route.id);
    if (!tool) {
      target.innerHTML = '<section class="panel"><h1>Tool not found</h1><p class="muted">Choose another tool from the sidebar.</p></section>';
      document.title = 'Tool not found · DevToolkit';
      return;
    }
    target.append(toolHeader(tool));
    const mount = document.createElement('section');
    mount.className = 'tool-panel';
    target.append(mount);
    document.title = `${tool.title} · DevToolkit`;
    setLastTool(tool.id);
    try {
      const module = await tool.load();
      module.render(mount, tool);
    } catch (error) {
      mount.innerHTML = `<section class="panel"><h2>Unable to load tool</h2><p class="status-danger">${error.message}</p></section>`;
    }
  } else if (route.type === 'category') {
    const category = getCategory(route.id);
    const list = getToolsByCategory(route.id);
    target.innerHTML = `<section class="home-hero"><h1>${category?.name || 'Category'}</h1><p>${list.length} tools available in this category.</p></section>`;
    const grid = document.createElement('div');
    grid.className = 'tool-grid';
    list.forEach((tool) => grid.append(createToolCard(tool)));
    target.append(grid);
    document.title = `${category?.name || 'Category'} · DevToolkit`;
  } else {
    const lastTool = getLastTool();
    target.innerHTML = '<section class="home-hero"><h1>DevToolkit</h1><p>All Essential Developer Utilities in One Place. Pick a tool, search instantly, favorite your workflow, and keep everything local in your browser.</p><div class="toolbar"><a class="button button-primary" href="#/tool/json-formatter">Start with JSON Formatter</a><a class="button button-secondary" href="#/tool/text-diff">Open Diff Checker</a></div></section>';
    const grid = document.createElement('div');
    grid.className = 'tool-grid';
    tools.forEach((tool) => grid.append(createToolCard(tool)));
    target.append(grid);
    if (lastTool && !location.hash) location.hash = `#/tool/${lastTool}`;
    document.title = 'DevToolkit';
  }
  window.dispatchEvent(new CustomEvent('devtoolkit:navigation-change'));
  document.querySelector('#main-content')?.focus({ preventScroll: true });
}

export function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
