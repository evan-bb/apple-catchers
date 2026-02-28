import { state } from './state.js';
import { APPLE_SKINS, BOWL_SKINS, CHESTS, POWERUPS, POWER_CHEST, MAPS, MAP_REWARDS } from './data.js';
import { writeSave } from './save.js';
import { getPowerCount, addPower } from './powerups.js';
import { drawApple, drawBowl, drawChest } from './render.js';
import { el } from './helpers.js';
import { updateAllCoins, showToast } from './screens.js';
import { sfxLevelUp } from './audio.js';

export function renderPowerGrid() {
  var grid = document.getElementById('puGrid');
  if (!grid) return;
  grid.innerHTML = '';
  POWERUPS.forEach(function(pw) {
    var qty = getPowerCount(pw.id);
    var card = document.createElement('div');
    card.className = 'pu-card';
    var icon = document.createElement('div'); icon.className='pu-icon'; icon.textContent=pw.emoji; card.appendChild(icon);
    var nm = document.createElement('div'); nm.className='pu-name'; nm.textContent=pw.name; card.appendChild(nm);
    var qt = document.createElement('div'); qt.className='pu-qty'; qt.textContent='x'+qty+' owned'; card.appendChild(qt);
    var rar = document.createElement('div'); rar.className='pu-rare'; rar.textContent=pw.rarity; card.appendChild(rar);
    var dsc = document.createElement('div'); dsc.className='pu-rare'; dsc.style.color='rgba(255,255,255,.3)'; dsc.textContent=pw.desc; card.appendChild(dsc);
    grid.appendChild(card);
  });
}

export function renderMapRewards() {
  var list = document.getElementById('rewardsList');
  if (!list) return;
  list.innerHTML = '';

  var rewardMaps = [
    {id:'space',  emoji:'🚀', name:'Space'},
    {id:'volcano',emoji:'🌋', name:'Volcano'},
    {id:'desert', emoji:'🏜️', name:'Desert'},
    {id:'aurora', emoji:'🌌', name:'Aurora'},
    {id:'candy',  emoji:'🍬', name:'Candy Land'},
    {id:'golden', emoji:'🌅', name:'Golden Hour'},
  ];

  rewardMaps.forEach(function(m) {
    var unlocked = state.save.unlockedMaps && state.save.unlockedMaps.indexOf(m.id) !== -1;
    var claimed = state.save.claimedRewards && state.save.claimedRewards[m.id];
    var rew = MAP_REWARDS[m.id];

    var item = document.createElement('div');
    item.className = 'reward-item';

    var emoji = document.createElement('div');
    emoji.className = 'reward-map';
    emoji.textContent = m.emoji;
    item.appendChild(emoji);

    var info = document.createElement('div');
    info.className = 'reward-info';
    var nm = document.createElement('div');
    nm.className = 'reward-name';
    nm.textContent = m.name;
    info.appendChild(nm);

    var desc = document.createElement('div');
    desc.className = 'reward-desc';
    var rewards = [];
    if (rew.skin) {
      var sk = APPLE_SKINS.filter(function(s){return s.id===rew.skin;})[0];
      rewards.push('🍎 ' + (sk ? sk.name : rew.skin));
    }
    if (rew.power) {
      var pw = POWERUPS.filter(function(p){return p.id===rew.power;})[0];
      rewards.push((pw ? pw.emoji : '⚡') + ' ' + (pw ? pw.name : rew.power));
    }
    if (rew.power2) {
      var pw2 = POWERUPS.filter(function(p){return p.id===rew.power2;})[0];
      rewards.push((pw2 ? pw2.emoji : '⚡') + ' ' + (pw2 ? pw2.name : rew.power2));
    }
    desc.textContent = rewards.join(' + ');
    info.appendChild(desc);
    item.appendChild(info);

    var status = document.createElement('div');
    status.className = 'reward-status ' + (claimed ? 'claimed' : 'locked');
    status.textContent = claimed ? '✓ Claimed' : unlocked ? '🎁 Claim!' : '🔒 Locked';
    item.appendChild(status);

    list.appendChild(item);
  });
}

export function renderShop() {
  updateAllCoins();
  renderChestGrid();
  renderSkinGrid('apple');
  renderSkinGrid('bowl');
  renderPowerGrid();
  renderMapRewards();
  renderMapGrid();
}

