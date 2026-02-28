import './style.css';
import { state } from './state.js';
import { loadSave } from './save.js';
import { updateAllCoins, showScreen, showCredits, openShop, updateHUD } from './screens.js';
import { resize, startGame, draw, initGameListeners } from './game.js';
import { usePower } from './powerups.js';
import { initAudio, playTrack, toggleMute } from './audio.js';

// ── Set up canvas refs ──────────────────────────
state.cvs = document.getElementById('cvs');
state.ctx = state.cvs.getContext('2d');
state.dangerEl = document.getElementById('danger');

// ── Boot sequence ───────────────────────────────
loadSave();
updateAllCoins();
resize();
showScreen('sMenu');

// ── Game input listeners ────────────────────────
initGameListeners();

// ── Tap overlay (audio init) ────────────────────
document.getElementById('tapOverlay').addEventListener('click', function startEverything() {
  initAudio();
  playTrack('menu');
  // Hide the overlay with a fade
  const ov = document.getElementById('tapOverlay');
  ov.style.transition = 'opacity 0.4s';
  ov.style.opacity = '0';
  setTimeout(() => ov.remove(), 420);
  // Also hook all future buttons so audio keeps working
  document.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    if (state.AC && state.AC.state === 'suspended') state.AC.resume();
  }));
});

// ── Power-up slots ──────────────────────────────
document.getElementById('pwSlot0').addEventListener('click', () => usePower(0));
document.getElementById('pwSlot1').addEventListener('click', () => usePower(1));
document.getElementById('pwSlot2').addEventListener('click', () => usePower(2));

// ── What's New overlay ──────────────────────────
document.querySelector('.up-close').addEventListener('click', () => {
  document.getElementById('updateOverlay').classList.remove('show');
});
document.getElementById('btnUpdate').addEventListener('click', () => {
  document.getElementById('updateOverlay').classList.add('show');
});

// ── Chest close button ──────────────────────────
document.getElementById('chestCloseBtn').addEventListener('click', () => {
  document.getElementById('chestOpen').classList.remove('show');
});

// ── Mode select buttons ─────────────────────────
document.getElementById('btnModeClassic').addEventListener('click', () => {
  state.gameMode = 'classic';
  document.getElementById('btnModeClassic').classList.add('active');
  document.getElementById('btnModeTimer').classList.remove('active');
});
document.getElementById('btnModeTimer').addEventListener('click', () => {
  state.gameMode = 'timer';
  document.getElementById('btnModeTimer').classList.add('active');
  document.getElementById('btnModeClassic').classList.remove('active');
});

// ── Navigation buttons ──────────────────────────
document.getElementById('btnPlay').addEventListener('click', startGame);
document.getElementById('btnMenuShop').addEventListener('click', () => openShop('menu'));
document.getElementById('btnRetry').addEventListener('click', startGame);
document.getElementById('btnGoMenu').addEventListener('click', () => {
  updateAllCoins(); showScreen('sMenu'); if (!state.musicMuted && state.AC) playTrack('menu');
});
document.getElementById('btnShop').addEventListener('click', () => {
  state.gameRunning = false; cancelAnimationFrame(state.animId); openShop('game');
});
document.getElementById('btnBack').addEventListener('click', () => {
  if (state.shopFrom === 'game') startGame();
  else { updateAllCoins(); showScreen('sMenu'); if (!state.musicMuted && state.AC) playTrack('menu'); }
});

// ── Timer end screen ────────────────────────────
document.getElementById('btnTimerRetry').addEventListener('click', startGame);
document.getElementById('btnTimerMenu').addEventListener('click', () => {
  updateAllCoins(); showScreen('sMenu'); if (!state.musicMuted && state.AC) playTrack('menu');
});

// ── Victory + Credits ───────────────────────────
document.getElementById('btnVictoryCredits').addEventListener('click', showCredits);
document.getElementById('btnVictoryMenu').addEventListener('click', () => {
  updateAllCoins(); showScreen('sMenu'); if (!state.musicMuted && state.AC) playTrack('menu');
});
document.getElementById('btnSkipCredits').addEventListener('click', () => {
  showScreen('sMenu'); updateAllCoins(); if (!state.musicMuted && state.AC) playTrack('menu');
});

// ── Music toggle ────────────────────────────────
document.getElementById('btnMusic').addEventListener('click', toggleMute);
