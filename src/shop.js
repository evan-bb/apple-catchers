import { state } from './state.js';
import { APPLE_SKINS, BOWL_SKINS, CHESTS, POWERUPS, POWER_CHEST, MAPS, MAP_REWARDS, RARITY, RARITY_COLORS, SHARDS, MERCHANT_PRICES } from './data.js';
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
  renderShardGrid();
  renderMerchantGrid();
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

    // Rarity tag
    const rar = RARITY[sk.id] || 'common';
    const rarTag = el('div', 'rarity-tag');
    rarTag.textContent = rar.charAt(0).toUpperCase() + rar.slice(1);
    rarTag.style.background = RARITY_COLORS[rar] || '#aaa';
    card.appendChild(rarTag);

    // Event tag
    if (sk.event) {
      const evTag = el('div', 'event-tag');
      evTag.textContent = '🍀 Event';
      card.appendChild(evTag);
    }

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

  // ~8% bonus chance to also get a shard
  var shardDrop = null;
  if (Math.random() < 0.08) {
    if (!state.save.shards) state.save.shards = { bronze:0, silver:0, gold:0 };
    var r = Math.random();
    if (r < 0.02)      { state.save.shards.gold++;   shardDrop = 'gold'; }
    else if (r < 0.05) { state.save.shards.silver++; shardDrop = 'silver'; }
    else               { state.save.shards.bronze++; shardDrop = 'bronze'; }
    writeSave();
  }

  openChestAnim(ch, skin, giveApple, alreadyHave, shardDrop);
}

export function openChestAnim(ch, skin, isApple, duplicate, shardDrop) {
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
    var subText = duplicate ? 'Duplicate — keep opening!' : (isApple ? 'Apple' : 'Bowl') + ' skin unlocked!';
    if (shardDrop) {
      var shardEmoji = shardDrop === 'gold' ? '🟡' : shardDrop === 'silver' ? '⬜' : '🟫';
      subText += ' + ' + shardEmoji + ' ' + shardDrop.charAt(0).toUpperCase() + shardDrop.slice(1) + ' Shard!';
    }
    subEl.textContent = subText;
    closeBtn.style.display = 'block';
    updateAllCoins();
    renderShop();
  }, 1100);
}

