import { state } from './state.js';

export function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function starShape(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const b = a + Math.PI / 4;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.lineTo(Math.cos(b) * r * 0.35, Math.sin(b) * r * 0.35);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function cloud(x, y, r, col) {
  const { ctx } = state;
  ctx.save(); ctx.fillStyle = col || 'rgba(255,255,255,0.82)';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.84, y + r * 0.2,  r * 0.7,  0, Math.PI * 2);
  ctx.arc(x - r * 0.7,  y + r * 0.28, r * 0.56, 0, Math.PI * 2);
  ctx.arc(x + r * 0.32, y - r * 0.28, r * 0.52, 0, Math.PI * 2);
  ctx.fill(); ctx.restore();
}

export function el(tag, cls, styles) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (styles) Object.assign(e.style, styles);
  return e;
}
