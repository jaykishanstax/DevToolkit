import { isFavorite, toggleFavorite } from '../scripts/state.js';
import { showToast } from './toast.js';

export function createToolCard(tool) {
  const card = document.createElement('article');
  card.className = 'tool-card';
  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = `#/tool/${tool.id}`;
  link.textContent = tool.title;
  title.append(link);
  const description = document.createElement('p');
  description.textContent = tool.description;
  const meta = document.createElement('div');
  meta.className = 'tool-card-meta';
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = tool.category;
  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = 'button button-ghost';
  favorite.setAttribute('aria-label', `Toggle favorite for ${tool.title}`);
  favorite.textContent = isFavorite(tool.id) ? '★' : '☆';
  favorite.addEventListener('click', () => {
    const active = toggleFavorite(tool.id);
    favorite.textContent = active ? '★' : '☆';
    showToast(active ? 'Added to favorites.' : 'Removed from favorites.', 'success');
  });
  meta.append(badge, favorite);
  card.append(title, description, meta);
  return card;
}
