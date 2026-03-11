import { state } from './state.js';
import { POWERUPS, MAPS } from './data.js';
import { writeSave } from './save.js';
import { showToast, updateHUD, showVictory } from './screens.js';
import { sfxLevelUp } from './audio.js';

export function getPowerCount(id) { return state.save.powers && state.save.powers[id] || 0; }

export function addPower(id) {
  if (!state.save.powers) state.save.powers = {};
  state.save.powers[id] = (state.save.powers[id] || 0) + 1;
  writeSave();
}

export function usePower(slot) {
  if (!state.gameRunning) return;
  var equipped = getEquippedPowers();
  var pw = equipped[slot];
  if (!pw || getPowerCount(pw.id) <= 0) return;

  state.save.powers[pw.id]--;
  writeSave();

  var now = Date.now();
  if (pw.id === 'slow') {
    state.activeEffects.slow = now + pw.duration;
    state.activeEffects.slow_start = now;
    state.activeEffects.slow_dur = pw.duration;
    showToast('🐢 Slow activated!');
    setTimeout(function() { delete state.activeEffects.slow; delete state.activeEffects.slow_start; delete state.activeEffects.slow_dur; }, pw.duration);
  } else if (pw.id === 'double') {
    state.activeEffects.double = now + pw.duration;
    state.activeEffects.double_start = now;
    state.activeEffects.double_dur = pw.duration;
    showToast('💰 Double Coins!');
    setTimeout(function() { delete state.activeEffects.double; delete state.activeEffects.double_start; delete state.activeEffects.double_dur; }, pw.duration);
  } else if (pw.id === 'destroy') {
    var bonus = 0;
    state.apples.forEach(function(a) {
      var baseCoins = state.level >= 4 ? 4 : state.level >= 3 ? 3 : state.level >= 2 ? 2 : 1;
      var coins = state.activeEffects.double ? baseCoins * 2 : baseCoins;
      bonus += coins;
      state.save.coins += coins;
    });
    state.apples = [];
    writeSave();
    showToast('💥 Destroyed! +' + bonus + '🪙');
    updateHUD();
    sfxLevelUp();
  } else if (pw.id === 'teleport') {
    state.activeEffects.teleport = now + pw.duration;
    state.activeEffects.teleport_start = now;
    state.activeEffects.teleport_dur = pw.duration;
    showToast('🧲 Teleport active!');
    setTimeout(function() { delete state.activeEffects.teleport; delete state.activeEffects.teleport_start; delete state.activeEffects.teleport_dur; }, pw.duration);
  } else if (pw.id === 'mapskip') {
    // Only win if on Dimension (the final map)
    if (state.save.equippedMap === 'dimension') {
      showToast('🗺️ Map Skip — You Win!');
      setTimeout(function() {
        state.save.victoryShown = true;
        writeSave();
        showVictory();
      }, 600);
    } else {
      var mapIds = MAPS.map(function(m) { return m.id; });
      var cur = mapIds.indexOf(state.save.equippedMap || 'meadow');
      var next = cur + 1;
      if (next < mapIds.length) {
        var nextMap = MAPS[next];
        if (!state.save.unlockedMaps) state.save.unlockedMaps = ['meadow'];
        if (state.save.unlockedMaps.indexOf(nextMap.id) === -1) state.save.unlockedMaps.push(nextMap.id);
        state.save.equippedMap = nextMap.id;
        writeSave();
        showToast('🗺️ Skipped to ' + nextMap.emoji + ' ' + nextMap.name + '!');
        sfxLevelUp();
      }
    }
  }
  updatePowerBar();
}

export function getEquippedPowers() {
  var result = [null, null, null];
  var owned = POWERUPS.filter(function(p) { return getPowerCount(p.id) > 0; });
  for (var i = 0; i < Math.min(3, owned.length); i++) result[i] = owned[i];
  return result;
}

export function updatePowerBar() {
  var equipped = getEquippedPowers();
  var now = Date.now();
  for (var i = 0; i < 3; i++) {
    var slot = document.getElementById('pwSlot' + i);
    var iconEl = document.getElementById('pwIcon' + i);
    var countEl = document.getElementById('pwCount' + i);
    var timerEl = document.getElementById('pwTimer' + i);
    var pw = equipped[i];

    if (!pw) {
      slot.className = 'pw-slot empty';
      iconEl.textContent = '';
      countEl.textContent = '';
      if (timerEl) timerEl.style.width = '0';
      continue;
    }

    var qty = getPowerCount(pw.id);
    var isActive = !!state.activeEffects[pw.id];
    slot.className = 'pw-slot' + (isActive ? ' active-glow' : '');
    iconEl.textContent = pw.emoji;
    countEl.textContent = qty > 1 ? 'x' + qty : '';

    // Timer bar — shows how much time is left
    if (timerEl) {
      if (isActive && state.activeEffects[pw.id + '_dur']) {
        var elapsed = now - state.activeEffects[pw.id + '_start'];
        var total = state.activeEffects[pw.id + '_dur'];
        var pct = Math.max(0, 1 - elapsed / total) * 100;
        timerEl.style.width = pct + '%';
      } else {
        timerEl.style.width = '0';
      }
    }
  }
}

export function applyTeleport() {
  if (!state.activeEffects.teleport) return;
  state.apples.forEach(function(a) {
    var dx = state.bowlX - a.x;
    a.x += dx * 0.08;
  });
}
