# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPPRTANT CONTEXT
This game has been developed by Evan, Who is a 10-year-old with no coding experience? As the application gets more complex, keep things and explanations simple for him. Summarise changes in a way that he can understand, and if you are starting any dev servers or things like that, do it automatically and just give him the URL that he needs to test. 

## Project Overview

Apple Catchers is a single-file HTML5 canvas game (~2400 lines). The entire application — HTML, CSS, and JavaScript — lives in `Apple-Catchers.html`. There is no build system, no package manager, and no tests. To run/test changes, open the file in a browser.

## Architecture

The game is structured as sections within one file, in order:

1. **CSS** (lines 8–201) — All styles including screens (menu, game, shop, game over, timer end, victory, credits), HUD, shop UI (chests, skins, maps, power-ups), and animations.
2. **HTML** (lines 203–446) — Screen DOM elements: `sGame`, `sMenu`, `sGameOver`, `sShop`, `sTimerEnd`, `sVictory`, `sCredits`, plus overlays (`tapOverlay`, `chestOpen`, `updateOverlay`).
3. **JavaScript** (lines 447–2384) — Game logic, broken into these conceptual sections:

### Data Constants
- `APPLE_SKINS` / `BOWL_SKINS` — cosmetic skin definitions with color palettes and special effects (`stars`, `rainbow`, `sparkle`, `glow`, `grain`)
- `CHESTS` — loot boxes with cost and possible skin rewards
- `POWERUPS` — consumable abilities (slow, double coins, destruction, teleport, map skip)
- `MAPS` — 14 themed backgrounds, each unlocked at a `totalCaught` threshold
- `MAP_REWARDS` — skins/powers auto-claimed on map unlock

### Save System
- Uses `localStorage` key `applecatch_v6`
- `loadSave()` / `writeSave()` — simple JSON serialize/deserialize
- Save tracks: coins, unlocked/equipped skins, totalCaught, equipped map, powers, claimed rewards, victoryShown

### Rendering (Canvas 2D)
- `drawApple()` — renders apple with skin-specific effects (gradients, stars, rainbow hue shift, sparkle, glow)
- `drawBowl()` — renders bowl with skin-specific effects
- `drawChest()` — renders chest preview in shop
- `drawMap()` — dispatcher that calls per-map draw function (e.g., `drawMeadow()`, `drawNight()`, `drawSpace()`, etc.)
- Each map function paints a full-canvas background with animated elements

### Game Loop
- `startGame()` — initializes state, supports two modes: `'classic'` (miss = game over) and `'timer'` (2-minute countdown)
- `loop(ts)` → `update(dt)` → `draw()` — standard requestAnimationFrame loop with delta-time normalization
- `update()` handles: apple spawning, falling (with slow power-up multiplier), bowl collision detection, scoring, level progression (classic mode), timer countdown (timer mode)
- Bowl movement: mouse/touch input mapped to canvas coordinates via `moveBowl()`

### Shop System
- `renderShop()` dynamically builds DOM for chest grid, skin grids (apple + bowl), map grid, power-up grid
- `buyChest()` / `buyPowerChest()` — purchase and random reward selection with duplicate handling (refunds coins)
- `openChestAnim()` — animated chest opening overlay with canvas rendering
- Skins are selected by tapping unlocked skin cards; equip state saved immediately

### Audio (Web Audio API)
- Procedural music via oscillator scheduling — no audio files
- Two tracks: `tickMenu()` and `tickGame()` with note sequences defined as frequency arrays
- Sound effects: `sfxCatch()`, `sfxMiss()`, `sfxLevelUp()` — short oscillator bursts
- `AudioContext` created on first user tap (`startEverything()`) to satisfy browser autoplay policies

### Key Global Variables
- `W`, `H` — canvas dimensions (updated on resize)
- `bowlX`, `BOWL_W`, `BOWL_H` — bowl position and size
- `apples[]` — array of falling apple objects `{x, y, r, vy, skin, angle, rotSpeed, t}`
- `speed`, `level`, `score`, `coinsEarned`, `dropped` — per-session game state
- `gameMode` — `'classic'` or `'timer'`
- `activeEffects` — currently active power-up timers
- `frame` — frame counter used for animation timing
- `AC`, `MG` — AudioContext and master gain node

## Key Patterns

- **Screen management**: `showScreen(id)` toggles visibility via `.off` class on `.screen` divs
- **Floating text**: `spawnFloaty(text, x, y)` creates animated DOM elements for coin/score popups
- **Victory condition**: All maps unlocked AND totalCaught >= 500 triggers victory screen + credits roll
- **Power-ups**: Stored as inventory counts in `save.powers`, equipped to 3 slots, activated via `usePower(slot)` with timed effects tracked in `activeEffects`
