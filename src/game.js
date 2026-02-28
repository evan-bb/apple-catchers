import { state } from './state.js';
import { MAPS } from './data.js';
import { writeSave } from './save.js';
import { drawApple, drawBowl } from './render.js';
import { drawMap } from './maps.js';
import { applyTeleport, updatePowerBar } from './powerups.js';
import { updateHUD, showToast, showScreen, checkMapUnlocks, checkVictory, endGame, endTimerGame, spawnFloaty } from './screens.js';
import { sfxCatch, sfxMiss, sfxLevelUp, playTrack } from './audio.js';

export function resize() {
  state.W = state.cvs.offsetWidth;  state.H = state.cvs.offsetHeight;
  state.cvs.width = state.W; state.cvs.height = state.H;
  state.BOWL_W = Math.min(140, state.W * 0.34);
  state.BOWL_H = Math.max(26, state.BOWL_W * 0.36);
  if (state.bowlX === undefined) state.bowlX = state.W / 2;
  state.bowlX = Math.max(state.BOWL_W / 2 + 12, Math.min(state.W - state.BOWL_W / 2 - 12, state.bowlX));
}

function makeApple() {
  const margin = state.W * 0.1;
  const r = Math.max(22, Math.min(34, state.W * 0.07));
  return {
    x: margin + Math.random() * (state.W - margin * 2),
    y: -r * 2.5,
    r, vy: state.speed + Math.random() * 0.8,
    skin: state.save.equippedApple,
    angle: 0,
    rotSpeed: (Math.random() - 0.5) * 0.035,
    t: Math.random() * 200,
  };
}

export function startGame() {
  resize();
  state.apples = []; state.score = 0; state.coinsEarned = 0; state.dropped = 0; state.grossCaught = 0;
  state.speed = 2.4; state.level = 1;
  state.nextDrop = 100;
  state.timerMs = 120000; // 2 minutes in ms
  state.frame = 0; state.gameRunning = true;
  state.activeEffects = {};
  updatePowerBar(); state.lastTime = 0;
  state.bowlX = state.W / 2;

  // Show/hide timer elements
  const timerEl = document.getElementById('hudTimer');
  const timerBar = document.getElementById('timerBar');
  if (state.gameMode === 'timer') {
    timerEl.style.display = 'inline';
    timerBar.style.transition = 'none';
    timerBar.style.width = '100%';
    // Force reflow so transition resets
    timerBar.offsetWidth;
    timerBar.style.transition = 'width 1s linear';
  } else {
    timerEl.style.display = 'none';
    timerBar.style.width = '0';
  }

  updateHUD();
  showScreen('sGame');
  if (!state.musicMuted && state.AC) playTrack('game');
  cancelAnimationFrame(state.animId);
  state.animId = requestAnimationFrame(loop);
}

function loop(ts) {
  if (!state.gameRunning) return;
  const dt = state.lastTime ? Math.min((ts - state.lastTime) / 16.67, 3) : 1;
  state.lastTime = ts; state.frame++;
  update(dt);
  draw();
  state.animId = requestAnimationFrame(loop);
}

