import { APPLE_SKINS, BOWL_SKINS } from './data.js';
import { rrect, starShape } from './helpers.js';

export function drawApple(ctx, x, y, r, skinId, angle, t) {
  t = t || 0;
  const sk = APPLE_SKINS.find(s => s.id === skinId) || APPLE_SKINS[0];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle || 0);

  // Glow effect
  if (sk.special === 'glow') {
    ctx.shadowColor = sk.shine;
    ctx.shadowBlur = r * 0.8;
  }

  // Build body fill
  let bodyFill;
  if (sk.special === 'rainbow') {
    const rg = ctx.createLinearGradient(-r, -r, r, r);
    rg.addColorStop(0,    '#f44336');
    rg.addColorStop(0.25, '#ff9800');
    rg.addColorStop(0.5,  '#4caf50');
    rg.addColorStop(0.75, '#2196f3');
    rg.addColorStop(1,    '#9c27b0');
    bodyFill = rg;
  } else {
    bodyFill = sk.body;
  }

  // --- Main body (slightly wide ellipse) ---
  ctx.beginPath();
  ctx.ellipse(0, r * 0.06, r * 0.88, r * 0.84, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyFill;
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- Left lobe ---
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.58, r * 0.34, r * 0.32, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyFill;
  ctx.fill();

  // --- Right lobe ---
  ctx.beginPath();
  ctx.ellipse(r * 0.3, -r * 0.58, r * 0.34, r * 0.32, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyFill;
  ctx.fill();

  // --- Dark cleft between lobes ---
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.52, r * 0.16, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fill();

  // --- Shading on right side ---
  const shade = ctx.createRadialGradient(r * 0.3, r * 0.15, 0, 0, 0, r);
  shade.addColorStop(0, 'rgba(0,0,0,0)');
  shade.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.beginPath();
  ctx.ellipse(0, r * 0.06, r * 0.88, r * 0.84, 0, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  // --- Main shine ---
  ctx.beginPath();
  ctx.ellipse(-r * 0.27, -r * 0.28, r * 0.24, r * 0.14, -0.55, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.fill();

  // --- Small secondary shine ---
  ctx.beginPath();
  ctx.ellipse(-r * 0.14, -r * 0.1, r * 0.1, r * 0.06, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fill();

  // --- Stem ---
  ctx.strokeStyle = sk.stem;
  ctx.lineWidth = Math.max(1.5, r * 0.1);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.78);
  ctx.bezierCurveTo(r * 0.08, -r * 1.15, r * 0.28, -r * 1.2, r * 0.2, -r * 1.32);
  ctx.stroke();

  // --- Leaf ---
  ctx.save();
  ctx.translate(r * 0.08, -r * 0.98);
  ctx.rotate(0.45);
  ctx.beginPath();
  ctx.ellipse(r * 0.24, -r * 0.06, r * 0.3, r * 0.13, 0.15, 0, Math.PI * 2);
  ctx.fillStyle = sk.leaf;
  ctx.fill();
  // Leaf vein
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = Math.max(1, r * 0.04);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(r * 0.45, -r * 0.05);
  ctx.stroke();
  ctx.restore();

  // --- Special effects ---
  if (sk.special === 'sparkle') {
    for (let i = 0; i < 4; i++) {
      const sa = (t * 0.05 + i * Math.PI / 2);
      const sx = Math.cos(sa) * r * 0.72;
      const sy = Math.sin(sa) * r * 0.68;
      const ss = r * 0.1 * (0.5 + 0.5 * Math.sin(t * 0.12 + i));
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      starShape(ctx, sx, sy, ss);
    }
  }

  if (sk.special === 'stars') {
    for (let i = 0; i < 5; i++) {
      const sa = (t * 0.03 + i * Math.PI * 0.4);
      const sd = r * (0.52 + 0.14 * Math.sin(t * 0.07 + i));
      ctx.beginPath();
      ctx.arc(Math.cos(sa) * sd, Math.sin(sa) * sd, r * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(' + ((i * 72 + t * 2) % 360) + ',100%,85%)';
      ctx.fill();
    }
  }

  ctx.restore();
}

export function drawBowl(ctx, cx, cy, w, h, skinId, t) {
  t = t || 0;
  const sk = BOWL_SKINS.find(s => s.id === skinId) || BOWL_SKINS[0];
  ctx.save();
  ctx.translate(cx, cy);

  const hw = w / 2, hh = h / 2;

  if (sk.special === 'glow') {
    ctx.shadowColor = sk.dark;
    ctx.shadowBlur = 20;
  }

  // Body fill
  let bodyFill;
  if (!sk.body) {
    // rainbow
    const rg = ctx.createLinearGradient(-hw, 0, hw, 0);
    rg.addColorStop(0,    '#f44336');
    rg.addColorStop(0.33, '#4caf50');
    rg.addColorStop(0.67, '#2196f3');
    rg.addColorStop(1,    '#9c27b0');
    bodyFill = rg;
  } else {
    bodyFill = sk.body;
  }

  // --- Bowl body (trapezoid via bezier) ---
  ctx.beginPath();
  ctx.moveTo(-hw, -hh * 0.25);
  ctx.bezierCurveTo(-hw, hh * 1.1, hw, hh * 1.1, hw, -hh * 0.25);
  ctx.closePath();
  ctx.fillStyle = bodyFill;
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- Inside ellipse (lighter) ---
  ctx.beginPath();
  ctx.ellipse(0, -hh * 0.12, hw * 0.72, hh * 0.34, 0, 0, Math.PI * 2);
  ctx.fillStyle = sk.inside;
  ctx.fill();

  // --- Rim ellipse ---
  ctx.beginPath();
  ctx.ellipse(0, -hh * 0.25, hw, hh * 0.3, 0, 0, Math.PI * 2);
  ctx.fillStyle = sk.rim;
  ctx.fill();

  // --- Rim shine ---
  ctx.beginPath();
  ctx.ellipse(-hw * 0.26, -hh * 0.38, hw * 0.28, hh * 0.12, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.fill();

  // --- Wood grain ---
  if (sk.special === 'grain') {
    ctx.strokeStyle = 'rgba(62,39,35,0.28)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(0, hh * 0.18 + i * hh * 0.24, hw * (0.56 - i * 0.1), hh * (0.13 - i * 0.02), 0, 0, Math.PI);
      ctx.stroke();
    }
  }

  // --- Galaxy stars inside bowl ---
  if (sk.special === 'stars') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-hw, -hh * 0.25);
    ctx.bezierCurveTo(-hw, hh * 1.1, hw, hh * 1.1, hw, -hh * 0.25);
    ctx.closePath();
    ctx.clip();
    for (let i = 0; i < 7; i++) {
      const sa = (t * 0.018 + i * 0.9);
      ctx.beginPath();
      ctx.arc(Math.cos(sa) * hw * 0.52, hh * 0.35 + Math.sin(sa + i) * hh * 0.28, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(' + ((i * 51 + t) % 360) + ',100%,82%)';
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Crystal sparkles ---
  if (sk.special === 'sparkle') {
    for (let i = 0; i < 3; i++) {
      const sa = (t * 0.035 + i * Math.PI * 0.67);
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      starShape(ctx, Math.cos(sa) * hw * 0.44, hh * 0.45 + Math.sin(sa) * hh * 0.22, 4);
    }
  }

  ctx.restore();
}

export function drawChest(ctx, cx, cy, w, h, ch) {
  ctx.save();
  ctx.translate(cx, cy);
  const hw = w / 2, hh = h / 2;

  // Drop shadow
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  // Body
  rrect(ctx, -hw, -hh * 0.1, w, hh * 1.05, 5);
  ctx.fillStyle = ch.bodyCol;
  ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // Lid
  rrect(ctx, -hw, -hh, w, hh * 0.6, 5);
  ctx.fillStyle = ch.topCol;
  ctx.fill();

  // Band across middle
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(-hw, -hh * 0.14, w, hh * 0.16);

  // Latch
  rrect(ctx, -hw * 0.18, -hh * 0.04, hw * 0.36, hh * 0.2, 3);
  ctx.fillStyle = ch.lockCol;
  ctx.fill();

  // Hinge dots
  ctx.fillStyle = ch.lockCol;
  [-0.38, 0.38].forEach(ox => {
    ctx.beginPath();
    ctx.arc(hw * ox, -hh * 0.24, hw * 0.08, 0, Math.PI * 2);
    ctx.fill();
  });

  // Shine on lid
  ctx.beginPath();
  ctx.ellipse(-hw * 0.22, -hh * 0.62, hw * 0.22, hh * 0.1, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fill();

  ctx.restore();
}
