import { state } from './state.js';
import { MAPS, MAP_REWARDS, APPLE_SKINS, POWERUPS } from './data.js';
import { writeSave } from './save.js';
import { addPower } from './powerups.js';
import { drawApple } from './render.js';
import { haltMusic, playTrack, sfxMiss } from './audio.js';
import { renderShop } from './shop.js';
import { saveScore } from './firebase.js';

// ── Map unlock checker ───────────────────────
export function checkMapUnlocks(total) {
  MAPS.forEach(m => {
    if (total >= m.req && m.req > 0) {
      if (!state.save.unlockedMaps) state.save.unlockedMaps = ['meadow'];
      if (!state.save.unlockedMaps.includes(m.id)) {
        state.save.unlockedMaps.push(m.id);

        // Auto-claim map reward
        if (MAP_REWARDS[m.id] && !state.save.claimedRewards[m.id]) {
          state.save.claimedRewards[m.id] = true;
          if (MAP_REWARDS[m.id].skin) {
            if (state.save.unlockedApples.indexOf(MAP_REWARDS[m.id].skin) === -1) {
              state.save.unlockedApples.push(MAP_REWARDS[m.id].skin);
            }
          }
          if (MAP_REWARDS[m.id].power) addPower(MAP_REWARDS[m.id].power);
          if (MAP_REWARDS[m.id].power2) addPower(MAP_REWARDS[m.id].power2);
        }

        writeSave();
        setTimeout(() => showToast('🗺️ New map: ' + m.name + '!'), 300);
      }
    }
  });
}

// ── Victory checker ──────────────────────────
export function checkVictory() {
  if (state.save.victoryShown) return;
  if (!state.save.unlockedMaps) state.save.unlockedMaps = ['meadow'];
  const allMaps   = MAPS.every(m => m.req === 0 || state.save.unlockedMaps.includes(m.id));
  const total     = state.save.totalCaught || 0;
  if (allMaps && total >= 500) {
    state.save.victoryShown = true;
    writeSave();
    // Short delay so last catch floaty shows first
    setTimeout(showVictory, 1200);
  }
}

export function showVictory() {
  state.gameRunning = false;
  cancelAnimationFrame(state.animId);
  haltMusic();

  // Firework confetti
  const ov = document.getElementById('sVictory');
  // Clear old fireworks
  ov.querySelectorAll('.vc-firework').forEach(e => e.remove());
  const emojis = ['🎉','⭐','🌟','✨','🎊','🍎','🏆','💛'];
  for (let i = 0; i < 18; i++) {
    const fw = document.createElement('div');
    fw.className = 'vc-firework';
    fw.textContent = emojis[i % emojis.length];
    fw.style.left  = (Math.random() * 90 + 5) + '%';
    fw.style.top   = (Math.random() * 60 + 20) + '%';
    fw.style.animationDelay = (Math.random() * 2.5) + 's';
    fw.style.animationDuration = (2 + Math.random() * 2) + 's';
    ov.appendChild(fw);
  }

  // Stats
  const total = state.save.totalCaught || 0;
  const skinCount = (state.save.unlockedApples ? state.save.unlockedApples.length : 1) +
                    (state.save.unlockedBowls  ? state.save.unlockedBowls.length  : 1);
  document.getElementById('vcCaught').textContent = total;
  document.getElementById('vcSkins').textContent  = skinCount;

  // Play menu theme softly
  setTimeout(() => { if (!state.musicMuted && state.AC) playTrack('menu'); }, 400);
  showScreen('sVictory');
}

export function showCredits() {
  haltMusic();
  showScreen('sCredits');
  // Restart scroll animation by cloning
  const scroll = document.getElementById('creditsScroll');
  scroll.style.animation = 'none';
  scroll.offsetWidth; // force reflow
  scroll.style.animation = 'creditsRoll 20s linear forwards';
  // Auto-go to menu after credits finish
  setTimeout(() => {
    if (document.getElementById('sCredits').classList.contains('off')) return;
    showScreen('sMenu');
    updateAllCoins();
    if (!state.musicMuted && state.AC) playTrack('menu');
  }, 20500);
}