function update(dt) {
  // Timer mode countdown
  if (state.gameMode === 'timer') {
    state.timerMs -= dt * 16.67; // dt is in frame units (~16.67ms each)
    if (state.timerMs <= 0) { state.timerMs = 0; endTimerGame(); return; }
    const secs = Math.ceil(state.timerMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const timerEl = document.getElementById('hudTimer');
    timerEl.textContent = m + ':' + String(s).padStart(2, '0');
    timerEl.classList.toggle('urgent', secs <= 15);
    // Update progress bar
    document.getElementById('timerBar').style.width = (state.timerMs / 120000 * 100) + '%';
  }

  state.nextDrop -= dt;
  if (state.nextDrop <= 0) {
    state.apples.push(makeApple());
    state.nextDrop = Math.max(52, 105 - (state.level - 1) * 4.5);
  }

  // Level only applies in classic mode
  if (state.gameMode === 'classic') {
    const newLvl = Math.floor(state.score / 6) + 1;
    if (newLvl !== state.level) {
      state.level = newLvl;
      state.speed = Math.min(7.5, 2.4 + (state.level - 1) * 0.27);
      sfxLevelUp();
      showToast('Level ' + state.level + '! 🔥');
    }
  }

  // Apply teleport effect (pulls apples to bowl)
  applyTeleport();
  updatePowerBar();

  const bowlTop   = state.H - state.BOWL_H - 70;
  const bowlLeft  = state.bowlX - state.BOWL_W / 2;
  const bowlRight = state.bowlX + state.BOWL_W / 2;
  let missed = false;

  for (let i = state.apples.length - 1; i >= 0; i--) {
    const a = state.apples[i];
    var slowMult = state.activeEffects.slow ? 0.38 : 1;
    a.y += a.vy * dt * slowMult;
    a.angle += a.rotSpeed * dt;
    a.t += dt;

    // Catch: apple enters bowl rim zone
    if (a.y + a.r >= bowlTop &&
        a.y - a.r <= bowlTop + state.BOWL_H * 0.55 &&
        a.x > bowlLeft + a.r * 0.4 &&
        a.x < bowlRight - a.r * 0.4) {
      state.apples.splice(i, 1);
      state.score++;
      if (state.gameMode === 'timer') state.grossCaught++;
      state.save.totalCaught = (state.save.totalCaught || 0) + 1;
      checkMapUnlocks(state.save.totalCaught);
      const baseCoins = state.gameMode === 'timer' ? 1 : (state.level >= 4 ? 4 : state.level >= 3 ? 3 : state.level >= 2 ? 2 : 1);
      const coins = state.activeEffects.double ? baseCoins * 2 : baseCoins;
      state.coinsEarned += coins;
      state.save.coins  += coins;
      writeSave();
      const floatyText = state.activeEffects.double ? '💰x2 +' + coins + '🪙' : '+' + coins + '🪙';
      spawnFloaty(floatyText, a.x, a.y - 30);
      sfxCatch();
      updateHUD();
      checkVictory();
      continue;
    }

    if (a.y - a.r > state.H) {
      state.apples.splice(i, 1);
      if (state.gameMode === 'timer') {
        // Lose a point, but score can't go below 0
        state.dropped++;
        if (state.score > 0) state.score--;
        spawnFloaty('-1', a.x, state.H * 0.65);
        sfxMiss();
        updateHUD();
      } else {
        missed = true;
      }
    }
  }

  if (missed) endGame();
  state.dangerEl.style.opacity = state.apples.some(a => a.y + a.r > state.H * 0.7) ? '1' : '0';
}

export function draw() {
  drawMap(state.save.equippedMap || 'meadow');

  // Apples
  for (const a of state.apples) {
    drawApple(state.ctx, a.x, a.y, a.r, a.skin, a.angle, a.t);
  }

  // Bowl shadow
  state.ctx.save();
  state.ctx.globalAlpha = 0.2; state.ctx.fillStyle = '#000';
  state.ctx.beginPath(); state.ctx.ellipse(state.bowlX, state.H - 54, state.BOWL_W * 0.46, 7, 0, 0, Math.PI * 2); state.ctx.fill();
  state.ctx.restore();

  // Bowl
  const bowlCY = state.H - state.BOWL_H - 66 + state.BOWL_H / 2;
  drawBowl(state.ctx, state.bowlX, bowlCY, state.BOWL_W, state.BOWL_H, state.save.equippedBowl, state.frame);
}

export function moveBowl(cx) {
  const rect = state.cvs.getBoundingClientRect();
  const x = (cx - rect.left) * (state.W / rect.width);
  state.bowlX = Math.max(state.BOWL_W / 2 + 12, Math.min(state.W - state.BOWL_W / 2 - 12, x));
}

export function initGameListeners() {
  state.cvs.addEventListener('mousemove',  e => { if (state.gameRunning) moveBowl(e.clientX); });
  state.cvs.addEventListener('touchstart', e => { if (state.gameRunning && e.touches[0]) moveBowl(e.touches[0].clientX); }, { passive: true });
  state.cvs.addEventListener('touchmove',  e => { e.preventDefault(); if (state.gameRunning && e.touches[0]) moveBowl(e.touches[0].clientX); }, { passive: false });
  window.addEventListener('resize',  () => { resize(); if (!state.gameRunning) draw(); });
}
