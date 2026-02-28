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

function drawMeadow() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#87ceeb'); sky.addColorStop(0.58,'#b8e4ff');
  sky.addColorStop(0.82,'#d4f0c0'); sky.addColorStop(1,'#7ec850');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  // Sun
  ctx.save(); ctx.shadowColor='#ffe082'; ctx.shadowBlur=28;
  ctx.fillStyle='#fff176'; ctx.beginPath();
  ctx.arc(W*0.85,H*0.09,Math.min(W,H)*0.065,0,Math.PI*2); ctx.fill(); ctx.restore();
  // Clouds
  cloud(W*0.13+Math.sin(frame*0.003)*9,H*0.1,W*0.12,'rgba(255,255,255,0.82)');
  cloud(W*0.63+Math.cos(frame*0.002)*7,H*0.07,W*0.09,'rgba(255,255,255,0.82)');
  cloud(W*0.41+Math.sin(frame*0.0025)*6,H*0.16,W*0.075,'rgba(255,255,255,0.82)');
  // Ground
  ctx.fillStyle='#5cb85c'; ctx.fillRect(0,H-16,W,16);
  ctx.fillStyle='#4caf50';
  for(let i=0;i<9;i++){const gx=(W/9)*i+W/18;ctx.beginPath();ctx.ellipse(gx,H-16,W*0.022,8,0,0,Math.PI*2);ctx.fill();}
}

function drawNight() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#0a0a2e'); sky.addColorStop(0.5,'#0d1b4e');
  sky.addColorStop(0.85,'#1a2a1a'); sky.addColorStop(1,'#2d4a2d');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  // Stars
  ctx.fillStyle='#fff';
  for(let i=0;i<60;i++){
    const sx=(Math.sin(i*137.5)*0.5+0.5)*W;
    const sy=(Math.sin(i*97.3)*0.5+0.5)*H*0.65;
    const ss=0.5+Math.sin(frame*0.04+i)*0.5;
    ctx.globalAlpha=0.4+Math.sin(frame*0.03+i*0.7)*0.4;
    ctx.beginPath(); ctx.arc(sx,sy,ss,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
  // Moon
  ctx.save(); ctx.shadowColor='#fffde7'; ctx.shadowBlur=30;
  ctx.fillStyle='#fff9c4'; ctx.beginPath();
  ctx.arc(W*0.82,H*0.1,Math.min(W,H)*0.06,0,Math.PI*2); ctx.fill();
  // Moon shadow for crescent
  ctx.fillStyle='#0a0a2e'; ctx.beginPath();
  ctx.arc(W*0.82+Math.min(W,H)*0.025,H*0.1,Math.min(W,H)*0.052,0,Math.PI*2); ctx.fill();
  ctx.restore();
  // Night clouds (dark)
  cloud(W*0.2+Math.sin(frame*0.002)*8,H*0.12,W*0.1,'rgba(20,20,60,0.7)');
  cloud(W*0.7+Math.cos(frame*0.0015)*6,H*0.08,W*0.08,'rgba(20,20,60,0.7)');
  // Ground
  ctx.fillStyle='#1b3a1b'; ctx.fillRect(0,H-16,W,16);
  ctx.fillStyle='#2d5a2d';
  for(let i=0;i<9;i++){const gx=(W/9)*i+W/18;ctx.beginPath();ctx.ellipse(gx,H-16,W*0.022,8,0,0,Math.PI*2);ctx.fill();}
}

function drawWinter() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#b3d9f5'); sky.addColorStop(0.6,'#ddeeff');
  sky.addColorStop(0.85,'#eaf5ff'); sky.addColorStop(1,'#f0f8ff');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  // Snowflakes (static based on index, drift with frame)
  ctx.fillStyle='rgba(255,255,255,0.85)';
  for(let i=0;i<40;i++){
    const sx=((Math.sin(i*173.1)*0.5+0.5)*W + frame*0.3) % W;
    const sy=((Math.sin(i*89.7)*0.5+0.5)*H*0.85 + frame*0.4*(0.5+i%3*0.3)) % (H*0.85);
    const ss=1+Math.sin(i*2.3)*0.8;
    ctx.beginPath(); ctx.arc(sx,sy,ss,0,Math.PI*2); ctx.fill();
  }
  // Pale sun
  ctx.save(); ctx.shadowColor='#fff9c4'; ctx.shadowBlur=20;
  ctx.fillStyle='#fffde7'; ctx.beginPath();
  ctx.arc(W*0.8,H*0.1,Math.min(W,H)*0.055,0,Math.PI*2); ctx.fill(); ctx.restore();
  // Snow clouds
  cloud(W*0.15+Math.sin(frame*0.002)*7,H*0.09,W*0.11,'rgba(220,235,255,0.9)');
  cloud(W*0.65+Math.cos(frame*0.0018)*5,H*0.06,W*0.09,'rgba(220,235,255,0.9)');
  // Snowy ground
  ctx.fillStyle='#e8f4fd'; ctx.fillRect(0,H-16,W,16);
  // Snow bumps
  ctx.fillStyle='#f0f8ff';
  for(let i=0;i<12;i++){const gx=(W/12)*i+W/24;ctx.beginPath();ctx.ellipse(gx,H-16,W*0.032,10,0,0,Math.PI*2);ctx.fill();}
}