// ── Game over ─────────────────────────────────
export function endGame() {
  state.gameRunning = false;
  cancelAnimationFrame(state.animId);
  state.dangerEl.style.opacity = '0';
  sfxMiss();
  haltMusic();
  setTimeout(() => { if (!state.musicMuted && state.AC) playTrack('menu'); }, 600);

  let penalty = 0;
  if (state.save.coins >= 30)       { penalty = 30;  state.save.coins -= 30;  }
  else if (state.save.coins > 0) { penalty = state.save.coins; state.save.coins = 0; }
  writeSave();

  document.getElementById('goScore').textContent  = state.score;
  document.getElementById('goCoins').textContent  = '+' + state.coinsEarned;
  document.getElementById('goPenalty').textContent = penalty > 0 ? '💸 -' + penalty + ' coin penalty' : '';

  // Draw dropped apple on game-over canvas
  const goc = document.getElementById('goAppleCanvas');
  const goctx = goc.getContext('2d');
  goctx.clearRect(0, 0, goc.width, goc.height);
  drawApple(goctx, 55, 70, 42, state.save.equippedApple, 0.3, 0);

  showScreen('sGameOver');
  updateAllCoins();

  // Save score to leaderboard if logged in
  if (state.user) saveScore(state.score, 'classic');
}

export function endTimerGame() {
  state.gameRunning = false;
  cancelAnimationFrame(state.animId);
  state.dangerEl.style.opacity = '0';
  document.getElementById('timerBar').style.width = '0';
  document.getElementById('hudTimer').classList.remove('urgent');

  // Score = caught - dropped, min 0 coins
  const finalScore = Math.max(0, state.score);
  const coinsAwarded = finalScore; // 1 coin per net point
  state.save.coins += coinsAwarded;
  writeSave();

  document.getElementById('teCaught').textContent  = state.grossCaught;
  document.getElementById('teDropped').textContent = '-' + state.dropped;
  document.getElementById('teScore').textContent   = finalScore;
  document.getElementById('teCoins').textContent   = '+' + coinsAwarded + ' 🪙';

  haltMusic();
  setTimeout(() => { if (!state.musicMuted && state.AC) playTrack('menu'); }, 400);
  showScreen('sTimerEnd');
  updateAllCoins();

  // Save score to leaderboard if logged in
  if (state.user) saveScore(finalScore, 'timer');
}

// ═══════════════════════════════════════════════
//  HUD
// ═══════════════════════════════════════════════
export function updateHUD() {
  document.getElementById('hudCoins').textContent = state.save.coins;
  if (state.gameMode === 'timer') {
    document.getElementById('hudScore').textContent = '🍎 ' + state.score;
  } else {
    document.getElementById('hudScore').textContent = 'Score: ' + state.score + '  Lv' + state.level;
  }
}
export function updateAllCoins() {
  ['hudCoins','menuCoins','shopCoins'].forEach(id => {
    document.getElementById(id).textContent = state.save.coins;
  });
  // Update menu progress bar
  const total = state.save.totalCaught || 0;
  if (!state.save.unlockedMaps) state.save.unlockedMaps = ['meadow'];
  const nextMap = MAPS.filter(m => m.req > 0 && !state.save.unlockedMaps.includes(m.id))[0];
  const prog = document.getElementById('menuProgress');
  if (prog) {
    if (nextMap) {
      prog.textContent = '🍎 ' + total + ' / ' + nextMap.req + ' → ' + nextMap.emoji + ' ' + nextMap.name;
    } else {
      prog.textContent = '🎉 All maps unlocked!';
    }
  }
}
export function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
}
export function spawnFloaty(text, x, y) {
  const el = document.createElement('div');
  el.className = 'floaty';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  document.getElementById('sGame').appendChild(el);
  setTimeout(() => el.remove(), 950);
}

// ═══════════════════════════════════════════════
//  SCREEN MANAGER
// ═══════════════════════════════════════════════
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('off'));
  document.getElementById(id).classList.remove('off');
}
export function openShop(from) {
  state.shopFrom = from;
  renderShop();
  showScreen('sShop');
}
