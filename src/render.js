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

  // --- Smiley face ---
  if (sk.special === 'smiley') {
    // Big round eyes
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.15, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.28, -r * 0.15, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
    // Big eye shines
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-r * 0.22, -r * 0.22, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.34, -r * 0.22, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
    // Thick wide smile
    ctx.strokeStyle = '#111';
    ctx.lineWidth = Math.max(2.5, r * 0.12);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, r * 0.05, r * 0.4, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Bright rosy cheeks
    ctx.fillStyle = 'rgba(255,80,80,0.45)';
    ctx.beginPath();
    ctx.arc(-r * 0.5, r * 0.18, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.5, r * 0.18, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Pixel effect ---
  if (sk.special === 'pixel') {
    ctx.save();
    // Clip to apple shape
    ctx.beginPath();
    ctx.ellipse(0, r * 0.06, r * 0.88, r * 0.84, 0, 0, Math.PI * 2);
    ctx.clip();
    // Big chunky pixel blocks
    const pxSize = Math.max(5, r * 0.32);
    const cols = ['#ff2222', '#aa0000', '#ff5555', '#dd1111', '#880000', '#ff7777', '#cc2222', '#ee3333'];
    for (let py = -r * 1.2; py < r * 1.4; py += pxSize) {
      for (let px = -r * 1.2; px < r * 1.2; px += pxSize) {
        const ci = (Math.abs(Math.floor(px * 3.7 + py * 5.3)) % cols.length);
        ctx.fillStyle = cols[ci];
        ctx.fillRect(px, py, pxSize - 1, pxSize - 1);
      }
    }
    // Bold black grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1;
    for (let py = -r * 1.2; py < r * 1.4; py += pxSize) {
      ctx.beginPath();
      ctx.moveTo(-r * 1.2, py);
      ctx.lineTo(r * 1.2, py);
      ctx.stroke();
    }
    for (let px = -r * 1.2; px < r * 1.2; px += pxSize) {
      ctx.beginPath();
      ctx.moveTo(px, -r * 1.2);
      ctx.lineTo(px, r * 1.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Dog face ---
  if (sk.special === 'dog') {
    // Big floppy ears
    ctx.fillStyle = '#5a3a1a';
    // Left ear
    ctx.beginPath();
    ctx.ellipse(-r * 0.7, -r * 0.2, r * 0.3, r * 0.55, 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.ellipse(r * 0.7, -r * 0.2, r * 0.3, r * 0.55, -0.35, 0, Math.PI * 2);
    ctx.fill();
    // Inner ear (pink)
    ctx.fillStyle = '#c4886a';
    ctx.beginPath();
    ctx.ellipse(-r * 0.7, -r * 0.15, r * 0.18, r * 0.35, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.7, -r * 0.15, r * 0.18, r * 0.35, -0.35, 0, Math.PI * 2);
    ctx.fill();
    // Big snout
    ctx.fillStyle = '#d4aa7a';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.22, r * 0.4, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Big round eyes
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.15, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.28, -r * 0.15, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    // Big eye shines
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-r * 0.22, -r * 0.22, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.34, -r * 0.22, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Big nose
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.1, r * 0.15, r * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nose shine
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.05, r * 0.06, r * 0.06, r * 0.04, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Mouth line
    ctx.strokeStyle = '#333';
    ctx.lineWidth = Math.max(1.5, r * 0.07);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.21);
    ctx.lineTo(0, r * 0.32);
    ctx.stroke();
    // Smile curves
    ctx.beginPath();
    ctx.arc(-r * 0.12, r * 0.38, r * 0.14, -0.4, Math.PI * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r * 0.12, r * 0.38, r * 0.14, Math.PI * 0.85, Math.PI + 0.4);
    ctx.stroke();
    // Big pink tongue
    ctx.fillStyle = '#ff6088';
    ctx.beginPath();
    ctx.ellipse(r * 0.04, r * 0.48, r * 0.11, r * 0.14, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Tongue line
    ctx.strokeStyle = '#e04870';
    ctx.lineWidth = Math.max(1, r * 0.04);
    ctx.beginPath();
    ctx.moveTo(r * 0.04, r * 0.38);
    ctx.lineTo(r * 0.04, r * 0.55);
    ctx.stroke();
  }

  // --- Demon face (horns + fanged smiley) ---
  if (sk.special === 'demon') {
    // Horns
    ctx.fillStyle = '#1a0000';
    // Left horn
    ctx.beginPath();
    ctx.moveTo(-r * 0.45, -r * 0.7);
    ctx.lineTo(-r * 0.7, -r * 1.3);
    ctx.lineTo(-r * 0.15, -r * 0.65);
    ctx.fill();
    // Right horn
    ctx.beginPath();
    ctx.moveTo(r * 0.45, -r * 0.7);
    ctx.lineTo(r * 0.7, -r * 1.3);
    ctx.lineTo(r * 0.15, -r * 0.65);
    ctx.fill();
    // Horn highlights
    ctx.fillStyle = '#3a0000';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.75);
    ctx.lineTo(-r * 0.6, -r * 1.15);
    ctx.lineTo(-r * 0.25, -r * 0.7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r * 0.4, -r * 0.75);
    ctx.lineTo(r * 0.6, -r * 1.15);
    ctx.lineTo(r * 0.25, -r * 0.7);
    ctx.fill();
    // Glowing eyes
    ctx.save();
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ff2200';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.15, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.28, -r * 0.15, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Evil eye pupils (slitted)
    ctx.fillStyle = '#000';
    ctx.fillRect(-r * 0.3, -r * 0.25, r * 0.04, r * 0.2);
    ctx.fillRect(r * 0.26, -r * 0.25, r * 0.04, r * 0.2);
    // Wide evil smile
    ctx.strokeStyle = '#111';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, r * 0.05, r * 0.38, 0.15, Math.PI - 0.15);
    ctx.stroke();
    // Fangs
    ctx.fillStyle = '#fff';
    // Left fang
    ctx.beginPath();
    ctx.moveTo(-r * 0.25, r * 0.2);
    ctx.lineTo(-r * 0.18, r * 0.42);
    ctx.lineTo(-r * 0.11, r * 0.2);
    ctx.fill();
    // Right fang
    ctx.beginPath();
    ctx.moveTo(r * 0.11, r * 0.2);
    ctx.lineTo(r * 0.18, r * 0.42);
    ctx.lineTo(r * 0.25, r * 0.2);
    ctx.fill();
  }

  // --- Angel face (wings + happy face + halo) ---
  if (sk.special === 'angel') {
    // Halo above the apple
    ctx.save();
    ctx.strokeStyle = 'rgba(255,215,0,0.7)';
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.95, r * 0.4, r * 0.12, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // Wings
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    // Left wing
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.quadraticCurveTo(-r * 1.5, -r * 0.6, -r * 0.85, -r * 0.5);
    ctx.quadraticCurveTo(-r * 1.3, -r * 0.2, -r * 0.7, 0);
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(r * 0.7, 0);
    ctx.quadraticCurveTo(r * 1.5, -r * 0.6, r * 0.85, -r * 0.5);
    ctx.quadraticCurveTo(r * 1.3, -r * 0.2, r * 0.7, 0);
    ctx.fill();
    // Wing feather details
    ctx.strokeStyle = 'rgba(200,200,230,0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.1);
    ctx.quadraticCurveTo(-r * 1.2, -r * 0.4, -r * 0.85, -r * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r * 0.8, -r * 0.1);
    ctx.quadraticCurveTo(r * 1.2, -r * 0.4, r * 0.85, -r * 0.45);
    ctx.stroke();
    // Happy eyes (closed, happy arcs)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.12, r * 0.1, Math.PI + 0.3, -0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r * 0.25, -r * 0.12, r * 0.1, Math.PI + 0.3, -0.3);
    ctx.stroke();
    // Gentle smile
    ctx.strokeStyle = '#555';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.beginPath();
    ctx.arc(0, r * 0.08, r * 0.28, 0.3, Math.PI - 0.3);
    ctx.stroke();
    // Rosy cheeks
    ctx.fillStyle = 'rgba(255,180,200,0.4)';
    ctx.beginPath();
    ctx.arc(-r * 0.45, r * 0.15, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.45, r * 0.15, r * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Leprechaun (green top hat + gold buckle + clover) ---
  if (sk.special === 'leprechaun') {
    // Top hat
    const hatW = r * 0.7, hatH = r * 0.55;
    ctx.fillStyle = '#2e7d32';
    // Hat brim
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.72, hatW * 0.85, r * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hat body
    ctx.fillRect(-hatW * 0.45, -r * 0.72 - hatH, hatW * 0.9, hatH);
    // Hat top
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.72 - hatH, hatW * 0.45, r * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    // Gold band
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-hatW * 0.45, -r * 0.72 - hatH * 0.3, hatW * 0.9, hatH * 0.18);
    // Gold buckle
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.strokeRect(-r * 0.08, -r * 0.72 - hatH * 0.38, r * 0.16, hatH * 0.32);

    // Clover on the side
    ctx.fillStyle = '#1b5e20';
    const clx = r * 0.55, cly = r * 0.1;
    ctx.fillRect(clx - 0.5, cly, 1, r * 0.2);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
      ctx.beginPath();
      ctx.ellipse(clx + Math.cos(a) * r * 0.08, cly - Math.sin(a) * r * 0.08, r * 0.07, r * 0.05, a, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Dark (black body + purple shimmer + glow) ---
  if (sk.special === 'dark') {
    // Dark purple glow effect
    ctx.save();
    ctx.globalAlpha = 0.2 + Math.sin(t * 0.04) * 0.1;
    ctx.shadowColor = '#7b1fa2';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Subtle purple sparkles
    for (let i = 0; i < 4; i++) {
      const sa = t * 0.02 + i * Math.PI / 2;
      const sx = Math.cos(sa) * r * 0.5;
      const sy = Math.sin(sa) * r * 0.5;
      ctx.fillStyle = 'rgba(180,100,255,' + (0.3 + Math.sin(t * 0.05 + i) * 0.2) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Neon (glowing bright outline + pulsing glow) ---
  if (sk.special === 'neon') {
    ctx.save();
    ctx.globalAlpha = 0.5 + Math.sin(t * 0.06) * 0.3;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 18;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // Neon flicker dots
    for (let i = 0; i < 6; i++) {
      const a = t * 0.03 + i * Math.PI / 3;
      const d = r * 0.7 + Math.sin(t * 0.08 + i) * r * 0.15;
      ctx.fillStyle = 'rgba(0,255,136,' + (0.5 + Math.sin(t * 0.1 + i * 2) * 0.4) + ')';
      ctx.beginPath();
      ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Ice (frost crystals + icicles) ---
  if (sk.special === 'ice') {
    // Frost shimmer
    ctx.save();
    ctx.globalAlpha = 0.2 + Math.sin(t * 0.04) * 0.1;
    ctx.fillStyle = '#e1f5fe';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Icicles hanging from bottom
    ctx.fillStyle = 'rgba(129,212,250,0.7)';
    for (let i = 0; i < 3; i++) {
      const ix = -r * 0.3 + i * r * 0.3;
      const ih = r * 0.25 + Math.sin(i * 2) * r * 0.08;
      ctx.beginPath();
      ctx.moveTo(ix - r * 0.06, r * 0.6);
      ctx.lineTo(ix, r * 0.6 + ih);
      ctx.lineTo(ix + r * 0.06, r * 0.6);
      ctx.fill();
    }
    // Frost sparkles
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
      const fx = (Math.sin(i * 3 + 1) * 0.6) * r;
      const fy = (Math.cos(i * 2 + 0.5) * 0.5) * r;
      ctx.globalAlpha = 0.4 + Math.sin(t * 0.06 + i * 1.5) * 0.3;
      ctx.beginPath();
      ctx.arc(fx, fy, r * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // --- Ghost (semi-transparent + wobbly + spooky eyes) ---
  if (sk.special === 'ghost') {
    // Ghostly wobble overlay
    ctx.save();
    ctx.globalAlpha = 0.15 + Math.sin(t * 0.05) * 0.1;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(Math.sin(t * 0.03) * r * 0.05, 0, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Spooky eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(-r * 0.22, -r * 0.1, r * 0.12, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.22, -r * 0.1, r * 0.12, r * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Glowing pupils
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-r * 0.22, -r * 0.12, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.22, -r * 0.12, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
    // Open mouth
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.2, r * 0.12, r * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Crown (golden crown on top) ---
  if (sk.special === 'crown') {
    ctx.fillStyle = '#ffd600';
    ctx.strokeStyle = '#ff8f00';
    ctx.lineWidth = Math.max(1, r * 0.04);
    // Crown base
    const cw = r * 0.7, ch = r * 0.35;
    const cy2 = -r * 0.75;
    ctx.beginPath();
    ctx.moveTo(-cw / 2, cy2);
    ctx.lineTo(-cw / 2, cy2 - ch * 0.4);
    ctx.lineTo(-cw / 4, cy2 - ch * 0.15);
    ctx.lineTo(0, cy2 - ch);
    ctx.lineTo(cw / 4, cy2 - ch * 0.15);
    ctx.lineTo(cw / 2, cy2 - ch * 0.4);
    ctx.lineTo(cw / 2, cy2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Jewels on crown tips
    const jewels = [[-cw / 2, cy2 - ch * 0.4], [0, cy2 - ch], [cw / 2, cy2 - ch * 0.4]];
    const jColors = ['#f44336', '#2196f3', '#4caf50'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = jColors[i];
      ctx.beginPath();
      ctx.arc(jewels[i][0], jewels[i][1], r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    // Crown sparkle
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.globalAlpha = 0.5 + Math.sin(t * 0.08) * 0.3;
    ctx.beginPath();
    ctx.arc(r * 0.1, -r * 0.85, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // --- Void (black hole swirl + pulling energy) ---
  if (sk.special === 'void') {
    // Swirling dark energy rings
    for (let i = 0; i < 4; i++) {
      const sa = t * 0.02 * (i % 2 === 0 ? 1 : -1) + i * 0.8;
      const dist = r * 0.3 + i * r * 0.15;
      ctx.save();
      ctx.globalAlpha = 0.25 - i * 0.04;
      ctx.strokeStyle = '#7c4dff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, dist, sa, sa + 2.5);
      ctx.stroke();
      ctx.restore();
    }
    // Center void glow
    ctx.save();
    ctx.globalAlpha = 0.4 + Math.sin(t * 0.05) * 0.2;
    const vGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
    vGrad.addColorStop(0, '#7c4dff');
    vGrad.addColorStop(1, 'rgba(26,0,51,0)');
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Particles being sucked in
    for (let i = 0; i < 5; i++) {
      const pa = t * 0.04 + i * Math.PI * 0.4;
      const pd = r * 0.8 - (t * 0.5 + i * 8) % (r * 0.6);
      ctx.fillStyle = 'rgba(124,77,255,' + (0.6 - pd / (r * 0.8) * 0.4) + ')';
      ctx.beginPath();
      ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, r * 0.04, 0, Math.PI * 2);
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

  // --- Smiley bowl ---
  if (sk.special === 'smiley') {
    // Eyes on the bowl body
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-hw * 0.3, hh * 0.25, hw * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hw * 0.3, hh * 0.25, hw * 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Eye shines
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-hw * 0.26, hh * 0.18, hw * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hw * 0.34, hh * 0.18, hw * 0.04, 0, Math.PI * 2);
    ctx.fill();
    // Big smile
    ctx.strokeStyle = '#111';
    ctx.lineWidth = Math.max(2, hw * 0.06);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, hh * 0.3, hw * 0.3, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Rosy cheeks
    ctx.fillStyle = 'rgba(255,80,80,0.4)';
    ctx.beginPath();
    ctx.arc(-hw * 0.5, hh * 0.4, hw * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hw * 0.5, hh * 0.4, hw * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Pixel bowl ---
  if (sk.special === 'pixel') {
    ctx.save();
    // Clip to bowl body shape
    ctx.beginPath();
    ctx.moveTo(-hw, -hh * 0.25);
    ctx.bezierCurveTo(-hw, hh * 1.1, hw, hh * 1.1, hw, -hh * 0.25);
    ctx.closePath();
    ctx.clip();
    // Chunky pixel blocks
    const pxSize = Math.max(4, hw * 0.2);
    const cols = ['#ff2222', '#aa0000', '#ff5555', '#dd1111', '#880000', '#ff7777', '#cc2222', '#ee3333'];
    for (let py = -hh; py < hh * 1.2; py += pxSize) {
      for (let px = -hw; px < hw; px += pxSize) {
        const ci = (Math.abs(Math.floor(px * 3.7 + py * 5.3)) % cols.length);
        ctx.fillStyle = cols[ci];
        ctx.fillRect(px, py, pxSize - 1, pxSize - 1);
      }
    }
    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.8;
    for (let py = -hh; py < hh * 1.2; py += pxSize) {
      ctx.beginPath();
      ctx.moveTo(-hw, py);
      ctx.lineTo(hw, py);
      ctx.stroke();
    }
    for (let px = -hw; px < hw; px += pxSize) {
      ctx.beginPath();
      ctx.moveTo(px, -hh);
      ctx.lineTo(px, hh * 1.2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Dog bowl ---
  if (sk.special === 'dog') {
    // Paw prints on the bowl
    const drawPaw = (px, py, s) => {
      // Main pad
      ctx.fillStyle = '#5a3a1a';
      ctx.beginPath();
      ctx.ellipse(px, py, s * 0.55, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      // Toe beans
      const toes = [[-0.4, -0.6], [0.4, -0.6], [-0.65, -0.15], [0.65, -0.15]];
      for (const [tx, ty] of toes) {
        ctx.beginPath();
        ctx.arc(px + tx * s, py + ty * s, s * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    drawPaw(-hw * 0.32, hh * 0.35, hw * 0.14);
    drawPaw(hw * 0.32, hh * 0.35, hw * 0.14);
    // Bone shape on rim
    ctx.fillStyle = '#f5f0e0';
    // Left knob
    ctx.beginPath();
    ctx.arc(-hw * 0.12, -hh * 0.25, hw * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Right knob
    ctx.beginPath();
    ctx.arc(hw * 0.12, -hh * 0.25, hw * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Bone middle
    ctx.fillRect(-hw * 0.1, -hh * 0.3, hw * 0.2, hh * 0.1);
  }

  // --- Demon bowl (horns + fanged smiley) ---
  if (sk.special === 'demon') {
    // Horns on the rim
    ctx.fillStyle = '#1a0000';
    // Left horn
    ctx.beginPath();
    ctx.moveTo(-hw * 0.55, -hh * 0.3);
    ctx.lineTo(-hw * 0.7, -hh * 0.9);
    ctx.lineTo(-hw * 0.3, -hh * 0.25);
    ctx.fill();
    // Right horn
    ctx.beginPath();
    ctx.moveTo(hw * 0.55, -hh * 0.3);
    ctx.lineTo(hw * 0.7, -hh * 0.9);
    ctx.lineTo(hw * 0.3, -hh * 0.25);
    ctx.fill();
    // Horn highlights
    ctx.fillStyle = '#3a0000';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.5, -hh * 0.32);
    ctx.lineTo(-hw * 0.6, -hh * 0.75);
    ctx.lineTo(-hw * 0.35, -hh * 0.28);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hw * 0.5, -hh * 0.32);
    ctx.lineTo(hw * 0.6, -hh * 0.75);
    ctx.lineTo(hw * 0.35, -hh * 0.28);
    ctx.fill();
    // Glowing red eyes
    ctx.save();
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#ff2200';
    ctx.beginPath();
    ctx.arc(-hw * 0.3, hh * 0.2, hw * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hw * 0.3, hh * 0.2, hw * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Slit pupils
    ctx.fillStyle = '#000';
    ctx.fillRect(-hw * 0.315, hh * 0.12, hw * 0.03, hh * 0.16);
    ctx.fillRect(hw * 0.285, hh * 0.12, hw * 0.03, hh * 0.16);
    // Evil smile
    ctx.strokeStyle = '#111';
    ctx.lineWidth = Math.max(1.5, hw * 0.05);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, hh * 0.3, hw * 0.3, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Fangs
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.2, hh * 0.38);
    ctx.lineTo(-hw * 0.14, hh * 0.55);
    ctx.lineTo(-hw * 0.08, hh * 0.38);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hw * 0.08, hh * 0.38);
    ctx.lineTo(hw * 0.14, hh * 0.55);
    ctx.lineTo(hw * 0.2, hh * 0.38);
    ctx.fill();
  }

  // --- Angel bowl (wings + happy face) ---
  if (sk.special === 'angel') {
    // Wings on the sides
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    // Left wing
    ctx.beginPath();
    ctx.moveTo(-hw * 0.9, hh * 0.1);
    ctx.quadraticCurveTo(-hw * 1.6, -hh * 0.5, -hw * 0.95, -hh * 0.4);
    ctx.quadraticCurveTo(-hw * 1.4, hh * 0.0, -hw * 0.9, hh * 0.1);
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(hw * 0.9, hh * 0.1);
    ctx.quadraticCurveTo(hw * 1.6, -hh * 0.5, hw * 0.95, -hh * 0.4);
    ctx.quadraticCurveTo(hw * 1.4, hh * 0.0, hw * 0.9, hh * 0.1);
    ctx.fill();
    // Wing feather lines
    ctx.strokeStyle = 'rgba(200,200,230,0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.95, hh * 0.0);
    ctx.quadraticCurveTo(-hw * 1.3, -hh * 0.3, -hw * 0.95, -hh * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hw * 0.95, hh * 0.0);
    ctx.quadraticCurveTo(hw * 1.3, -hh * 0.3, hw * 0.95, -hh * 0.35);
    ctx.stroke();
    // Halo above the bowl
    ctx.save();
    ctx.strokeStyle = 'rgba(255,215,0,0.6)';
    ctx.lineWidth = Math.max(1.5, hw * 0.06);
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.55, hw * 0.4, hh * 0.1, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // Happy closed eyes
    ctx.strokeStyle = '#555';
    ctx.lineWidth = Math.max(1.2, hw * 0.05);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-hw * 0.25, hh * 0.2, hw * 0.08, Math.PI + 0.3, -0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hw * 0.25, hh * 0.2, hw * 0.08, Math.PI + 0.3, -0.3);
    ctx.stroke();
    // Gentle smile
    ctx.strokeStyle = '#555';
    ctx.lineWidth = Math.max(1.2, hw * 0.05);
    ctx.beginPath();
    ctx.arc(0, hh * 0.3, hw * 0.22, 0.3, Math.PI - 0.3);
    ctx.stroke();
    // Rosy cheeks
    ctx.fillStyle = 'rgba(255,180,200,0.35)';
    ctx.beginPath();
    ctx.arc(-hw * 0.42, hh * 0.35, hw * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hw * 0.42, hh * 0.35, hw * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Leprechaun bowl (top hat on rim + clover) ---
  if (sk.special === 'leprechaun') {
    // Small top hat sitting on the left rim
    const hatW = hw * 0.5, hatH = hh * 0.5;
    const hatX = -hw * 0.4, hatY = -hh * 0.3;
    ctx.fillStyle = '#2e7d32';
    // Hat brim
    ctx.beginPath();
    ctx.ellipse(hatX, hatY, hatW * 0.8, hh * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hat body
    ctx.fillRect(hatX - hatW * 0.4, hatY - hatH, hatW * 0.8, hatH);
    // Hat top
    ctx.beginPath();
    ctx.ellipse(hatX, hatY - hatH, hatW * 0.4, hh * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    // Gold band
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(hatX - hatW * 0.4, hatY - hatH * 0.35, hatW * 0.8, hatH * 0.18);
    // Gold buckle
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = Math.max(1, hw * 0.04);
    ctx.strokeRect(hatX - hw * 0.06, hatY - hatH * 0.42, hw * 0.12, hatH * 0.3);

    // Clover on the right side
    ctx.fillStyle = '#1b5e20';
    const clx = hw * 0.5, cly = hh * 0.15;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
      ctx.beginPath();
      ctx.ellipse(clx + Math.cos(a) * hw * 0.06, cly - Math.sin(a) * hw * 0.06, hw * 0.05, hw * 0.035, a, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Dark bowl (black + purple shimmer) ---
  if (sk.special === 'dark') {
    // Purple glow
    ctx.save();
    ctx.globalAlpha = 0.15 + Math.sin(t * 0.04) * 0.08;
    ctx.shadowColor = '#7b1fa2';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.1, hw * 0.7, hh * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Purple sparkles inside
    for (let i = 0; i < 3; i++) {
      const sa = t * 0.025 + i * Math.PI * 0.67;
      const sx = Math.cos(sa) * hw * 0.3;
      const sy = hh * 0.1 + Math.sin(sa) * hh * 0.2;
      ctx.fillStyle = 'rgba(180,100,255,' + (0.3 + Math.sin(t * 0.04 + i) * 0.15) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, hw * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Neon bowl (glowing green outline + flicker) ---
  if (sk.special === 'neon') {
    ctx.save();
    const pulse = 0.6 + Math.sin(t * 0.06) * 0.4;
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 10 * pulse;
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = Math.max(2, hw * 0.06);
    ctx.globalAlpha = 0.7 + Math.sin(t * 0.06) * 0.3;
    // Glow outline of bowl body
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.45, hw * 0.98, hh * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Rim glow
    ctx.beginPath();
    ctx.ellipse(0, -hh * 0.05, hw * 0.98, hh * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // Flicker dots inside
    for (let i = 0; i < 4; i++) {
      const flk = (t * 0.04 + i * 1.7) % (Math.PI * 2);
      const fx = Math.cos(flk) * hw * 0.4;
      const fy = hh * 0.2 + Math.sin(flk * 1.3) * hh * 0.15;
      ctx.fillStyle = 'rgba(0,230,118,' + (0.3 + Math.sin(t * 0.08 + i) * 0.2) + ')';
      ctx.beginPath();
      ctx.arc(fx, fy, hw * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Ice bowl (frost shimmer + icicles on rim) ---
  if (sk.special === 'ice') {
    // Frost shimmer
    ctx.save();
    ctx.globalAlpha = 0.12 + Math.sin(t * 0.03) * 0.06;
    ctx.fillStyle = '#e1f5fe';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.1, hw * 0.75, hh * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Icicles hanging from rim
    for (let i = 0; i < 5; i++) {
      const ix = -hw * 0.6 + i * (hw * 0.3);
      const iy = -hh * 0.05;
      const ilen = hh * (0.15 + Math.sin(t * 0.02 + i * 1.2) * 0.04);
      ctx.fillStyle = 'rgba(179,229,252,0.8)';
      ctx.beginPath();
      ctx.moveTo(ix - hw * 0.04, iy);
      ctx.lineTo(ix + hw * 0.04, iy);
      ctx.lineTo(ix, iy + ilen);
      ctx.closePath();
      ctx.fill();
    }
    // Frost sparkles
    for (let i = 0; i < 3; i++) {
      const sa = t * 0.02 + i * 2.1;
      const fx = Math.cos(sa) * hw * 0.5;
      const fy = hh * 0.15 + Math.sin(sa * 0.7) * hh * 0.2;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.4 + Math.sin(t * 0.05 + i) * 0.3) + ')';
      ctx.beginPath();
      ctx.arc(fx, fy, hw * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Ghost bowl (semi-transparent, spooky eyes) ---
  if (sk.special === 'ghost') {
    // Ghostly shimmer
    ctx.save();
    ctx.globalAlpha = 0.08 + Math.sin(t * 0.035) * 0.05;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.1, hw * 0.6, hh * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Spooky eyes inside bowl
    const eyeY = hh * 0.15;
    const eyeOff = hw * 0.22;
    const blink = Math.sin(t * 0.03);
    const eyeH = hw * 0.09 * (blink > 0.95 ? 0.2 : 1);
    // Left eye
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.ellipse(-eyeOff, eyeY, hw * 0.08, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.ellipse(eyeOff, eyeY, hw * 0.08, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(-eyeOff, eyeY, hw * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeOff, eyeY, hw * 0.03, 0, Math.PI * 2);
    ctx.fill();
    // Mouth
    ctx.fillStyle = '#424242';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.4, hw * 0.1, hw * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Crown bowl (golden crown on rim + jewels) ---
  if (sk.special === 'crown') {
    // Crown on the rim
    const crW = hw * 0.7, crH = hh * 0.35;
    const crY = -hh * 0.15;
    ctx.fillStyle = '#ffd600';
    // Crown base
    ctx.fillRect(-crW * 0.5, crY, crW, crH * 0.4);
    // Crown points (3 triangles)
    for (let i = 0; i < 3; i++) {
      const px = -crW * 0.35 + i * crW * 0.35;
      ctx.beginPath();
      ctx.moveTo(px - crW * 0.12, crY);
      ctx.lineTo(px + crW * 0.12, crY);
      ctx.lineTo(px, crY - crH * 0.6);
      ctx.closePath();
      ctx.fill();
    }
    // Jewels
    const jewels = ['#f44336', '#2196f3', '#4caf50'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = jewels[i];
      ctx.beginPath();
      ctx.arc(-crW * 0.35 + i * crW * 0.35, crY - crH * 0.5, hw * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
    // Crown sparkle
    const spkA = t * 0.04;
    const spkX = Math.cos(spkA) * crW * 0.3;
    ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + Math.sin(t * 0.06) * 0.3) + ')';
    ctx.beginPath();
    ctx.arc(spkX, crY - crH * 0.3, hw * 0.03, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Void bowl (black hole swirl + particles) ---
  if (sk.special === 'void') {
    // Swirling dark energy inside
    for (let i = 0; i < 4; i++) {
      const va = t * 0.02 + i * Math.PI * 0.5;
      const vr = hw * (0.2 + i * 0.1);
      const vx = Math.cos(va) * vr * 0.5;
      const vy = hh * 0.15 + Math.sin(va) * hh * 0.2;
      ctx.strokeStyle = 'rgba(124,77,255,' + (0.3 + Math.sin(t * 0.03 + i) * 0.15) + ')';
      ctx.lineWidth = Math.max(1, hw * 0.03);
      ctx.beginPath();
      ctx.arc(vx, vy, vr * 0.3, va, va + Math.PI * 1.2);
      ctx.stroke();
    }
    // Center void glow
    ctx.save();
    const voidG = ctx.createRadialGradient(0, hh * 0.2, 0, 0, hh * 0.2, hw * 0.3);
    voidG.addColorStop(0, 'rgba(124,77,255,0.3)');
    voidG.addColorStop(0.5, 'rgba(74,20,140,0.15)');
    voidG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = voidG;
    ctx.beginPath();
    ctx.arc(0, hh * 0.2, hw * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Particles being pulled in
    for (let i = 0; i < 5; i++) {
      const pa = t * 0.015 + i * 1.26;
      const pd = hw * (0.5 - ((t * 0.005 + i * 0.2) % 0.4));
      const px = Math.cos(pa) * pd;
      const py = hh * 0.2 + Math.sin(pa) * pd * 0.5;
      const psz = hw * 0.02 * (1 - (pd / (hw * 0.5)));
      if (psz > 0) {
        ctx.fillStyle = 'rgba(124,77,255,' + (0.5 - pd / (hw * 0.5) * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, psz), 0, Math.PI * 2);
        ctx.fill();
      }
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