function drawSpace() {
  const { ctx, W, H, frame } = state;
  // Deep space background
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#000010'); sky.addColorStop(0.7,'#050520');
  sky.addColorStop(1,'#0a0520');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  // Star field
  for(let i=0;i<80;i++){
    const sx=(Math.sin(i*251.3)*0.5+0.5)*W;
    const sy=(Math.sin(i*173.7)*0.5+0.5)*H;
    ctx.globalAlpha=0.3+Math.sin(frame*0.05+i)*0.4;
    const hue=(i*37)%360;
    ctx.fillStyle=`hsl(${hue},80%,90%)`;
    ctx.beginPath(); ctx.arc(sx,sy,0.6+Math.sin(i)*0.4,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
  // Planets
  ctx.save(); ctx.shadowColor='#ff6b6b'; ctx.shadowBlur=20;
  ctx.fillStyle='#e57373'; ctx.beginPath();
  ctx.arc(W*0.15,H*0.12,Math.min(W,H)*0.045,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(W*0.15,H*0.12,Math.min(W,H)*0.07,Math.min(W,H)*0.012,0.3,0,Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.shadowColor='#90caf9'; ctx.shadowBlur=15;
  ctx.fillStyle='#64b5f6'; ctx.beginPath();
  ctx.arc(W*0.78,H*0.08,Math.min(W,H)*0.028,0,Math.PI*2); ctx.fill(); ctx.restore();
  // Nebula wisp
  const neb=ctx.createRadialGradient(W*0.5,H*0.35,0,W*0.5,H*0.35,W*0.28);
  neb.addColorStop(0,'rgba(120,60,200,0.08)'); neb.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=neb; ctx.fillRect(0,0,W,H);
  // Space ground (asteroid surface)
  ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,H-16,W,16);
  ctx.fillStyle='#252540';
  for(let i=0;i<11;i++){const gx=(W/11)*i+W/22;ctx.beginPath();ctx.ellipse(gx,H-16,W*0.028,7,0,0,Math.PI*2);ctx.fill();}
}

function drawUnderwater() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#003366'); sky.addColorStop(0.4,'#004d99');
  sky.addColorStop(0.8,'#006622'); sky.addColorStop(1,'#004d00');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  // Light rays from above
  ctx.save();
  for(let i=0;i<6;i++){
    const rx=W*(0.1+i*0.16)+Math.sin(frame*0.008+i)*15;
    const grad=ctx.createLinearGradient(rx,0,rx+30,H*0.7);
    grad.addColorStop(0,'rgba(100,200,255,0.12)'); grad.addColorStop(1,'rgba(100,200,255,0)');
    ctx.fillStyle=grad;
    ctx.beginPath(); ctx.moveTo(rx,0); ctx.lineTo(rx+40,H*0.7); ctx.lineTo(rx-10,H*0.7); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  // Bubbles
  for(let i=0;i<12;i++){
    const bx=(Math.sin(i*173)*0.5+0.5)*W;
    const by=((frame*0.5*(0.5+i%3*0.4)+i*120)%H);
    ctx.save(); ctx.globalAlpha=0.3;
    ctx.strokeStyle='#a0d8ef'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(bx,by,3+i%4,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  // Floating clouds = jellyfish/seaweed blobs
  cloud(W*0.2+Math.sin(frame*0.004)*10,H*0.15,W*0.09,'rgba(100,180,255,0.15)');
  cloud(W*0.75+Math.cos(frame*0.003)*8,H*0.1,W*0.07,'rgba(100,180,255,0.15)');
  // Sandy ground
  ctx.fillStyle='#c8a96e'; ctx.fillRect(0,H-16,W,16);
  ctx.fillStyle='#d4b483';
  for(let i=0;i<10;i++){const gx=(W/10)*i+W/20;ctx.beginPath();ctx.ellipse(gx,H-16,W*0.026,9,0,0,Math.PI*2);ctx.fill();}
  // Seaweed
  ctx.strokeStyle='#2d8a4e'; ctx.lineWidth=3;
  for(let i=0;i<5;i++){
    const sx=W*(0.1+i*0.2);
    const sh=40+i%3*20;
    ctx.beginPath(); ctx.moveTo(sx,H-16);
    ctx.bezierCurveTo(sx+Math.sin(frame*0.04+i)*12,H-sh/2,sx-Math.sin(frame*0.04+i)*12,H-sh*0.8,sx+Math.sin(frame*0.06+i)*8,H-sh-5);
    ctx.stroke();
  }
}

function drawVolcano() {
  const { ctx, W, H, frame } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#8b0000'); sky.addColorStop(0.7,'#ff4500');
  sky.addColorStop(1,'#ff6347');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,100,0,0.3)'; ctx.fillRect(0,H-60,W,60);
  for(let i=0;i<8;i++){
    const ex=(Math.sin(i*123)*0.5+0.5)*W;
    const ey=H*0.4+(Math.sin(i*89)*0.5+0.5)*H*0.2;
    const s=3+Math.sin(frame*0.05+i)*2;
    ctx.fillStyle='#ff6600'; ctx.beginPath(); ctx.arc(ex,ey,s,0,Math.PI*2); ctx.fill();
  }
}

function drawDesert() {
  const { ctx, W, H } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#4682b4'); sky.addColorStop(0.6,'#ff8c42');
  sky.addColorStop(1,'#ffa500');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700'; ctx.beginPath(); ctx.arc(W*0.85,H*0.2,40,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#c19a6b'; ctx.fillRect(0,H-50,W,50);
  for(let i=0;i<5;i++){
    const cx=(W/6)*i+W/12;
    ctx.fillStyle='#2d5016'; ctx.fillRect(cx-2,H-65,4,15);
  }
}

function drawAurora() {
  const { ctx, W, H } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#000a12'); sky.addColorStop(0.6,'#001020');
  sky.addColorStop(1,'#0d1f0d');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  const auroraColors=['0,255,120','0,200,255','160,0,255','0,255,180'];
  for(let b=0;b<4;b++){
    const by=H*(0.1+b*0.12);
    const bw=H*0.08;
    const grad=ctx.createLinearGradient(0,by-bw,0,by+bw);
    grad.addColorStop(0,'transparent');
    grad.addColorStop(0.5,'rgba('+auroraColors[b%4]+','+0.15+')');
    grad.addColorStop(1,'transparent');
    ctx.fillStyle=grad;
    ctx.fillRect(0,by-bw,W,bw*2);
  }
  ctx.fillStyle='#d0e8f0'; ctx.fillRect(0,H-16,W,16);
}

function drawCandy() {
  const { ctx, W, H } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#ffb3d9'); sky.addColorStop(0.4,'#ffd6ec');
  sky.addColorStop(0.7,'#b3e0ff'); sky.addColorStop(1,'#e0b3ff');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  for(let i=0;i<4;i++){
    const cx=(W/5)*i+W/10;
    const cy=H*0.2+i%2*30;
    ctx.fillStyle=['#ffb3d9','#b3e0ff','#e0b3ff'][i%3];
    ctx.beginPath(); ctx.ellipse(cx,cy,25,15,0,0,Math.PI*2); ctx.fill();
  }
  ctx.fillStyle='#ffccee'; ctx.fillRect(0,H-30,W,30);
}

function drawGolden() {
  const { ctx, W, H } = state;
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#4a148c'); sky.addColorStop(0.5,'#d84315');
  sky.addColorStop(0.8,'#ff6f00'); sky.addColorStop(1,'#ffd600');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd600'; ctx.beginPath(); ctx.arc(W*0.5,H*0.35,50,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#8b4513'; ctx.fillRect(0,H-40,W,40);
}

function drawMountains() {
  const { ctx, W, H } = state;
  // Sky gradient - morning sky
  var sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#87ceeb'); sky.addColorStop(0.6,'#b0d4f1'); sky.addColorStop(1,'#d4e8f7');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Sun
  ctx.fillStyle='#ffd700'; ctx.beginPath(); ctx.arc(W*0.8,H*0.25,35,0,Math.PI*2); ctx.fill();

  // Mountains (3 layers)
  ctx.fillStyle='#4a5f7a'; ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(0,H*0.6); ctx.lineTo(W*0.3,H*0.4); ctx.lineTo(W*0.6,H*0.5); ctx.lineTo(W,H*0.55); ctx.lineTo(W,H); ctx.fill();
  ctx.fillStyle='#5f7a8f'; ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(0,H*0.7); ctx.lineTo(W*0.4,H*0.5); ctx.lineTo(W*0.7,H*0.6); ctx.lineTo(W,H*0.65); ctx.lineTo(W,H); ctx.fill();
  ctx.fillStyle='#7a8f9f'; ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(0,H*0.8); ctx.lineTo(W*0.5,H*0.65); ctx.lineTo(W,H*0.75); ctx.lineTo(W,H); ctx.fill();

  // Snow caps
  ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.moveTo(W*0.3-15,H*0.4); ctx.lineTo(W*0.3,H*0.37); ctx.lineTo(W*0.3+15,H*0.4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W*0.4-12,H*0.5); ctx.lineTo(W*0.4,H*0.48); ctx.lineTo(W*0.4+12,H*0.5); ctx.fill();

  // Ground
  ctx.fillStyle='#8fbc8f'; ctx.fillRect(0,H-25,W,25);
}

function drawCastle() {
  const { ctx, W, H } = state;
  // Sky - royal purple dusk
  var sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#2c0735'); sky.addColorStop(0.5,'#5b1865'); sky.addColorStop(1,'#8b3a8b');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Stars
  for(var i=0;i<25;i++){
    var sx=(Math.sin(i*137)*0.5+0.5)*W;
    var sy=(Math.sin(i*91)*0.5+0.5)*H*0.4;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(sx,sy,1,0,Math.PI*2); ctx.fill();
  }

  // Castle silhouette
  ctx.fillStyle='#1a0d1f';
  // Main towers
  ctx.fillRect(W*0.25,H*0.5,W*0.15,H*0.5);
  ctx.fillRect(W*0.6,H*0.45,W*0.15,H*0.55);
  // Battlements
  for(var i=0;i<4;i++) ctx.fillRect(W*0.25+i*12,H*0.5-8,8,8);
  for(var i=0;i<4;i++) ctx.fillRect(W*0.6+i*12,H*0.45-8,8,8);
  // Center structure
  ctx.fillRect(W*0.42,H*0.6,W*0.16,H*0.4);
  // Pointed roofs
  ctx.beginPath(); ctx.moveTo(W*0.325-8,H*0.5); ctx.lineTo(W*0.325,H*0.42); ctx.lineTo(W*0.325+8,H*0.5); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W*0.675-8,H*0.45); ctx.lineTo(W*0.675,H*0.37); ctx.lineTo(W*0.675+8,H*0.45); ctx.fill();

  // Ground
  ctx.fillStyle='#2d5016'; ctx.fillRect(0,H-20,W,20);
}

function drawHaunted() {
  const { ctx, W, H } = state;
  // Dark spooky sky
  var sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#0f0f23'); sky.addColorStop(0.7,'#1a1a3e'); sky.addColorStop(1,'#2d2d5a');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Full moon
  ctx.fillStyle='#f0e68c'; ctx.globalAlpha=0.9; ctx.beginPath(); ctx.arc(W*0.75,H*0.2,45,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;

  // Creepy clouds
  ctx.fillStyle='rgba(100,100,120,0.3)';
  ctx.beginPath(); ctx.ellipse(W*0.3,H*0.15,60,20,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(W*0.6,H*0.25,50,18,0,0,Math.PI*2); ctx.fill();

  // Dead trees
  ctx.strokeStyle='#2d2d2d'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(W*0.15,H-15); ctx.lineTo(W*0.15,H*0.55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.15,H*0.65); ctx.lineTo(W*0.12,H*0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.15,H*0.7); ctx.lineTo(W*0.18,H*0.65); ctx.stroke();

  ctx.beginPath(); ctx.moveTo(W*0.85,H-15); ctx.lineTo(W*0.85,H*0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.85,H*0.7); ctx.lineTo(W*0.82,H*0.65); ctx.stroke();

  // Haunted house silhouette
  ctx.fillStyle='#1a1a1a';
  ctx.fillRect(W*0.4,H*0.55,W*0.2,H*0.35);
  ctx.fillRect(W*0.48,H*0.48,W*0.12,H*0.1); // Upper floor
  // Roof
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.55); ctx.lineTo(W*0.5,H*0.45); ctx.lineTo(W*0.62,H*0.55); ctx.fill();
  // Windows (yellow glow)
  ctx.fillStyle='#ffff99';
  ctx.fillRect(W*0.44,H*0.65,8,10);
  ctx.fillRect(W*0.54,H*0.65,8,10);
  ctx.fillRect(W*0.51,H*0.52,6,8);

  // Ground
  ctx.fillStyle='#1f1f3a'; ctx.fillRect(0,H-18,W,18);
  // Fog
  ctx.fillStyle='rgba(200,200,220,0.15)'; ctx.fillRect(0,H-35,W,15);
}

function drawShipwreck() {
  const { ctx, W, H, frame } = state;
  // Ocean sky - stormy
  var sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#2c3e50'); sky.addColorStop(0.5,'#34495e'); sky.addColorStop(1,'#4a5f7a');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Rain
  ctx.strokeStyle='rgba(200,200,255,0.3)'; ctx.lineWidth=1;
  for(var i=0;i<30;i++){
    var rx=(Math.sin(i*71+frame*0.1)*0.5+0.5)*W;
    var ry=(Math.sin(i*43)*0.5+0.5)*H*0.6;
    ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+2,ry+12); ctx.stroke();
  }

  // Ocean waves
  ctx.fillStyle='#1e3a5f'; ctx.fillRect(0,H*0.65,W,H*0.35);
  ctx.fillStyle='#2c5f8d';
  for(var i=0;i<8;i++){
    var wx=i*W/7;
    var wy=H*0.65+Math.sin(frame*0.03+i)*8;
    ctx.beginPath(); ctx.ellipse(wx,wy,W*0.15,12,0,0,Math.PI); ctx.fill();
  }

  // Shipwreck
  ctx.fillStyle='#654321';
  // Hull
  ctx.beginPath(); ctx.moveTo(W*0.35,H*0.7); ctx.lineTo(W*0.3,H*0.82); ctx.lineTo(W*0.7,H*0.82); ctx.lineTo(W*0.65,H*0.7); ctx.fill();
  // Broken mast
  ctx.fillRect(W*0.48,H*0.5,4,H*0.2);
  ctx.fillRect(W*0.6,H*0.62,3,H*0.15); // Tilted mast
  // Torn sail
  ctx.fillStyle='rgba(200,180,160,0.6)';
  ctx.beginPath(); ctx.moveTo(W*0.5,H*0.52); ctx.lineTo(W*0.5,H*0.62); ctx.lineTo(W*0.56,H*0.6); ctx.fill();

  // Water surface
  ctx.fillStyle='#4a7ba7'; ctx.globalAlpha=0.5; ctx.fillRect(0,H*0.82,W,5); ctx.globalAlpha=1;

  // Sand/seabed
  ctx.fillStyle='#c2b280'; ctx.fillRect(0,H-12,W,12);
}
