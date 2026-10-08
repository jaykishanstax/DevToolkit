import { openModal } from '../components/modal.js';
import { categories, getToolsByCategory, tools } from './tools-registry.js';
import { getFavorites, getRecentTools } from './state.js';
import { initRouter, parseRoute } from './router.js';
import { initSearch } from './search.js';
import { initTheme } from './theme.js';
import { initShortcuts } from './shortcuts.js';

const sidebar = document.querySelector('#app-sidebar');
const backdrop = document.querySelector('#drawer-backdrop');
const toggle = document.querySelector('#sidebar-toggle');

function setSidebarOpen(open) {
  sidebar?.classList.toggle('open', open);
  if (backdrop) backdrop.hidden = !open;
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

function toggleSidebar() {
  setSidebarOpen(!sidebar?.classList.contains('open'));
}

function closeSidebar() {
  setSidebarOpen(false);
}

function section(title, links) {
  const wrap = document.createElement('section');
  wrap.className = 'sidebar-section';
  const heading = document.createElement('h2');
  heading.className = 'sidebar-title';
  heading.innerHTML = `<span>${title}</span><span>${links.length}</span>`;
  wrap.append(heading);
  for (const item of links) {
    const link = document.createElement('a');
    link.className = 'sidebar-link';
    link.href = item.href;
    link.innerHTML = `<span>${item.label}</span>${item.count ? `<span>${item.count}</span>` : ''}`;
    link.addEventListener('click', closeSidebar);
    wrap.append(link);
  }
  return wrap;
}

function renderSidebar() {
  const nav = document.querySelector('#sidebar-nav');
  if (!nav) return;
  nav.replaceChildren();
  nav.append(section('Categories', categories.map((category) => ({ label: category.name, href: `#/category/${category.id}`, count: getToolsByCategory(category.id).length }))));
  const favorites = getFavorites().map((id) => tools.find((tool) => tool.id === id)).filter(Boolean);
  nav.append(section('Favorites', favorites.length ? favorites.map((tool) => ({ label: tool.title, href: `#/tool/${tool.id}` })) : [{ label: 'No favorites yet', href: '#/' }]));
  const recent = getRecentTools().map((id) => tools.find((tool) => tool.id === id)).filter(Boolean);
  nav.append(section('Recent Tools', recent.length ? recent.map((tool) => ({ label: tool.title, href: `#/tool/${tool.id}` })) : [{ label: 'Recently opened tools appear here', href: '#/' }]));
  nav.append(section('All Tools', tools.map((tool) => ({ label: tool.title, href: `#/tool/${tool.id}` }))));
  updateActiveLinks();
}

function updateActiveLinks() {
  const route = parseRoute();
  document.querySelectorAll('.sidebar-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#/${route.type}/${route.id}`);
  });
}

function initAbout() {
  document.querySelector('#about-button')?.addEventListener('click', () => {
    const content = document.createElement('div');
    content.innerHTML = '<p><strong>DevToolkit</strong> is a static, local-first developer utility SPA. It makes no network calls for tool execution and stores preferences in localStorage.</p><p class="muted">Built with pure HTML, CSS, JavaScript, and native ES modules.</p>';
    openModal({ title: 'About DevToolkit', content });
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!['http:', 'https:'].includes(location.protocol)) return;
  navigator.serviceWorker.register('./service-worker.js').catch(() => undefined);
}

toggle?.addEventListener('click', toggleSidebar);
backdrop?.addEventListener('click', closeSidebar);
window.addEventListener('devtoolkit:navigation-change', renderSidebar);
window.addEventListener('devtoolkit:state-change', renderSidebar);

initTheme();
renderSidebar();
initSearch();
initShortcuts({ toggleSidebar, closeSidebar });
initAbout();
initRouter();
registerServiceWorker();