// ── Shard Grid ──────────────────────────────────
export function renderShardGrid() {
  var grid = document.getElementById('shardGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!state.save.shards) state.save.shards = { bronze:0, silver:0, gold:0 };

  SHARDS.forEach(function(sh) {
    var count = state.save.shards[sh.id] || 0;
    var card = el('div', 'shard-card');
    card.style.borderColor = sh.color;

    var icon = el('div', 'shard-icon');
    icon.textContent = sh.emoji;
    card.appendChild(icon);

    var nm = el('div', 'shard-name');
    nm.textContent = sh.name;
    nm.style.color = sh.color;
    card.appendChild(nm);

    var ct = el('div', 'shard-count');
    ct.textContent = count + ' / ' + sh.cost;
    card.appendChild(ct);

    // Progress bar
    var barWrap = el('div', 'shard-bar-wrap');
    var barFill = el('div', 'shard-bar-fill');
    barFill.style.width = Math.min(100, (count / sh.cost) * 100) + '%';
    barFill.style.background = sh.color;
    barWrap.appendChild(barFill);
    card.appendChild(barWrap);

    if (count >= sh.cost) {
      var btn = el('button', 'shard-redeem-btn');
      btn.textContent = '✨ Redeem';
      btn.addEventListener('click', function() { redeemShard(sh.id); });
      card.appendChild(btn);
    }

    grid.appendChild(card);
  });
}

function redeemShard(shardId) {
  var sh = SHARDS.find(function(s) { return s.id === shardId; });
  if (!sh) return;
  if (!state.save.shards) state.save.shards = { bronze:0, silver:0, gold:0 };
  if ((state.save.shards[shardId] || 0) < sh.cost) { showToast('Not enough shards!'); return; }

  state.save.shards[shardId] -= sh.cost;

  // Pick a random reward — could be apple or bowl version
  var rewardId = sh.rewards[Math.floor(Math.random() * sh.rewards.length)];
  var giveApple = Math.random() < 0.5;
  var skinList = giveApple ? APPLE_SKINS : BOWL_SKINS;
  var skin = skinList.find(function(s) { return s.id === rewardId; });

  // If that skin doesn't exist in the chosen list, try the other list
  if (!skin) {
    giveApple = !giveApple;
    skinList = giveApple ? APPLE_SKINS : BOWL_SKINS;
    skin = skinList.find(function(s) { return s.id === rewardId; });
  }
  if (!skin) { showToast('Something went wrong!'); return; }

  var ownedArr = giveApple ? state.save.unlockedApples : state.save.unlockedBowls;
  var alreadyHave = ownedArr.includes(skin.id);
  if (!alreadyHave) { ownedArr.push(skin.id); }
  writeSave();

  if (alreadyHave) {
    state.save.shards[shardId] += sh.cost;
    writeSave();
    renderShop();
    showToast('Already have ' + skin.name + '! Shards refunded.');
  } else {
    // Show the reveal animation!
    openShardAnim(sh, skin, giveApple);
  }
}

function openShardAnim(shard, skin, isApple) {
  var overlay  = document.getElementById('chestOpen');
  var chestC   = document.getElementById('chestOpenCanvas');
  var revealC  = document.getElementById('chestRevealCanvas');
  var msgEl    = document.getElementById('chestMsg');
  var subEl    = document.getElementById('chestSub');
  var closeBtn = document.getElementById('chestCloseBtn');

  // Reset
  chestC.style.display  = 'block';
  revealC.style.display = 'none';
  closeBtn.style.display = 'none';
  msgEl.textContent = '✨ Redeeming...';
  subEl.textContent = shard.emoji + ' ' + shard.name + ' x10';
  overlay.classList.add('show');

  // Sparkle animation on the chest canvas
  clearInterval(state.chestInterval);
  var t = 0;
  state.chestInterval = setInterval(function() {
    var c = chestC.getContext('2d');
    c.clearRect(0, 0, 140, 140);

    // Glowing circle in the middle
    var glow = 0.3 + Math.sin(t * 0.15) * 0.2;
    c.save();
    c.globalAlpha = glow;
    c.fillStyle = shard.color;
    c.beginPath();
    c.arc(70, 70, 35 + Math.sin(t * 0.1) * 5, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // Big shard emoji
    c.font = '48px serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(shard.emoji, 70, 70);

    // Sparkles flying outward
    for (var i = 0; i < 8; i++) {
      var angle = (i / 8) * Math.PI * 2 + t * 0.05;
      var dist = 20 + (t % 30) * 1.2;
      var sx = 70 + Math.cos(angle) * dist;
      var sy = 70 + Math.sin(angle) * dist;
      var sparkAlpha = Math.max(0, 1 - (t % 30) / 30);
      c.save();
      c.globalAlpha = sparkAlpha * 0.7;
      c.fillStyle = shard.color;
      c.beginPath();
      c.arc(sx, sy, 3, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    t++;
  }, 30);

  // After animation, reveal the skin
  setTimeout(function() {
    clearInterval(state.chestInterval);
    chestC.style.display  = 'none';
    revealC.style.display = 'block';
    revealC.width = 140; revealC.height = 140;
    var rc = revealC.getContext('2d');
    rc.clearRect(0, 0, 140, 140);
    if (isApple) drawApple(rc, 70, 80, 50, skin.id, 0, 0);
    else         drawBowl(rc, 70, 84, 126, 46, skin.id, 0);

    msgEl.textContent = '🎉 ' + skin.name + '!';
    subEl.textContent = (isApple ? 'Apple' : 'Bowl') + ' skin unlocked!';
    closeBtn.style.display = 'block';
    sfxLevelUp();
    updateAllCoins();
    renderShop();
  }, 1500);
}

// ── Merchant Grid ───────────────────────────────
export function renderMerchantGrid() {
  var grid = document.getElementById('merchantGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Generate 3 random items each time shop opens
  var items = generateMerchantItems();

  items.forEach(function(item) {
    var card = el('div', 'merchant-card');

    if (item.type === 'skin') {
      // Skin item
      var pc = el('canvas');
      pc.width = 60; pc.height = 60;
      pc.style.display = 'block';
      var pctx = pc.getContext('2d');
      if (item.skinType === 'apple') {
        drawApple(pctx, 30, 34, 22, item.skin.id, 0, 0);
      } else {
        drawBowl(pctx, 30, 34, 56, 22, item.skin.id, 0);
      }
      card.appendChild(pc);

      var nm = el('div', 'merchant-name');
      nm.textContent = item.skin.name + ' ' + (item.skinType === 'apple' ? '🍎' : '🥣');
      card.appendChild(nm);

      var rar = RARITY[item.skin.id] || 'common';
      var rarTag = el('div', 'rarity-tag');
      rarTag.textContent = rar.charAt(0).toUpperCase() + rar.slice(1);
      rarTag.style.background = RARITY_COLORS[rar] || '#aaa';
      card.appendChild(rarTag);

      // Check if already owned
      var ownedArr = item.skinType === 'apple' ? state.save.unlockedApples : state.save.unlockedBowls;
      var owned = item.skin.id === 'classic' || ownedArr.includes(item.skin.id);

      var cost = el('div', 'merchant-cost');
      cost.textContent = owned ? '✓ Owned' : item.price + ' 🪙';
      card.appendChild(cost);

      if (!owned) {
        var btn = el('button', 'merchant-buy-btn');
        btn.textContent = 'Buy';
        btn.disabled = state.save.coins < item.price;
        btn.addEventListener('click', function() {
          if (state.save.coins < item.price) { showToast('Not enough coins!'); return; }
          state.save.coins -= item.price;
          ownedArr.push(item.skin.id);
          writeSave();
          updateAllCoins();
          renderShop();
          showToast('🍀 Bought ' + item.skin.name + '!');
          sfxLevelUp();
        });
        card.appendChild(btn);
      }
    } else if (item.type === 'power') {
      // Power-up item
      var icon = el('div', 'merchant-pw-icon');
      icon.textContent = item.power.emoji;
      card.appendChild(icon);

      var nm2 = el('div', 'merchant-name');
      nm2.textContent = item.power.name;
      card.appendChild(nm2);

      var desc = el('div', 'merchant-desc');
      desc.textContent = item.power.desc;
      card.appendChild(desc);

      var cost2 = el('div', 'merchant-cost');
      cost2.textContent = item.price + ' 🪙';
      card.appendChild(cost2);

      var btn2 = el('button', 'merchant-buy-btn');
      btn2.textContent = 'Buy';
      btn2.disabled = state.save.coins < item.price;
      btn2.addEventListener('click', function() {
        if (state.save.coins < item.price) { showToast('Not enough coins!'); return; }
        state.save.coins -= item.price;
        addPower(item.power.id);
        writeSave();
        updateAllCoins();
        renderShop();
        showToast('🍀 Bought ' + item.power.name + '!');
        sfxLevelUp();
      });
      card.appendChild(btn2);
    } else if (item.type === 'shard') {
      // Shard item
      var shIcon = el('div', 'merchant-pw-icon');
      shIcon.textContent = item.shard.emoji;
      card.appendChild(shIcon);

      var shNm = el('div', 'merchant-name');
      shNm.textContent = item.shard.name;
      shNm.style.color = item.shard.color;
      card.appendChild(shNm);

      var shDesc = el('div', 'merchant-desc');
      shDesc.textContent = 'Collect 10 to redeem!';
      card.appendChild(shDesc);

      var shCost = el('div', 'merchant-cost');
      shCost.textContent = item.price + ' 🪙';
      card.appendChild(shCost);

      var shBtn = el('button', 'merchant-buy-btn');
      shBtn.textContent = 'Buy';
      shBtn.disabled = state.save.coins < item.price;
      shBtn.addEventListener('click', function() {
        if (state.save.coins < item.price) { showToast('Not enough coins!'); return; }
        state.save.coins -= item.price;
        if (!state.save.shards) state.save.shards = { bronze:0, silver:0, gold:0 };
        state.save.shards[item.shard.id]++;
        writeSave();
        updateAllCoins();
        renderShop();
        showToast('🍀 Bought ' + item.shard.emoji + ' ' + item.shard.name + '!');
        sfxLevelUp();
      });
      card.appendChild(shBtn);
    }

    grid.appendChild(card);
  });
}

function generateMerchantItems() {
  var items = [];
  var usedIds = [];

  for (var i = 0; i < 3; i++) {
    var roll = Math.random();
    // 10% chance for a shard (rare!)
    if (roll < 0.10 && usedIds.indexOf('shard') === -1) {
      // Pick a random shard type (gold rarest, bronze most common)
      var shardRoll = Math.random();
      var shard;
      if (shardRoll < 0.15)      shard = SHARDS[2]; // gold (15% of the 10%)
      else if (shardRoll < 0.45) shard = SHARDS[1]; // silver (30% of the 10%)
      else                       shard = SHARDS[0]; // bronze (55% of the 10%)
      var shardPrice = shard.id === 'gold' ? 500 : shard.id === 'silver' ? 300 : 150;
      usedIds.push('shard');
      items.push({ type:'shard', shard:shard, price:shardPrice });
    }
    // 55% chance skin
    else if (roll < 0.65) {
      var isApple = Math.random() < 0.5;
      var skinList = isApple ? APPLE_SKINS : BOWL_SKINS;
      var pool = skinList.filter(function(s) {
        return s.id !== 'classic' && s.id !== 'dark' && usedIds.indexOf(s.id + (isApple ? 'a' : 'b')) === -1;
      });
      if (pool.length === 0) continue;
      var skin = pool[Math.floor(Math.random() * pool.length)];
      var rar = RARITY[skin.id] || 'common';
      var price = MERCHANT_PRICES[rar] || 100;
      usedIds.push(skin.id + (isApple ? 'a' : 'b'));
      items.push({ type:'skin', skin:skin, skinType: isApple ? 'apple' : 'bowl', price:price });
    } else {
      // 35% chance power-up
      var pwPool = POWERUPS.filter(function(p) { return usedIds.indexOf('pw_' + p.id) === -1; });
      if (pwPool.length === 0) continue;
      var pw = pwPool[Math.floor(Math.random() * pwPool.length)];
      var price2 = MERCHANT_PRICES[pw.id] || 100;
      usedIds.push('pw_' + pw.id);
      items.push({ type:'power', power:pw, price:price2 });
    }
  }

  return items;
}
