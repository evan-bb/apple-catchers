import { state } from './state.js';

export const SAVE_KEY = 'applecatch_v6';

export function loadSave() {
  try {
    const d = localStorage.getItem(SAVE_KEY);
    if (d) state.save = Object.assign({}, state.save, JSON.parse(d));
  } catch(e) {}
}

export function writeSave() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state.save)); } catch(e) {}
}
