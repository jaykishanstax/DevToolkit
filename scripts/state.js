import { getStoredValue, setStoredValue } from './storage.js';

const DEFAULT_STATE = {
  theme: 'dark',
  lastTool: '',
  favorites: [],
  recentTools: [],
  settings: {
    textDiffIgnoreWhitespace: true,
    jsonCompareIgnoreOrder: true,
    tokenModel: 'gpt-4o-mini'
  },
  promptBuilderDraft: {
    role: '',
    task: '',
    context: '',
    rules: '',
    outputFormat: ''
  }
};

let state = { ...DEFAULT_STATE, ...getStoredValue('state', DEFAULT_STATE) };
state.settings = { ...DEFAULT_STATE.settings, ...(state.settings || {}) };
state.promptBuilderDraft = { ...DEFAULT_STATE.promptBuilderDraft, ...(state.promptBuilderDraft || {}) };

function persist() {
  setStoredValue('state', state);
  window.dispatchEvent(new CustomEvent('devtoolkit:state-change', { detail: state }));
}

export function getState() {
  return typeof structuredClone === 'function' ? structuredClone(state) : JSON.parse(JSON.stringify(state));
}

export function getTheme() { return state.theme || 'dark'; }
export function setTheme(theme) { state = { ...state, theme }; persist(); }
export function getLastTool() { return state.lastTool || ''; }
export function setLastTool(toolId) { state = { ...state, lastTool: toolId }; addRecentTool(toolId, false); persist(); }
export function getFavorites() { return [...(state.favorites || [])]; }
export function isFavorite(toolId) { return getFavorites().includes(toolId); }
export function toggleFavorite(toolId) {
  const favorites = isFavorite(toolId) ? getFavorites().filter((id) => id !== toolId) : [...getFavorites(), toolId];
  state = { ...state, favorites };
  persist();
  return favorites.includes(toolId);
}
export function getRecentTools() { return [...(state.recentTools || [])]; }
export function addRecentTool(toolId, shouldPersist = true) {
  const recentTools = [toolId, ...getRecentTools().filter((id) => id !== toolId)].slice(0, 6);
  state = { ...state, recentTools };
  if (shouldPersist) persist();
}
export function getSetting(key, fallback) { return state.settings?.[key] ?? fallback; }
export function setSetting(key, value) { state = { ...state, settings: { ...state.settings, [key]: value } }; persist(); }
export function getPromptDraft() { return { ...state.promptBuilderDraft }; }
export function setPromptDraft(draft) { state = { ...state, promptBuilderDraft: { ...state.promptBuilderDraft, ...draft } }; persist(); }
