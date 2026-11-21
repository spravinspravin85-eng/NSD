# NSD — NITRO STORM DRIFT (V12)

A 3D open-world arcade and drift racing game built with Three.js (`r160`), JavaScript ES Modules, HTML5, CSS3, and Web Audio API.

## Implemented Features
- **200 Real-World Vehicles:** 20 distinct cars across each of the 10 classes (Supercars, Hypercars, Sports, Muscle, Drift, Luxury Sedans, SUVs, Off-Road, Electric, GT Race), with 6 starter cars unlocked immediately.
- **Cyberpunk 3D Garage Showroom:** Concentric cyan/pink/blue neon turntable, X-LED headlights, customizable body paint, neon underglow, hood vents, rear spoilers, deep-dish rims, and 5-level performance upgrades.
- **Open-World Wet Neon City:** UnrealBloom post-processing, wet reflective asphalt, lit skyscraper grids, overhead bridges, holographic corner chevron walls, AI racing opponents, and civilian traffic.
- **12 Racing Modes & Career Progression:** Circuit, Free Roam, City Sprint, Coastal Highway, Time Trial, Mountain Touge Drift, Checkpoint Rush, Knockout, Drag Strip, Speed Trap, Championship Cup, and Special Events with `localStorage` auto-save.
- **Cross-Platform Controls:** Windows Keyboard (`WASD` / Arrows, `Space` Drift, `Shift` Nitro, `Q/E` Gears, `C` Camera, `L` Lights, `R` Reset), X-Input Gamepads, and Android landscape multi-touch controls.

## Installation & Publishing on GitHub Pages
1. Create a folder named `NSD_NITRO_STORM_DRIFT` with `index.html`, `style.css`, `manifest.json`, `README.md`, and the `js/` subfolder containing all 12 `.js` modules.
2. Upload the files to your GitHub repository so `index.html` is at the root level.
3. Open **Settings → Pages** in your repository, set Branch to `main` (`/root`), and click **Save** to publish your live game link.

## Verification & Notes
- **CDN Requirement:** Loads `three@0.160.0` via `unpkg.com` import map; requires an internet connection on initial load.
- **Syntax & Module Check:** All 12 ES module imports/exports in `js/` are strictly verified and matched.
- **Multiplayer Status:** Excluded by request; runs 100% locally in the browser with intelligent AI opponents and civilian traffic.

**Project Structure :-**

NSD_NITRO_STORM_DRIFT/
├── index.html
├── style.css
├── manifest.json
├── README.md
└── js/
    ├── main.js
    ├── data.js
    ├── world.js
    ├── vehicle.js
    ├── physics.js
    ├── garage.js
    ├── traffic.js
    ├── ai.js
    ├── race.js
    ├── career.js
    ├── audio.js
    ├── effects.js
    ├── camera.js
    ├── controls.js
    ├── ui.js
    └── save.js
