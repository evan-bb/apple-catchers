// Shared mutable state — every module imports this one object
export const state = {
  // Canvas refs
  cvs: null,
  ctx: null,
  W: 0,
  H: 0,
  BOWL_W: 0,
  BOWL_H: 0,
  bowlX: undefined,

  // Game state
  apples: [],
  score: 0,
  coinsEarned: 0,
  frame: 0,
  animId: 0,
  gameRunning: false,
  lastTime: 0,
  speed: 0,
  nextDrop: 0,
  level: 1,
  gameMode: 'classic',
  timerMs: 0,
  dropped: 0,
  grossCaught: 0,

  // Audio
  AC: null,
  MG: null,
  musicMuted: false,
  ticker: null,
  nxt: 0,
  bi: 0,
  trk: '',

  // Other
  dangerEl: null,
  activeEffects: {},
  shopFrom: 'menu',
  toastTimer: null,
  chestInterval: null,

  // Save (defaults)
  save: {
    coins: 0,
    unlockedApples: ['classic'],
    unlockedBowls:  ['classic'],
    equippedApple:  'classic',
    equippedBowl:   'classic',
    totalCaught:    0,
    equippedMap:    'meadow',
    victoryShown:   false,
    powers:         {},
    claimedRewards: {},
  },
};
