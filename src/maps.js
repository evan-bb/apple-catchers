import { state } from './state.js';
import { cloud } from './helpers.js';

export function drawMap(mapId) {
  switch(mapId) {
    case 'night':      drawNight();      break;
    case 'winter':     drawWinter();     break;
    case 'space':      drawSpace();      break;
    case 'underwater': drawUnderwater(); break;
    case 'volcano':    drawVolcano();    break;
    case 'desert':     drawDesert();     break;
    case 'aurora':     drawAurora();     break;
    case 'candy':      drawCandy();      break;
    case 'golden':     drawGolden();     break;
    case 'mountains':  drawMountains();  break;
    case 'castle':     drawCastle();     break;
    case 'haunted':    drawHaunted();    break;
    case 'shipwreck':  drawShipwreck();  break;
    default:           drawMeadow();     break;
  }
}

// ── Helper: draw curved rolling ground ──────────
function curvedGround(color1, color2, yBase, height) {
  const { ctx, W, H, frame } = state;
  const y = H - yBase;
  ctx.fillStyle = color1;
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 4) {
    const wave = Math.sin(x * 0.012 + 0.5) * height * 0.3
              + Math.sin(x * 0.025) * height * 0.15;
    ctx.lineTo(x, y + wave);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  // Second layer for texture
  if (color2) {
    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const wave = Math.sin(x * 0.015 + 2) * height * 0.2
                + Math.sin(x * 0.03 + 1) * height * 0.1;
      ctx.lineTo(x, y + height * 0.3 + wave);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  }
}