export function renderChestGrid() {
  const grid = document.getElementById('chestGrid');
  grid.innerHTML = '';

  // Regular chests
  CHESTS.forEach(ch => {
    const card = el('div', 'chest-card');

    // Canvas — created first, never overwritten
    const cc = el('canvas');
    cc.width = 72; cc.height = 72;
    cc.style.display = 'block';
    const cctx = cc.getContext('2d');
    drawChest(cctx, 36, 42, 58, 52, ch);
    card.appendChild(cc);

    // Name
    const nm = el('div', 'chest-name');
    nm.textContent = ch.name;
    card.appendChild(nm);

    // Cost
    const cost = el('div', 'chest-cost');
    const coin = el('div', 'cc-coin');
    const costTxt = document.createTextNode(' ' + ch.cost);
    cost.appendChild(coin);
    cost.appendChild(costTxt);
    card.appendChild(cost);

    // Button
    const btn = el('button', 'chest-buy-btn');
    btn.textContent = 'Open';
    btn.disabled = state.save.coins < ch.cost;
    btn.addEventListener('click', () => buyChest(ch.id));
    card.appendChild(btn);

    grid.appendChild(card);
  });

}

export function renderSkinGrid(type) {
  const list   = type === 'apple' ? APPLE_SKINS : BOWL_SKINS;
  const gridId = type === 'apple' ? 'appleSkinGrid' : 'bowlSkinGrid';
  const owned  = type === 'apple' ? state.save.unlockedApples : state.save.unlockedBowls;
  const eqKey  = type === 'apple' ? 'equippedApple' : 'equippedBowl';
  const grid   = document.getElementById(gridId);
  grid.innerHTML = '';

  list.forEach(sk => {
    const isOwned    = sk.id === 'classic' || owned.includes(sk.id);
    const isEquipped = state.save[eqKey] === sk.id;

    const card = el('div', 'skin-card' + (isEquipped ? ' selected' : '') + (!isOwned ? ' locked' : ''));

    // Preview canvas — never overwritten
    const pc = el('canvas');
    pc.width = 60; pc.height = 60;
    pc.style.display = 'block';
    const pctx = pc.getContext('2d');
    if (type === 'apple') {
      drawApple(pctx, 30, 34, 22, sk.id, 0, 0);
    } else {
      drawBowl(pctx, 30, 34, 56, 22, sk.id, 0);
    }
    card.appendChild(pc);

    // Name
    const nm = el('div', 'skin-name');
    nm.textContent = sk.name;
    card.appendChild(nm);

    // Badge
    if (isEquipped) {
      const b = el('div', 'skin-badge equip-badge');
      b.textContent = 'ON';
      card.appendChild(b);
    } else if (!isOwned) {
      const b = el('div', 'skin-badge lock-badge');
      b.textContent = '🔒';
      card.appendChild(b);
    }

    if (isOwned && !isEquipped) {
      card.addEventListener('click', () => {
        state.save[eqKey] = sk.id;
        writeSave();
        renderShop();
      });
    }

    grid.appendChild(card);
  });
}

export function renderMapGrid() {
  if (!state.save.unlockedMaps) state.save.unlockedMaps = ['meadow'];
  const grid = document.getElementById('mapGrid');
  const prog = document.getElementById('mapProgress');
  const total = state.save.totalCaught || 0;
  grid.innerHTML = '';

  // Progress hint
  const nextLocked = MAPS.filter(m => !state.save.unlockedMaps.includes(m.id) && m.req > 0)[0];
  if (nextLocked) {
    prog.textContent = '🍎 ' + total + ' / ' + nextLocked.req + ' caught to unlock ' + nextLocked.name;
  } else {
    prog.textContent = '🎉 All maps unlocked!';
  }

  MAPS.forEach(m => {
    const isOwned    = m.id === 'meadow' || state.save.unlockedMaps.includes(m.id);
    const isEquipped = (state.save.equippedMap || 'meadow') === m.id;

    const card = document.createElement('div');
    card.className = 'map-card' + (isEquipped ? ' selected' : '') + (!isOwned ? ' locked' : '');

    const emoji = document.createElement('div');
    emoji.className = 'map-emoji';
    emoji.textContent = m.emoji;
    card.appendChild(emoji);

    const name = document.createElement('div');
    name.className = 'map-name';
    name.textContent = m.name;
    card.appendChild(name);

    if (!isOwned) {
      const req = document.createElement('div');
      req.className = 'map-req';
      req.textContent = m.req + ' 🍎';
      card.appendChild(req);
      const badge = document.createElement('div');
      badge.className = 'skin-badge lock-badge';
      badge.textContent = '🔒';
      card.appendChild(badge);
    } else if (isEquipped) {
      const badge = document.createElement('div');
      badge.className = 'skin-badge equip-badge';
      badge.textContent = 'ON';
      card.appendChild(badge);
    }

    if (isOwned && !isEquipped) {
      card.addEventListener('click', () => {
        state.save.equippedMap = m.id;
        writeSave();
        renderShop();
      });
    }
    grid.appendChild(card);
  });
}

