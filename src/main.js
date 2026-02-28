import './style.css';
import { state } from './state.js';
import { loadSave } from './save.js';
import { updateAllCoins, showScreen, showCredits, openShop, updateHUD } from './screens.js';
import { resize, startGame, draw, initGameListeners } from './game.js';
import { usePower } from './powerups.js';
import { initAudio, playTrack, toggleMute } from './audio.js';
import { onAuthChange, signUp, logIn, logOut, getLeaderboard, loadProgress } from './firebase.js';
import { writeSave } from './save.js';

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

// ══════════════════════════════════════════════════
//  ACCOUNTS + LEADERBOARD
// ══════════════════════════════════════════════════

// ── Auth state listener ─────────────────────────
onAuthChange(async (user) => {
  state.user = user;
  const menuUser = document.getElementById('menuUser');
  const menuUsername = document.getElementById('menuUsername');
  if (user) {
    menuUser.style.display = '';
    menuUsername.textContent = user.displayName;
    // Load cloud save and merge with local (keep the better progress)
    const cloud = await loadProgress();
    if (cloud) {
      const local = state.save;
      // Keep whichever has more coins
      state.save.coins = Math.max(local.coins || 0, cloud.coins || 0);
      // Keep whichever caught more apples
      state.save.totalCaught = Math.max(local.totalCaught || 0, cloud.totalCaught || 0);
      // Merge unlocked items (combine both lists)
      state.save.unlockedApples = [...new Set([...(local.unlockedApples || ['classic']), ...(cloud.unlockedApples || ['classic'])])];
      state.save.unlockedBowls = [...new Set([...(local.unlockedBowls || ['classic']), ...(cloud.unlockedBowls || ['classic'])])];
      state.save.unlockedMaps = [...new Set([...(local.unlockedMaps || ['meadow']), ...(cloud.unlockedMaps || ['meadow'])])];
      // Merge powers (keep the higher count of each)
      const allPowers = { ...(cloud.powers || {}), ...(local.powers || {}) };
      for (const key in allPowers) {
        allPowers[key] = Math.max((local.powers || {})[key] || 0, (cloud.powers || {})[key] || 0);
      }
      state.save.powers = allPowers;
      // Merge claimed rewards
      state.save.claimedRewards = { ...(cloud.claimedRewards || {}), ...(local.claimedRewards || {}) };
      // Keep victory if either has it
      if (cloud.victoryShown) state.save.victoryShown = true;
      // Keep equipped items from cloud if they exist there
      if (cloud.equippedApple) state.save.equippedApple = cloud.equippedApple;
      if (cloud.equippedBowl) state.save.equippedBowl = cloud.equippedBowl;
      if (cloud.equippedMap) state.save.equippedMap = cloud.equippedMap;
      writeSave();
      updateAllCoins();
    }
  } else {
    menuUser.style.display = 'none';
  }
});

// ── Account screen ──────────────────────────────
document.getElementById('btnAccount').addEventListener('click', () => {
  const loggedIn = document.getElementById('accLoggedIn');
  const loggedOut = document.getElementById('accLoggedOut');
  if (state.user) {
    loggedIn.style.display = '';
    loggedOut.style.display = 'none';
    document.getElementById('accName').textContent = state.user.displayName;
  } else {
    loggedIn.style.display = 'none';
    loggedOut.style.display = '';
    document.getElementById('accUser').value = '';
    document.getElementById('accPass').value = '';
  }
  document.getElementById('accError').textContent = '';
  showScreen('sAccount');
});

document.getElementById('btnAccBack').addEventListener('click', () => {
  showScreen('sMenu');
});

document.getElementById('btnSignUp').addEventListener('click', async () => {
  const user = document.getElementById('accUser').value.trim();
  const pass = document.getElementById('accPass').value;
  const err = document.getElementById('accError');
  err.textContent = '';
  if (!user || !pass) { err.textContent = 'Fill in both fields!'; return; }
  if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters!'; return; }
  const result = await signUp(user, pass);
  if (result.ok) {
    showScreen('sMenu');
  } else {
    err.textContent = result.error;
  }
});

document.getElementById('btnLogIn').addEventListener('click', async () => {
  const user = document.getElementById('accUser').value.trim();
  const pass = document.getElementById('accPass').value;
  const err = document.getElementById('accError');
  err.textContent = '';
  if (!user || !pass) { err.textContent = 'Fill in both fields!'; return; }
  const result = await logIn(user, pass);
  if (result.ok) {
    showScreen('sMenu');
  } else {
    err.textContent = result.error;
  }
});

document.getElementById('btnLogOut').addEventListener('click', async () => {
  await logOut();
  showScreen('sMenu');
});

// ── Leaderboard screen ──────────────────────────
let lbMode = 'classic';

async function loadLeaderboard(mode) {
  const list = document.getElementById('lbList');
  const loading = document.getElementById('lbLoading');
  list.innerHTML = '';
  loading.style.display = '';

  try {
    const scores = await getLeaderboard(mode);
    loading.style.display = 'none';

    if (scores.length === 0) {
      list.innerHTML = '<div class="lb-empty">No scores yet! Be the first! 🍎</div>';
      return;
    }

    scores.forEach((entry, i) => {
      const row = document.createElement('div');
      row.className = 'lb-row';
      if (state.user && entry.username === state.user.displayName) {
        row.classList.add('lb-me');
      }
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1);
      row.innerHTML =
        '<span class="lb-rank">' + medal + '</span>' +
        '<span class="lb-name">' + entry.username + '</span>' +
        '<span class="lb-score">' + entry.score + '</span>';
      list.appendChild(row);
    });
  } catch (e) {
    loading.textContent = 'Could not load scores 😕';
  }
}

document.getElementById('btnLeaderboard').addEventListener('click', () => {
  lbMode = 'classic';
  document.getElementById('lbTabClassic').classList.add('active');
  document.getElementById('lbTabTimer').classList.remove('active');
  showScreen('sLeaderboard');
  loadLeaderboard('classic');
});

document.getElementById('lbTabClassic').addEventListener('click', () => {
  if (lbMode === 'classic') return;
  lbMode = 'classic';
  document.getElementById('lbTabClassic').classList.add('active');
  document.getElementById('lbTabTimer').classList.remove('active');
  loadLeaderboard('classic');
});

document.getElementById('lbTabTimer').addEventListener('click', () => {
  if (lbMode === 'timer') return;
  lbMode = 'timer';
  document.getElementById('lbTabTimer').classList.add('active');
  document.getElementById('lbTabClassic').classList.remove('active');
  loadLeaderboard('timer');
});

document.getElementById('btnLbBack').addEventListener('click', () => {
  showScreen('sMenu');
});