// ── Helper: draw small tree ─────────────────────
function smallTree(x, y, trunkH, col) {
  const { ctx } = state;
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(x - 2, y - trunkH, 4, trunkH);
  ctx.fillStyle = col || '#3a8f3a';
  ctx.beginPath();
  ctx.arc(x, y - trunkH - 6, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col ? col : '#2e7d2e';
  ctx.beginPath();
  ctx.arc(x - 5, y - trunkH - 3, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 5, y - trunkH - 3, 7, 0, Math.PI * 2);
  ctx.fill();
}

// ── Helper: draw flower ─────────────────────────
function flower(x, y, size, col) {
  const { ctx } = state;
  ctx.fillStyle = '#4a7a30';
  ctx.fillRect(x - 0.5, y - size * 3, 1.5, size * 3);
  ctx.fillStyle = col;
  for (let a = 0; a < 5; a++) {
    const angle = (a / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * size * 0.6, y - size * 3 + Math.sin(angle) * size * 0.6, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffe066';
  ctx.beginPath();
  ctx.arc(x, y - size * 3, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

// ═══════════════════════════════════════════════════
// MEADOW
// ═══════════════════════════════════════════════════
function drawMeadow() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#6bb3e0');
  sky.addColorStop(0.35, '#87ceeb');
  sky.addColorStop(0.6, '#b8e4ff');
  sky.addColorStop(0.8, '#d4f0c0');
  sky.addColorStop(1, '#7ec850');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Sun with bigger glow
  ctx.save();
  ctx.shadowColor = '#ffe082';
  ctx.shadowBlur = 45;
  ctx.fillStyle = '#fff176';
  ctx.beginPath();
  ctx.arc(W * 0.85, H * 0.09, Math.min(W, H) * 0.065, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Sun halo
  const halo = ctx.createRadialGradient(W * 0.85, H * 0.09, 0, W * 0.85, H * 0.09, Math.min(W, H) * 0.18);
  halo.addColorStop(0, 'rgba(255,244,180,0.25)');
  halo.addColorStop(1, 'rgba(255,244,180,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // Clouds
  cloud(W * 0.13 + Math.sin(frame * 0.003) * 9, H * 0.1, W * 0.12, 'rgba(255,255,255,0.82)');
  cloud(W * 0.63 + Math.cos(frame * 0.002) * 7, H * 0.07, W * 0.09, 'rgba(255,255,255,0.82)');
  cloud(W * 0.41 + Math.sin(frame * 0.0025) * 6, H * 0.16, W * 0.075, 'rgba(255,255,255,0.82)');

  // Rolling hills (background)
  ctx.fillStyle = '#6ab84e';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 50 + Math.sin(x * 0.008) * 18 + Math.sin(x * 0.02) * 8);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Foreground ground
  curvedGround('#5cb85c', '#4caf50', 22, 14);

  // Trees on hills
  smallTree(W * 0.12, H - 38, 18, '#4a9e4a');
  smallTree(W * 0.55, H - 42, 22, '#3a8f3a');
  smallTree(W * 0.88, H - 36, 16, '#4a9e4a');

  // Flowers
  flower(W * 0.25, H - 20, 3, '#ff6b8a');
  flower(W * 0.4, H - 18, 2.5, '#ffeb3b');
  flower(W * 0.7, H - 20, 3, '#ff8a65');
  flower(W * 0.82, H - 19, 2, '#ce93d8');
}

// ═══════════════════════════════════════════════════
// NIGHT SKY
// ═══════════════════════════════════════════════════
function drawNight() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#06061a');
  sky.addColorStop(0.3, '#0a0a2e');
  sky.addColorStop(0.6, '#0d1b4e');
  sky.addColorStop(0.85, '#1a2a1a');
  sky.addColorStop(1, '#2d4a2d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Stars with varied brightness
  for (let i = 0; i < 80; i++) {
    const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * W;
    const sy = (Math.sin(i * 97.3) * 0.5 + 0.5) * H * 0.65;
    const ss = 0.4 + Math.sin(i * 2.1) * 0.5;
    ctx.globalAlpha = 0.3 + Math.sin(frame * 0.03 + i * 0.7) * 0.45;
    ctx.fillStyle = i % 5 === 0 ? '#ffe4b5' : '#fff';
    ctx.beginPath();
    ctx.arc(sx, sy, ss, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Moon with glow
  ctx.save();
  ctx.shadowColor = '#fffde7';
  ctx.shadowBlur = 40;
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath();
  ctx.arc(W * 0.82, H * 0.1, Math.min(W, H) * 0.06, 0, Math.PI * 2);
  ctx.fill();
  // Crescent shadow
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0a0a2e';
  ctx.beginPath();
  ctx.arc(W * 0.82 + Math.min(W, H) * 0.025, H * 0.1, Math.min(W, H) * 0.052, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Moon halo
  const mh = ctx.createRadialGradient(W * 0.82, H * 0.1, 0, W * 0.82, H * 0.1, Math.min(W, H) * 0.2);
  mh.addColorStop(0, 'rgba(255,253,200,0.12)');
  mh.addColorStop(1, 'rgba(255,253,200,0)');
  ctx.fillStyle = mh;
  ctx.fillRect(0, 0, W, H);

  // Night clouds
  cloud(W * 0.2 + Math.sin(frame * 0.002) * 8, H * 0.12, W * 0.1, 'rgba(20,20,60,0.6)');
  cloud(W * 0.7 + Math.cos(frame * 0.0015) * 6, H * 0.08, W * 0.08, 'rgba(20,20,60,0.6)');

  // Fireflies
  for (let i = 0; i < 8; i++) {
    const fx = (Math.sin(i * 213 + frame * 0.005) * 0.3 + 0.5) * W;
    const fy = H * 0.6 + Math.sin(frame * 0.02 + i * 2) * 15 + i * 8;
    ctx.save();
    ctx.shadowColor = '#ffff66';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffff66';
    ctx.globalAlpha = 0.4 + Math.sin(frame * 0.05 + i * 3) * 0.4;
    ctx.beginPath();
    ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Ground
  curvedGround('#1b3a1b', '#2d5a2d', 22, 12);
}

// ═══════════════════════════════════════════════════
// WINTER
// ═══════════════════════════════════════════════════
function drawWinter() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#a0c4e0');
  sky.addColorStop(0.3, '#b3d9f5');
  sky.addColorStop(0.6, '#ddeeff');
  sky.addColorStop(0.85, '#eaf5ff');
  sky.addColorStop(1, '#f0f8ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Snowflakes
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 50; i++) {
    const sx = ((Math.sin(i * 173.1) * 0.5 + 0.5) * W + frame * 0.3 + Math.sin(frame * 0.01 + i) * 5) % W;
    const sy = ((Math.sin(i * 89.7) * 0.5 + 0.5) * H * 0.85 + frame * 0.4 * (0.5 + i % 3 * 0.3)) % (H * 0.85);
    const ss = 0.8 + Math.sin(i * 2.3) * 1;
    ctx.globalAlpha = 0.5 + Math.sin(i * 1.5) * 0.3;
    ctx.beginPath();
    ctx.arc(sx, sy, ss, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Pale sun with haze
  ctx.save();
  ctx.shadowColor = '#fff9c4';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#fffde7';
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.1, Math.min(W, H) * 0.055, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Snow clouds
  cloud(W * 0.15 + Math.sin(frame * 0.002) * 7, H * 0.09, W * 0.11, 'rgba(210,225,245,0.9)');
  cloud(W * 0.55 + Math.cos(frame * 0.0018) * 5, H * 0.06, W * 0.09, 'rgba(210,225,245,0.9)');
  cloud(W * 0.85 + Math.sin(frame * 0.0022) * 4, H * 0.12, W * 0.07, 'rgba(210,225,245,0.9)');

  // Snowy hills (background)
  ctx.fillStyle = '#daeaf5';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 45 + Math.sin(x * 0.009) * 15 + Math.sin(x * 0.025) * 6);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Pine trees
  for (let i = 0; i < 5; i++) {
    const tx = W * (0.1 + i * 0.2) + Math.sin(i * 71) * 15;
    const ty = H - 35 + Math.sin(tx * 0.01) * 10;
    ctx.fillStyle = '#4a6a5a';
    ctx.beginPath();
    ctx.moveTo(tx, ty - 25);
    ctx.lineTo(tx - 10, ty);
    ctx.lineTo(tx + 10, ty);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tx, ty - 35);
    ctx.lineTo(tx - 7, ty - 15);
    ctx.lineTo(tx + 7, ty - 15);
    ctx.fill();
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(tx - 2, ty, 4, 8);
    // Snow on tree
    ctx.fillStyle = '#f0f8ff';
    ctx.beginPath();
    ctx.arc(tx, ty - 26, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Snowy ground
  curvedGround('#e8f4fd', '#f0f8ff', 22, 12);
}

// ═══════════════════════════════════════════════════
// SPACE
// ═══════════════════════════════════════════════════
function drawSpace() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#000008');
  sky.addColorStop(0.4, '#000010');
  sky.addColorStop(0.7, '#050520');
  sky.addColorStop(1, '#0a0520');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Star field
  for (let i = 0; i < 100; i++) {
    const sx = (Math.sin(i * 251.3) * 0.5 + 0.5) * W;
    const sy = (Math.sin(i * 173.7) * 0.5 + 0.5) * H;
    ctx.globalAlpha = 0.2 + Math.sin(frame * 0.05 + i) * 0.45;
    const hue = (i * 37) % 360;
    ctx.fillStyle = `hsl(${hue},70%,90%)`;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.5 + Math.sin(i) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Nebula clouds (multiple)
  const neb1 = ctx.createRadialGradient(W * 0.3, H * 0.25, 0, W * 0.3, H * 0.25, W * 0.25);
  neb1.addColorStop(0, 'rgba(120,60,200,0.1)');
  neb1.addColorStop(0.5, 'rgba(80,40,160,0.04)');
  neb1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = neb1;
  ctx.fillRect(0, 0, W, H);

  const neb2 = ctx.createRadialGradient(W * 0.7, H * 0.4, 0, W * 0.7, H * 0.4, W * 0.2);
  neb2.addColorStop(0, 'rgba(60,120,200,0.08)');
  neb2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = neb2;
  ctx.fillRect(0, 0, W, H);

  // Red planet with ring
  ctx.save();
  ctx.shadowColor = '#ff6b6b';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#e57373';
  ctx.beginPath();
  ctx.arc(W * 0.15, H * 0.12, Math.min(W, H) * 0.045, 0, Math.PI * 2);
  ctx.fill();
  // Planet ring
  ctx.strokeStyle = 'rgba(200,150,100,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(W * 0.15, H * 0.12, Math.min(W, H) * 0.075, Math.min(W, H) * 0.012, 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Blue planet
  ctx.save();
  ctx.shadowColor = '#90caf9';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#64b5f6';
  ctx.beginPath();
  ctx.arc(W * 0.78, H * 0.08, Math.min(W, H) * 0.028, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Space ground (asteroid surface)
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 18 + Math.sin(x * 0.02) * 4 + Math.sin(x * 0.05) * 2);
  }
  ctx.lineTo(W, H);
  ctx.fill();
  // Craters
  for (let i = 0; i < 6; i++) {
    const cx = W * (0.1 + i * 0.16);
    ctx.fillStyle = '#141428';
    ctx.beginPath();
    ctx.ellipse(cx, H - 8, 6 + i % 3 * 3, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════
// UNDERWATER
// ═══════════════════════════════════════════════════
function drawUnderwater() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#002244');
  sky.addColorStop(0.2, '#003366');
  sky.addColorStop(0.5, '#004d99');
  sky.addColorStop(0.8, '#005522');
  sky.addColorStop(1, '#004d00');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Light rays from surface
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const rx = W * (0.05 + i * 0.13) + Math.sin(frame * 0.006 + i) * 15;
    const grad = ctx.createLinearGradient(rx, 0, rx + 20, H * 0.75);
    grad.addColorStop(0, 'rgba(100,200,255,0.14)');
    grad.addColorStop(0.5, 'rgba(100,200,255,0.06)');
    grad.addColorStop(1, 'rgba(100,200,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + 35, H * 0.75);
    ctx.lineTo(rx - 15, H * 0.75);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Bubbles (more, with glow)
  for (let i = 0; i < 18; i++) {
    const bx = (Math.sin(i * 173) * 0.5 + 0.5) * W;
    const by = ((frame * 0.5 * (0.5 + i % 3 * 0.4) + i * 120) % H);
    const br = 2 + i % 5;
    ctx.save();
    ctx.globalAlpha = 0.25 + Math.sin(i) * 0.1;
    ctx.strokeStyle = '#a0d8ef';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.stroke();
    // Bubble highlight
    ctx.fillStyle = 'rgba(200,240,255,0.2)';
    ctx.beginPath();
    ctx.arc(bx - br * 0.3, by - br * 0.3, br * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Jellyfish blobs
  cloud(W * 0.2 + Math.sin(frame * 0.004) * 10, H * 0.15, W * 0.09, 'rgba(100,180,255,0.12)');
  cloud(W * 0.75 + Math.cos(frame * 0.003) * 8, H * 0.1, W * 0.07, 'rgba(100,180,255,0.12)');

  // Sandy ground with curve
  ctx.fillStyle = '#c8a96e';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 20 + Math.sin(x * 0.015) * 5 + Math.sin(x * 0.04) * 2);
  }
  ctx.lineTo(W, H);
  ctx.fill();
  ctx.fillStyle = '#d4b483';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 10 + Math.sin(x * 0.02 + 1) * 3);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Shells on ground
  for (let i = 0; i < 4; i++) {
    const sx = W * (0.15 + i * 0.25);
    ctx.fillStyle = '#e8d0a8';
    ctx.beginPath();
    ctx.arc(sx, H - 10, 3, Math.PI, 0);
    ctx.fill();
  }

  // Seaweed (more detailed)
  for (let i = 0; i < 7; i++) {
    const sx = W * (0.07 + i * 0.14);
    const sh = 35 + i % 3 * 20;
    ctx.strokeStyle = i % 2 === 0 ? '#2d8a4e' : '#3a9f5a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, H - 18);
    ctx.bezierCurveTo(
      sx + Math.sin(frame * 0.04 + i) * 12, H - 18 - sh / 3,
      sx - Math.sin(frame * 0.04 + i) * 12, H - 18 - sh * 0.7,
      sx + Math.sin(frame * 0.06 + i) * 8, H - 18 - sh
    );
    ctx.stroke();
  }
}

// ═══════════════════════════════════════════════════
// VOLCANO
// ═══════════════════════════════════════════════════
function drawVolcano() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#4a0000');
  sky.addColorStop(0.3, '#8b0000');
  sky.addColorStop(0.6, '#cc2200');
  sky.addColorStop(0.85, '#ff4500');
  sky.addColorStop(1, '#ff6347');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Smoke/ash in sky
  for (let i = 0; i < 5; i++) {
    const cx = W * (0.1 + i * 0.2) + Math.sin(frame * 0.002 + i) * 20;
    const cy = H * 0.1 + i * 15;
    ctx.fillStyle = `rgba(80,40,30,${0.15 + i * 0.03})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 25 + i * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Volcano mountain
  ctx.fillStyle = '#3a1a0a';
  ctx.beginPath();
  ctx.moveTo(W * 0.2, H);
  ctx.lineTo(W * 0.38, H * 0.35);
  ctx.lineTo(W * 0.42, H * 0.33);
  ctx.lineTo(W * 0.58, H * 0.33);
  ctx.lineTo(W * 0.62, H * 0.35);
  ctx.lineTo(W * 0.8, H);
  ctx.fill();

  // Lava in crater
  ctx.save();
  ctx.shadowColor = '#ff4400';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ff6600';
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.34, W * 0.08, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Lava glow at base
  const lavaGlow = ctx.createLinearGradient(0, H - 60, 0, H);
  lavaGlow.addColorStop(0, 'rgba(255,100,0,0)');
  lavaGlow.addColorStop(0.5, 'rgba(255,100,0,0.2)');
  lavaGlow.addColorStop(1, 'rgba(255,60,0,0.4)');
  ctx.fillStyle = lavaGlow;
  ctx.fillRect(0, H - 60, W, 60);

  // Flying embers
  for (let i = 0; i < 15; i++) {
    const ex = (Math.sin(i * 123) * 0.5 + 0.5) * W;
    const ey = H * 0.2 + (Math.sin(i * 89 + frame * 0.02) * 0.5 + 0.5) * H * 0.4;
    const s = 1.5 + Math.sin(frame * 0.05 + i) * 1.5;
    ctx.save();
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 6;
    ctx.fillStyle = i % 3 === 0 ? '#ff9900' : '#ff6600';
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.04 + i) * 0.4;
    ctx.beginPath();
    ctx.arc(ex, ey, s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Rocky ground
  ctx.fillStyle = '#2a1008';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 14 + Math.sin(x * 0.03) * 3);
  }
  ctx.lineTo(W, H);
  ctx.fill();
}

// ═══════════════════════════════════════════════════
// DESERT
// ═══════════════════════════════════════════════════
function drawDesert() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2a6496');
  sky.addColorStop(0.3, '#4682b4');
  sky.addColorStop(0.6, '#e8a040');
  sky.addColorStop(0.85, '#ff8c42');
  sky.addColorStop(1, '#ffa500');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Sun with heat haze
  ctx.save();
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 40;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(W * 0.85, H * 0.18, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const sunHaze = ctx.createRadialGradient(W * 0.85, H * 0.18, 0, W * 0.85, H * 0.18, 80);
  sunHaze.addColorStop(0, 'rgba(255,220,100,0.2)');
  sunHaze.addColorStop(1, 'rgba(255,220,100,0)');
  ctx.fillStyle = sunHaze;
  ctx.fillRect(0, 0, W, H);

  // Sand dunes (background)
  ctx.fillStyle = '#d4a055';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 70 + Math.sin(x * 0.006) * 25 + Math.sin(x * 0.015) * 10);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Foreground dunes
  ctx.fillStyle = '#c19a6b';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 45 + Math.sin(x * 0.01 + 2) * 15 + Math.sin(x * 0.025) * 8);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Cacti (detailed)
  for (let i = 0; i < 4; i++) {
    const cx = W * (0.15 + i * 0.22);
    const cy = H - 35 + Math.sin(cx * 0.01) * 8;
    // Main trunk
    ctx.fillStyle = '#2d6016';
    ctx.beginPath();
    ctx.roundRect(cx - 3, cy - 30, 6, 30, 3);
    ctx.fill();
    // Arms
    ctx.beginPath();
    ctx.roundRect(cx + 3, cy - 22, 10, 4, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + 9, cy - 30, 4, 12, 2);
    ctx.fill();
    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.roundRect(cx - 13, cy - 18, 10, 4, 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(cx - 13, cy - 26, 4, 12, 2);
      ctx.fill();
    }
  }

  // Ground
  ctx.fillStyle = '#b8904a';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 12 + Math.sin(x * 0.03) * 2);
  }
  ctx.lineTo(W, H);
  ctx.fill();
}

// ═══════════════════════════════════════════════════
// AURORA
// ═══════════════════════════════════════════════════
function drawAurora() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#000a12');
  sky.addColorStop(0.4, '#001020');
  sky.addColorStop(0.7, '#001a10');
  sky.addColorStop(1, '#0d1f0d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Stars
  for (let i = 0; i < 50; i++) {
    const sx = (Math.sin(i * 191) * 0.5 + 0.5) * W;
    const sy = (Math.sin(i * 127) * 0.5 + 0.5) * H * 0.5;
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.3 + Math.sin(frame * 0.04 + i) * 0.3;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Aurora bands (wavy, animated)
  const auroraColors = [
    [0, 255, 120], [0, 200, 255], [160, 0, 255], [0, 255, 180], [80, 180, 255]
  ];
  for (let b = 0; b < 5; b++) {
    const baseY = H * (0.08 + b * 0.1);
    const c = auroraColors[b];
    ctx.save();
    ctx.globalAlpha = 0.12 + Math.sin(frame * 0.01 + b) * 0.05;
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.beginPath();
    ctx.moveTo(0, baseY + 20);
    for (let x = 0; x <= W; x += 4) {
      const y = baseY + Math.sin(x * 0.008 + frame * 0.008 + b * 2) * 18
              + Math.sin(x * 0.015 + b) * 8;
      ctx.lineTo(x, y);
    }
    for (let x = W; x >= 0; x -= 4) {
      const y = baseY + 25 + Math.sin(x * 0.01 + frame * 0.006 + b * 2) * 12;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Snowy ground
  curvedGround('#c0d8e8', '#d0e8f0', 20, 10);

  // Snow-covered pine trees
  for (let i = 0; i < 4; i++) {
    const tx = W * (0.15 + i * 0.22);
    const ty = H - 22;
    ctx.fillStyle = '#1a3a2a';
    ctx.beginPath();
    ctx.moveTo(tx, ty - 22);
    ctx.lineTo(tx - 8, ty);
    ctx.lineTo(tx + 8, ty);
    ctx.fill();
    ctx.fillStyle = '#e0f0ff';
    ctx.beginPath();
    ctx.moveTo(tx, ty - 22);
    ctx.lineTo(tx - 5, ty - 12);
    ctx.lineTo(tx + 5, ty - 12);
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════
// CANDY LAND
// ═══════════════════════════════════════════════════
function drawCandy() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#ff99cc');
  sky.addColorStop(0.25, '#ffb3d9');
  sky.addColorStop(0.5, '#ffd6ec');
  sky.addColorStop(0.75, '#b3e0ff');
  sky.addColorStop(1, '#e0b3ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Cotton candy clouds
  cloud(W * 0.15 + Math.sin(frame * 0.003) * 8, H * 0.1, W * 0.1, 'rgba(255,182,230,0.7)');
  cloud(W * 0.6 + Math.cos(frame * 0.002) * 6, H * 0.08, W * 0.08, 'rgba(180,220,255,0.7)');
  cloud(W * 0.85 + Math.sin(frame * 0.0025) * 5, H * 0.14, W * 0.07, 'rgba(224,179,255,0.7)');

  // Floating candies
  const candyColors = ['#ff6b8a', '#66ccff', '#cc66ff', '#ffcc00', '#66ff99'];
  for (let i = 0; i < 6; i++) {
    const cx = W * (0.08 + i * 0.17);
    const cy = H * 0.22 + Math.sin(frame * 0.015 + i * 2) * 10 + i % 2 * 20;
    ctx.save();
    ctx.shadowColor = candyColors[i % 5];
    ctx.shadowBlur = 8;
    ctx.fillStyle = candyColors[i % 5];
    ctx.beginPath();
    ctx.arc(cx, cy, 6 + i % 3 * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Candy cane lollipops
  for (let i = 0; i < 3; i++) {
    const lx = W * (0.2 + i * 0.3);
    const ly = H - 28;
    // Stick
    ctx.fillStyle = '#fff';
    ctx.fillRect(lx - 1.5, ly - 25, 3, 25);
    // Swirl top
    ctx.fillStyle = i % 2 === 0 ? '#ff6b8a' : '#66ccff';
    ctx.beginPath();
    ctx.arc(lx, ly - 28, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(lx, ly - 28, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wavy candy ground
  ctx.fillStyle = '#ffb8d9';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 25 + Math.sin(x * 0.02) * 6 + Math.sin(x * 0.05) * 3);
  }
  ctx.lineTo(W, H);
  ctx.fill();
  ctx.fillStyle = '#ffccee';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 12 + Math.sin(x * 0.025 + 1) * 4);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Sprinkles on ground
  const sprinkleColors = ['#ff6b8a', '#66ccff', '#ffcc00', '#66ff99', '#cc66ff'];
  for (let i = 0; i < 12; i++) {
    const sx = W * (0.05 + i * 0.08);
    ctx.fillStyle = sprinkleColors[i % 5];
    ctx.save();
    ctx.translate(sx, H - 8);
    ctx.rotate(i * 0.8);
    ctx.fillRect(-1, -3, 2, 6);
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════
// GOLDEN HOUR
// ═══════════════════════════════════════════════════
function drawGolden() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2a0845');
  sky.addColorStop(0.2, '#4a148c');
  sky.addColorStop(0.45, '#d84315');
  sky.addColorStop(0.65, '#ff6f00');
  sky.addColorStop(0.85, '#ffab00');
  sky.addColorStop(1, '#ffd600');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Big sun with layers of glow
  ctx.save();
  ctx.shadowColor = '#ffd600';
  ctx.shadowBlur = 50;
  ctx.fillStyle = '#ffd600';
  ctx.beginPath();
  ctx.arc(W * 0.5, H * 0.38, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Sun glow rings
  for (let r = 0; r < 3; r++) {
    const glow = ctx.createRadialGradient(W * 0.5, H * 0.38, 45, W * 0.5, H * 0.38, 80 + r * 30);
    glow.addColorStop(0, `rgba(255,214,0,${0.12 - r * 0.03})`);
    glow.addColorStop(1, 'rgba(255,214,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  // Silhouette birds
  for (let i = 0; i < 4; i++) {
    const bx = W * (0.2 + i * 0.18) + Math.sin(frame * 0.005 + i) * 10;
    const by = H * 0.25 + i * 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx - 4, by, 4, Math.PI * 1.1, Math.PI * 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bx + 4, by, 4, Math.PI * 1.2, Math.PI * 1.9);
    ctx.stroke();
  }

  // Rolling dark hills
  ctx.fillStyle = '#5a2d0c';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 50 + Math.sin(x * 0.008) * 15 + Math.sin(x * 0.02) * 8);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  curvedGround('#8b4513', '#6b3410', 25, 14);
}

// ═══════════════════════════════════════════════════
// MOUNTAINS
// ═══════════════════════════════════════════════════
function drawMountains() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#5a9fd4');
  sky.addColorStop(0.3, '#87ceeb');
  sky.addColorStop(0.6, '#b0d4f1');
  sky.addColorStop(1, '#d4e8f7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Sun
  ctx.save();
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.2, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Clouds
  cloud(W * 0.2 + Math.sin(frame * 0.002) * 6, H * 0.1, W * 0.08, 'rgba(255,255,255,0.7)');
  cloud(W * 0.6 + Math.cos(frame * 0.0015) * 5, H * 0.06, W * 0.06, 'rgba(255,255,255,0.7)');

  // Far mountains (blueish, hazy)
  ctx.fillStyle = '#8aa4bf';
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.moveTo(0, H * 0.65);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H * 0.55 + Math.sin(x * 0.005) * H * 0.08 + Math.sin(x * 0.012) * H * 0.04);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.fill();

  // Mid mountains
  ctx.fillStyle = '#5f7a8f';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.7);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H * 0.6 + Math.sin(x * 0.007 + 1) * H * 0.1 + Math.sin(x * 0.018) * H * 0.03);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.fill();

  // Near mountains
  ctx.fillStyle = '#4a5f7a';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.8);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H * 0.7 + Math.sin(x * 0.009 + 2) * H * 0.06 + Math.sin(x * 0.022) * H * 0.025);
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.fill();

  // Snow caps (on peaks)
  ctx.fillStyle = '#e8f0ff';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.7);
  for (let x = 0; x <= W; x += 3) {
    const my = H * 0.6 + Math.sin(x * 0.007 + 1) * H * 0.1 + Math.sin(x * 0.018) * H * 0.03;
    const snowY = my + 5;
    if (my < H * 0.6) {
      ctx.lineTo(x, snowY);
    } else {
      ctx.lineTo(x, my);
    }
  }
  ctx.lineTo(W, H * 0.7);
  ctx.lineTo(0, H * 0.7);
  ctx.fill();

  // Green ground
  curvedGround('#6a9f5a', '#8fbc8f', 28, 14);

  // Small trees on ground
  for (let i = 0; i < 4; i++) {
    const tx = W * (0.12 + i * 0.25);
    smallTree(tx, H - 22, 14, '#4a8f4a');
  }
}

// ═══════════════════════════════════════════════════
// CASTLE
// ═══════════════════════════════════════════════════
function drawCastle() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#1a0525');
  sky.addColorStop(0.3, '#2c0735');
  sky.addColorStop(0.6, '#5b1865');
  sky.addColorStop(1, '#8b3a8b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Stars
  for (let i = 0; i < 40; i++) {
    const sx = (Math.sin(i * 137) * 0.5 + 0.5) * W;
    const sy = (Math.sin(i * 91) * 0.5 + 0.5) * H * 0.4;
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.3 + Math.sin(frame * 0.04 + i * 2) * 0.35;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.5 + (i % 3) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Castle silhouette (smoother)
  ctx.fillStyle = '#1a0d1f';

  // Left tower
  ctx.beginPath();
  ctx.roundRect(W * 0.22, H * 0.42, W * 0.16, H * 0.58, [4, 4, 0, 0]);
  ctx.fill();
  // Left tower roof
  ctx.beginPath();
  ctx.moveTo(W * 0.22, H * 0.42);
  ctx.lineTo(W * 0.3, H * 0.32);
  ctx.lineTo(W * 0.38, H * 0.42);
  ctx.fill();

  // Right tower
  ctx.beginPath();
  ctx.roundRect(W * 0.58, H * 0.38, W * 0.16, H * 0.62, [4, 4, 0, 0]);
  ctx.fill();
  // Right tower roof
  ctx.beginPath();
  ctx.moveTo(W * 0.58, H * 0.38);
  ctx.lineTo(W * 0.66, H * 0.28);
  ctx.lineTo(W * 0.74, H * 0.38);
  ctx.fill();

  // Center wall
  ctx.fillRect(W * 0.38, H * 0.55, W * 0.2, H * 0.45);

  // Battlements
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(W * 0.38 + i * W * 0.04, H * 0.52, W * 0.025, W * 0.025);
  }

  // Gate arch
  ctx.fillStyle = '#100818';
  ctx.beginPath();
  ctx.arc(W * 0.48, H * 0.82, W * 0.04, Math.PI, 0);
  ctx.lineTo(W * 0.52, H);
  ctx.lineTo(W * 0.44, H);
  ctx.fill();

  // Window lights
  const windowGlow = ['#ffe066', '#ffcc33'];
  for (let t = 0; t < 2; t++) {
    const tx = t === 0 ? W * 0.3 : W * 0.66;
    const ty = t === 0 ? H * 0.52 : H * 0.48;
    ctx.save();
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur = 10;
    ctx.fillStyle = windowGlow[t];
    ctx.beginPath();
    ctx.arc(tx, ty, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tx, ty + 18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Ground
  curvedGround('#1a2a10', '#2d5016', 22, 10);
}

// ═══════════════════════════════════════════════════
// HAUNTED HOUSE
// ═══════════════════════════════════════════════════
function drawHaunted() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#080818');
  sky.addColorStop(0.3, '#0f0f23');
  sky.addColorStop(0.7, '#1a1a3e');
  sky.addColorStop(1, '#2d2d5a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Full moon with glow
  ctx.save();
  ctx.shadowColor = '#f0e68c';
  ctx.shadowBlur = 40;
  ctx.fillStyle = '#f0e68c';
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(W * 0.75, H * 0.18, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
  const moonGlow = ctx.createRadialGradient(W * 0.75, H * 0.18, 0, W * 0.75, H * 0.18, 100);
  moonGlow.addColorStop(0, 'rgba(240,230,140,0.1)');
  moonGlow.addColorStop(1, 'rgba(240,230,140,0)');
  ctx.fillStyle = moonGlow;
  ctx.fillRect(0, 0, W, H);

  // Creepy clouds
  ctx.fillStyle = 'rgba(80,80,100,0.3)';
  ctx.beginPath();
  ctx.ellipse(W * 0.3, H * 0.15, 65, 18, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W * 0.6, H * 0.25, 50, 15, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Dead trees (more detailed with branches)
  for (let t = 0; t < 2; t++) {
    const tx = t === 0 ? W * 0.13 : W * 0.87;
    const dir = t === 0 ? 1 : -1;
    ctx.strokeStyle = '#1a1a2a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tx, H - 15);
    ctx.lineTo(tx, H * 0.5);
    ctx.stroke();
    // Branches
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(tx, H * 0.6);
    ctx.bezierCurveTo(tx + dir * 15, H * 0.57, tx + dir * 20, H * 0.53, tx + dir * 25, H * 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx, H * 0.55);
    ctx.bezierCurveTo(tx - dir * 10, H * 0.5, tx - dir * 18, H * 0.48, tx - dir * 22, H * 0.5);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, H * 0.52);
    ctx.lineTo(tx + dir * 12, H * 0.47);
    ctx.stroke();
  }

  // Haunted house (smoother)
  ctx.fillStyle = '#121218';
  // Main body
  ctx.beginPath();
  ctx.roundRect(W * 0.38, H * 0.52, W * 0.24, H * 0.38, [3, 3, 0, 0]);
  ctx.fill();
  // Upper floor
  ctx.beginPath();
  ctx.roundRect(W * 0.44, H * 0.46, W * 0.16, H * 0.12, [2, 2, 0, 0]);
  ctx.fill();
  // Roof
  ctx.beginPath();
  ctx.moveTo(W * 0.35, H * 0.52);
  ctx.lineTo(W * 0.5, H * 0.38);
  ctx.lineTo(W * 0.65, H * 0.52);
  ctx.fill();

  // Window glow (spooky yellow)
  const windows = [
    [W * 0.44, H * 0.64, 7, 9],
    [W * 0.56, H * 0.64, 7, 9],
    [W * 0.5, H * 0.5, 5, 7],
  ];
  for (const [wx, wy, ww, wh] of windows) {
    ctx.save();
    ctx.shadowColor = '#ffff66';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255,255,100,0.7)';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.restore();
  }

  // Bats near moon
  for (let i = 0; i < 3; i++) {
    const bx = W * 0.65 + i * 15 + Math.sin(frame * 0.03 + i * 2) * 8;
    const by = H * 0.12 + Math.sin(frame * 0.04 + i) * 5;
    ctx.fillStyle = '#0a0a15';
    ctx.beginPath();
    ctx.arc(bx - 3, by, 2.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + 3, by, 2.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fill();
  }

  // Ground with fog
  curvedGround('#151530', '#1f1f3a', 22, 10);
  // Fog layer
  ctx.fillStyle = 'rgba(180,180,210,0.08)';
  ctx.fillRect(0, H - 40, W, 18);
  ctx.fillStyle = 'rgba(180,180,210,0.12)';
  ctx.fillRect(0, H - 32, W, 10);
}

// ═══════════════════════════════════════════════════
// SHIPWRECK
// ═══════════════════════════════════════════════════
function drawShipwreck() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#1a2a3a');
  sky.addColorStop(0.3, '#2c3e50');
  sky.addColorStop(0.5, '#34495e');
  sky.addColorStop(1, '#4a5f7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Lightning flash (occasional)
  if (Math.sin(frame * 0.02) > 0.98) {
    ctx.fillStyle = 'rgba(200,200,255,0.06)';
    ctx.fillRect(0, 0, W, H);
  }

  // Rain (more realistic angled)
  ctx.strokeStyle = 'rgba(180,190,220,0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 45; i++) {
    const rx = ((Math.sin(i * 71 + frame * 0.15) * 0.5 + 0.5) * W * 1.2) - W * 0.1;
    const ry = ((frame * 2 + i * 97) % (H * 0.65));
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 3, ry + 14);
    ctx.stroke();
  }

  // Ocean waves (layered)
  const waveBase = H * 0.62;
  ctx.fillStyle = '#1a3050';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, waveBase + Math.sin(x * 0.012 + frame * 0.02) * 10 + Math.sin(x * 0.025) * 5);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // Wave highlights
  ctx.fillStyle = '#2c5f8d';
  for (let i = 0; i < 10; i++) {
    const wx = i * W / 9 + Math.sin(frame * 0.015 + i) * 8;
    const wy = waveBase + 5 + Math.sin(frame * 0.03 + i) * 8;
    ctx.beginPath();
    ctx.ellipse(wx, wy, W * 0.08, 6, 0, 0, Math.PI);
    ctx.fill();
  }

  // Foam
  ctx.fillStyle = 'rgba(200,220,240,0.15)';
  for (let x = 0; x <= W; x += 8) {
    const fy = waveBase + Math.sin(x * 0.015 + frame * 0.02) * 8 - 2;
    ctx.beginPath();
    ctx.arc(x, fy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shipwreck (more detailed)
  ctx.fillStyle = '#4a2a10';
  // Hull (curved)
  ctx.beginPath();
  ctx.moveTo(W * 0.32, H * 0.68);
  ctx.quadraticCurveTo(W * 0.3, H * 0.82, W * 0.33, H * 0.84);
  ctx.lineTo(W * 0.67, H * 0.84);
  ctx.quadraticCurveTo(W * 0.7, H * 0.82, W * 0.68, H * 0.68);
  ctx.fill();
  // Hull planks
  ctx.strokeStyle = '#3a1a08';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 4; i++) {
    const py = H * 0.72 + i * 8;
    ctx.beginPath();
    ctx.moveTo(W * 0.33, py);
    ctx.lineTo(W * 0.67, py);
    ctx.stroke();
  }

  // Broken mast
  ctx.fillStyle = '#5a3a1a';
  ctx.save();
  ctx.translate(W * 0.48, H * 0.68);
  ctx.rotate(-0.05);
  ctx.fillRect(-2, -H * 0.2, 4, H * 0.2);
  ctx.restore();
  // Crow's nest
  ctx.fillRect(W * 0.46, H * 0.48, 8, 3);

  // Torn sail
  ctx.fillStyle = 'rgba(200,185,165,0.5)';
  ctx.beginPath();
  ctx.moveTo(W * 0.5, H * 0.52);
  ctx.quadraticCurveTo(W * 0.54, H * 0.57 + Math.sin(frame * 0.03) * 3, W * 0.57, H * 0.62);
  ctx.lineTo(W * 0.5, H * 0.64);
  ctx.fill();

  // Second broken mast (tilted)
  ctx.save();
  ctx.translate(W * 0.6, H * 0.7);
  ctx.rotate(0.2);
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(-1.5, -H * 0.12, 3, H * 0.12);
  ctx.restore();

  // Water surface shimmer
  ctx.fillStyle = 'rgba(100,160,200,0.15)';
  ctx.fillRect(0, H * 0.83, W, 4);

  // Seabed
  ctx.fillStyle = '#a08860';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 14 + Math.sin(x * 0.02) * 3);
  }
  ctx.lineTo(W, H);
  ctx.fill();
  ctx.fillStyle = '#c2b280';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, H - 8 + Math.sin(x * 0.03 + 1) * 2);
  }
  ctx.lineTo(W, H);
  ctx.fill();
}