export function buyPowerChest() {
  var pc = POWER_CHEST;
  if (state.save.coins < pc.cost) { showToast('Not enough coins!'); return; }
  state.save.coins -= pc.cost;
  var pool = pc.powerRewards;
  var rewId = pool[Math.floor(Math.random() * pool.length)];
  var rew = POWERUPS.filter(function(p) { return p.id === rewId; })[0];
  addPower(rewId);
  writeSave();
  updateAllCoins();
  renderShop();
  showToast(rew.emoji + ' Got ' + rew.name + '!');
  sfxLevelUp();
}

export function buyChest(id) {
  const ch = CHESTS.find(c => c.id === id);
  if (!ch || state.save.coins < ch.cost) return;
  state.save.coins -= ch.cost;
  writeSave();

  // 15% chance to get a power-up instead of a skin (rare!)
  if (Math.random() < 0.15) {
    const powerPool = ['slow','slow','double','double','destroy','teleport','mapskip','mapskip'];
    const rewId = powerPool[Math.floor(Math.random() * powerPool.length)];
    const rew = POWERUPS.find(p => p.id === rewId);
    addPower(rewId);
    writeSave();
    updateAllCoins();
    renderShop();
    showToast('✨ RARE! ' + (rew ? rew.emoji : '⚡') + ' Got ' + (rew ? rew.name : rewId) + '!');
    sfxLevelUp();
    return;
  }

  // Regular chest - give apple or bowl skin
  const giveApple  = Math.random() < 0.5;
  const pool       = giveApple ? ch.appleRewards : ch.bowlRewards;
  const rewardId   = pool[Math.floor(Math.random() * pool.length)];
  const skinList   = giveApple ? APPLE_SKINS : BOWL_SKINS;
  const skin       = skinList.find(s => s.id === rewardId) || skinList[1];

  const ownedArr    = giveApple ? state.save.unlockedApples : state.save.unlockedBowls;
  const alreadyHave = skin.id === 'classic' || ownedArr.includes(skin.id);
  if (!alreadyHave) { ownedArr.push(skin.id); writeSave(); }

  openChestAnim(ch, skin, giveApple, alreadyHave);
}

export function openChestAnim(ch, skin, isApple, duplicate) {
  const overlay  = document.getElementById('chestOpen');
  const chestC   = document.getElementById('chestOpenCanvas');
  const revealC  = document.getElementById('chestRevealCanvas');
  const msgEl    = document.getElementById('chestMsg');
  const subEl    = document.getElementById('chestSub');
  const closeBtn = document.getElementById('chestCloseBtn');

  // Reset
  chestC.style.display  = 'block';
  revealC.style.display = 'none';
  closeBtn.style.display = 'none';
  msgEl.textContent = 'Opening...';
  subEl.textContent = '';
  overlay.classList.add('show');

  // Draw chest bouncing
  clearInterval(state.chestInterval);
  let t = 0;
  state.chestInterval = setInterval(() => {
    const c = chestC.getContext('2d');
    c.clearRect(0, 0, 140, 140);
    // slight shake offset
    const shake = Math.sin(t * 0.5) * 3;
    drawChest(c, 70 + shake, 78, 100, 88, ch);
    t++;
  }, 30);

  setTimeout(() => {
    clearInterval(state.chestInterval);
    chestC.style.display  = 'none';
    revealC.style.display = 'block';
    revealC.width = 140; revealC.height = 140;
    const rc = revealC.getContext('2d');
    rc.clearRect(0, 0, 140, 140);
    if (isApple) drawApple(rc, 70, 80, 50, skin.id, 0, 0);
    else         drawBowl(rc,  70, 84, 126, 46, skin.id, 0);

    msgEl.textContent  = duplicate ? 'Already have ' + skin.name + '!' : '🎉 New! ' + skin.name;
    subEl.textContent  = duplicate ? 'Duplicate — keep opening!' : (isApple ? 'Apple' : 'Bowl') + ' skin unlocked!';
    closeBtn.style.display = 'block';
    updateAllCoins();
    renderShop();
  }, 1100);
}
