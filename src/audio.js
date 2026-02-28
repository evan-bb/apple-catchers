import { state } from './state.js';

// ── Notes ─────────────────────────────────────
const _C3=130.81,_D3=146.83,_E3=164.81,_F3=174.61,_G3=196,_A3=220,_B3=246.94;
const _C4=261.63,_D4=293.66,_E4=329.63,_F4=349.23,_G4=392,_A4=440,_B4=493.88;
const _C5=523.25,_D5=587.33,_E5=659.25,_F5=698.46,_G5=783.99;
const _A2=110,_G2=98;

// ── MENU THEME ────────────────────────────────
const M_MEL=[
  _E5,0,0,_D5,0,0,_C5,0,0,_D5,0,0,
  _E5,0,0,_E5,0,0,_E5,0,0,0,0,0,
  _D5,0,0,_D5,0,0,_D5,0,0,0,0,0,
  _E5,0,0,_G5,0,0,_G5,0,0,0,0,0,
  _E5,0,0,_D5,0,0,_C5,0,0,_D5,0,0,
  _E5,0,0,_E5,0,0,_E5,0,0,_E5,0,0,
  _D5,0,0,_D5,0,0,_E5,0,0,_D5,0,0,
  _C5,0,0,0,0,0,0,0,0,0,0,0,
];
const M_BAS=[
  _C3,_E3,_G3,0,0,0,_C3,_E3,_G3,0,0,0,
  _A2,_C3,_E3,0,0,0,_A2,_C3,_E3,0,0,0,
  _F3,_A3,0,0,0,0,_F3,_A3,0,0,0,0,
  _G2,_B3,_D4,0,0,0,_G2,_B3,_D4,0,0,0,
  _C3,_E3,_G3,0,0,0,_C3,_E3,_G3,0,0,0,
  _A2,_C3,_E3,0,0,0,_A2,_C3,_E3,0,0,0,
  _F3,_A3,0,0,0,0,_G2,_B3,_D4,0,0,0,
  _C3,_G3,0,0,0,0,0,0,0,0,0,0,
];
const M_ARP=[
  _G4,_E4,_C4,_G4,_E4,_C4,_G4,_E4,_C4,_G4,_E4,_C4,
  _A4,_E4,_C4,_A4,_E4,_C4,_A4,_E4,_C4,_A4,_E4,_C4,
  _F4,_C4,_A3,_F4,_C4,_A3,_F4,_C4,_A3,_F4,_C4,_A3,
  _B3,_G3,_D3,_B3,_G3,_D3,_B3,_G3,_D3,_B3,_G3,_D3,
  _G4,_E4,_C4,_G4,_E4,_C4,_G4,_E4,_C4,_G4,_E4,_C4,
  _A4,_E4,_C4,_A4,_E4,_C4,_A4,_E4,_C4,_A4,_E4,_C4,
  _F4,_C4,_A3,_F4,_C4,_A3,_B3,_G3,_D3,_B3,_G3,_D3,
  _C4,_G3,_E3,_C4,_G3,_E3,_C4,_G3,_E3,_C4,_G3,0,
];
const MB = 0.17; // menu beat duration

// ── GAME THEME ────────────────────────────────
const G_MEL=[
  _C5,_C5,_G4,_G4,_A4,_A4,_G4,0,
  _F4,_F4,_E4,_E4,_D4,_D4,_C4,0,
  _G4,_G4,_F4,_F4,_E4,_E4,_D4,0,
  _G4,_G4,_F4,_F4,_E4,_E4,_D4,0,
  _C5,_C5,_G4,_G4,_A4,_A4,_G4,0,
  _F4,_F4,_E4,_E4,_D4,_D4,_C4,0,
  _E4,_F4,_E4,_D4,_C4,_D4,_E4,_C4,
  _C4,0,_C4,0,_C4,0,0,0,
];
const G_BAS=[
  _C3,0,_C3,0,_F3,0,_F3,0,
  _A3,0,_A3,0,_G3,0,_G3,0,
  _C3,0,_C3,0,_F3,0,_F3,0,
  _G3,0,_G3,0,_G3,0,_G3,0,
  _C3,0,_C3,0,_F3,0,_F3,0,
  _A3,0,_A3,0,_G3,0,_G3,0,
  _E3,0,_E3,0,_D3,0,_D3,0,
  _C3,0,_C3,0,_C3,0,_C3,0,
];
const GB = 0.13; // game beat duration

// ── Low-level note player ─────────────────────
function note(f, t, dur, type, vol) {
  if (!state.AC || !f) return;
  const o = state.AC.createOscillator(), g = state.AC.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.88);
  o.connect(g); g.connect(state.MG);
  o.start(t); o.stop(t + dur);
}
function noise(t, dur, cutoff, vol) {
  if (!state.AC) return;
  const len = state.AC.sampleRate * dur;
  const buf = state.AC.createBuffer(1, len, state.AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1)*(1-i/len);
  const s = state.AC.createBufferSource(), g = state.AC.createGain(), f = state.AC.createBiquadFilter();
  f.type='highpass'; f.frequency.value = cutoff;
  s.buffer = buf;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(state.MG);
  s.start(t); s.stop(t + dur + 0.01);
}
function kick(t, startF, vol) {
  if (!state.AC) return;
  const o = state.AC.createOscillator(), g = state.AC.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(startF, t);
  o.frequency.exponentialRampToValueAtTime(30, t + 0.15);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  o.connect(g); g.connect(state.MG);
  o.start(t); o.stop(t + 0.22);
}

// ── Menu scheduler ────────────────────────────
function tickMenu() {
  if (!state.AC || state.trk !== 'menu') return;
  while (state.nxt < state.AC.currentTime + 0.25) {
    const i = state.bi % M_MEL.length;
    if (M_MEL[i]) note(M_MEL[i], state.nxt, MB*2.5, 'sine',     0.17);
    if (M_BAS[i]) note(M_BAS[i], state.nxt, MB*2.2, 'triangle', 0.13);
    if (M_ARP[i]) note(M_ARP[i], state.nxt, MB*0.75,'sine',     0.065);
    if (i % 3 === 0) kick(state.nxt, 90, 0.28);
    else { const o=state.AC.createOscillator(),g=state.AC.createGain();
      o.type='triangle'; o.frequency.value=3000+Math.random()*500;
      g.gain.setValueAtTime(0.055,state.nxt); g.gain.exponentialRampToValueAtTime(0.0001,state.nxt+0.1);
      o.connect(g);g.connect(state.MG);o.start(state.nxt);o.stop(state.nxt+0.11); }
    state.nxt += MB; state.bi++;
  }
}

// ── Game scheduler ────────────────────────────
function tickGame() {
  if (!state.AC || state.trk !== 'game') return;
  while (state.nxt < state.AC.currentTime + 0.22) {
    const i = state.bi % G_MEL.length;
    if (G_MEL[i]) note(G_MEL[i], state.nxt, GB*1.35, 'square',   0.19);
    if (G_BAS[i]) note(G_BAS[i], state.nxt, GB*2.7,  'triangle', 0.24);
    noise(state.nxt, 0.05, 7000, i%4===0 ? 0.15 : 0.065);
    if (i%8===0||i%8===4) kick(state.nxt, 160, 0.6);
    if (i%8===2||i%8===6) noise(state.nxt, 0.1, 1800, 0.24);
    state.nxt += GB; state.bi++;
  }
}

// ── Public API ────────────────────────────────
export function playTrack(name) {
  if (!state.AC || state.musicMuted) return;
  if (state.trk === name) return;
  clearInterval(state.ticker);
  state.trk = name; state.bi = 0;
  state.nxt = state.AC.currentTime + 0.05;
  state.MG.gain.setTargetAtTime(name==='menu'?0.3:0.38, state.AC.currentTime, 0.2);
  state.ticker = setInterval(name==='menu' ? tickMenu : tickGame, 55);
}
export function haltMusic() {
  clearInterval(state.ticker); state.trk = ''; state.ticker = null;
}
export function sfxCatch() {
  if (!state.AC||state.musicMuted) return; const t=state.AC.currentTime;
  note(_E5,t,0.06,'square',0.26); note(_G5,t+0.06,0.06,'square',0.26); note(_C5,t+0.12,0.1,'square',0.21);
}
export function sfxMiss() {
  if (!state.AC||state.musicMuted) return; const t=state.AC.currentTime;
  note(_A4,t,0.08,'sawtooth',0.26); note(_E4,t+0.08,0.08,'sawtooth',0.21); note(_C4,t+0.16,0.13,'sawtooth',0.18);
}
export function sfxLevelUp() {
  if (!state.AC||state.musicMuted) return; const t=state.AC.currentTime;
  [_C5,_E5,_G5,_C5*2].forEach((f,i)=>note(f,t+i*0.09,0.11,'square',0.24));
}

export function initAudio() {
  state.AC = new (window.AudioContext || window.webkitAudioContext)();
  state.MG = state.AC.createGain();
  state.MG.gain.value = 0.38;
  state.MG.connect(state.AC.destination);
}

export function toggleMute() {
  if (!state.AC) return;
  state.musicMuted = !state.musicMuted;
  const btn = document.getElementById('btnMusic');
  if (state.musicMuted) {
    btn.textContent='🔇'; btn.classList.add('muted');
    state.MG.gain.setTargetAtTime(0, state.AC.currentTime, 0.08);
    haltMusic();
  } else {
    btn.textContent='🎵'; btn.classList.remove('muted');
    state.MG.gain.setTargetAtTime(0.38, state.AC.currentTime, 0.08);
    state.trk = ''; // force restart
    playTrack(state.gameRunning ? 'game' : 'menu');
  }
}
