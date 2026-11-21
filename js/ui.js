import { VEHICLES, PAINT_COLORS, NEON_COLORS, UPGRADE_TYPES, DEFAULT_MISSIONS } from './data.js';
import { GarageManager } from './garage.js';
import { CareerManager } from './career.js';

export class UIController {
  constructor(saveMgr, callbacks) {
    this.saveMgr = saveMgr;
    this.garageMgr = new GarageManager(saveMgr);
    this.careerMgr = new CareerManager(saveMgr);
    this.cb = callbacks;
    this.previewCarId = saveMgr.data.selectedCarId;

    this.tachoCtx = document.getElementById('tacho-canvas').getContext('2d');
    this.mapCtx = document.getElementById('minimap-canvas').getContext('2d');

    this.bindTabs();
    this.bindControls();
    this.renderAll();
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabName}`));
  }

  bindTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('.part-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.part-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const q = btn.dataset.quick;
        if (q === 'cars') this.switchTab('cars');
        else this.switchTab('customize');
      });
    });
  }

  bindControls() {
    document.getElementById('car-category-filter').addEventListener('change', () => this.renderCarList());

    document.getElementById('custom-hood').addEventListener('change', e => {
      const cfg = this.saveMgr.getCarConfig(this.previewCarId, VEHICLES[this.previewCarId]);
      cfg.hood = Number(e.target.value);
      this.saveMgr.save();
      this.cb.onPreviewCar(this.previewCarId);
    });

    document.getElementById('custom-spoiler').addEventListener('change', e => {
      const cfg = this.saveMgr.getCarConfig(this.previewCarId, VEHICLES[this.previewCarId]);
      cfg.spoiler = Number(e.target.value);
      this.saveMgr.save();
      this.cb.onPreviewCar(this.previewCarId);
    });

    document.getElementById('custom-rims').addEventListener('change', e => {
      const cfg = this.saveMgr.getCarConfig(this.previewCarId, VEHICLES[this.previewCarId]);
      cfg.rims = Number(e.target.value);
      this.saveMgr.save();
      this.cb.onPreviewCar(this.previewCarId);
    });

    document.getElementById('btn-buy-car').addEventListener('click', () => {
      if (this.garageMgr.purchaseVehicle(this.previewCarId)) {
        this.renderAll();
        this.cb.onPreviewCar(this.previewCarId);
      }
    });

    document.getElementById('btn-start-race').addEventListener('click', () => {
      const mode = document.getElementById('select-race-mode').value;
      const diff = Number(document.getElementById('select-difficulty').value);
      const weather = document.getElementById('select-weather').value;
      this.cb.onStartRace(mode, diff, weather);
    });

    document.getElementById('select-weather').addEventListener('change', e => this.cb.onWeatherChange(e.target.value));
    document.getElementById('select-graphics').addEventListener('change', e => this.cb.onGraphicsChange(e.target.value));
    document.getElementById('btn-reset-save').addEventListener('click', () => {
      this.saveMgr.reset();
      this.previewCarId = 0;
      this.renderAll();
      this.cb.onPreviewCar(0);
    });
  }

  renderAll() {
    this.updateHeader();
    this.renderCarList();
    this.renderSwatches();
    this.renderUpgrades();
    this.renderCareer();
    this.updateSpecCard();
  }

  updateHeader() {
    document.getElementById('ui-level').textContent = this.saveMgr.data.level;
    document.getElementById('ui-xp').textContent = this.saveMgr.data.xp;
    document.getElementById('ui-credits').textContent = this.saveMgr.data.credits.toLocaleString();
  }

  renderCarList() {
    const filter = document.getElementById('car-category-filter').value;
    const container = document.getElementById('car-list');
    container.innerHTML = '';

    const filtered = VEHICLES.filter(v => filter === 'ALL' || v.category === filter);
    filtered.forEach(car => {
      const owned = this.saveMgr.data.ownedCars.includes(car.id);
      const div = document.createElement('div');
      div.className = `car-item ${car.id === this.previewCarId ? 'selected' : ''}`;
      div.innerHTML = `
        <div>
          <strong>${car.name}</strong><br/>
          <small style="color:#00f0ff">${car.category}</small>
        </div>
        <div style="text-align:right">
          ${owned ? '<span style="color:#00ff88;font-weight:700">OWNED</span>' : `<span style="color:#ffcc00">CR ${car.price.toLocaleString()}</span>`}
        </div>
      `;
      div.onclick = () => {
        this.previewCarId = car.id;
        if (owned) {
          this.saveMgr.data.selectedCarId = car.id;
          this.saveMgr.save();
        }
        this.renderCarList();
        this.renderUpgrades();
        this.updateSpecCard();
        this.cb.onPreviewCar(car.id);
      };
      container.appendChild(div);
    });
  }

  renderSwatches() {
    const paintBox = document.getElementById('paint-swatches');
    const neonBox = document.getElementById('neon-swatches');
    paintBox.innerHTML = '';
    neonBox.innerHTML = '';

    PAINT_COLORS.forEach(hex => {
      const el = document.createElement('div');
      el.className = 'swatch';
      el.style.background = hex;
      el.onclick = () => {
        const cfg = this.saveMgr.getCarConfig(this.previewCarId, VEHICLES[this.previewCarId]);
        cfg.color = hex;
        this.saveMgr.save();
        this.cb.onPreviewCar(this.previewCarId);
      };
      paintBox.appendChild(el);
    });

    NEON_COLORS.forEach(hex => {
      const el = document.createElement('div');
      el.className = 'swatch';
      el.style.background = hex;
      el.onclick = () => {
        const cfg = this.saveMgr.getCarConfig(this.previewCarId, VEHICLES[this.previewCarId]);
        cfg.neon = hex;
        this.saveMgr.save();
        this.cb.onPreviewCar(this.previewCarId);
      };
      neonBox.appendChild(el);
    });
  }

  renderUpgrades() {
    const box = document.getElementById('upgrade-list');
    box.innerHTML = '';
    const car = VEHICLES[this.previewCarId];
    const cfg = this.saveMgr.getCarConfig(car.id, car);

    UPGRADE_TYPES.forEach(u => {
      const lvl = cfg.upgrades[u.key] || 0;
      const cost = u.cost * (lvl + 1);
      const row = document.createElement('div');
      row.className = 'upgrade-item';
      row.innerHTML = `
        <div>
          <strong>${u.name} (Lv ${lvl}/5)</strong><br/>
          <small>${u.desc}</small>
        </div>
        <button class="secondary-btn" ${lvl >= 5 ? 'disabled' : ''}>
          ${lvl >= 5 ? 'MAX' : `CR ${cost.toLocaleString()}`}
        </button>
      `;
      row.querySelector('button').onclick = () => {
        if (this.garageMgr.upgradePart(car.id, u.key, u.cost)) {
          this.renderAll();
        }
      };
      box.appendChild(row);
    });
  }

  renderCareer() {
    const s = this.saveMgr.data.stats;
    document.getElementById('career-stats-box').innerHTML = `
      <strong>Races:</strong> ${s.racesPlayed} | <strong>Wins:</strong> ${s.wins}<br/>
      <strong>Total Drift:</strong> ${s.totalDriftScore.toLocaleString()} pts<br/>
      <strong>Distance:</strong> ${s.totalDistanceKm.toFixed(1)} km | <strong>Top Speed:</strong> ${Math.round(s.topSpeedReached)} km/h
    `;

    const list = document.getElementById('mission-list');
    list.innerHTML = '';
    DEFAULT_MISSIONS.forEach(m => {
      const prog = this.careerMgr.getMissionProgress(m);
      const claimed = this.saveMgr.data.claimedMissions.includes(m.id);
      const ready = prog >= m.target && !claimed;
      const div = document.createElement('div');
      div.className = 'mission-item';
      div.innerHTML = `
        <div><strong>${m.title}</strong><br/><small>Progress: ${Math.min(prog, m.target)} / ${m.target}</small></div>
        <button class="secondary-btn" ${!ready ? 'disabled' : ''}>${claimed ? 'CLAIMED' : `CR ${m.reward}`}</button>
      `;
      div.querySelector('button').onclick = () => {
        if (this.careerMgr.claimMission(m.id)) {
          this.renderAll();
        }
      };
      list.appendChild(div);
    });
  }

  updateSpecCard() {
    const car = VEHICLES[this.previewCarId];
    const owned = this.saveMgr.data.ownedCars.includes(car.id);
    document.getElementById('spec-class').textContent = car.category.toUpperCase();
    document.getElementById('spec-name').textContent = car.name;

    document.getElementById('bar-speed').style.width = `${Math.min(100, (car.topSpeed / 445) * 100)}%`;
    document.getElementById('bar-accel').style.width = `${car.accel}%`;
    document.getElementById('bar-handling').style.width = `${car.handling}%`;
    document.getElementById('bar-nitro').style.width = `${car.nitro}%`;

    const buyBtn = document.getElementById('btn-buy-car');
    const raceBtn = document.getElementById('btn-start-race');
    if (owned) {
      buyBtn.classList.add('hidden');
      raceBtn.classList.remove('hidden');
    } else {
      buyBtn.classList.remove('hidden');
      buyBtn.textContent = `UNLOCK CAR — CR ${car.price.toLocaleString()}`;
      raceBtn.classList.add('hidden');
    }
  }

  drawTachometer(physics, usingNitro) {
    const ctx = this.tachoCtx;
    ctx.clearRect(0, 0, 220, 220);
    const cx = 110, cy = 110, r = 88;
    const startAngle = Math.PI * 0.72;
    const endAngle = Math.PI * 2.28;

    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 11, 24, 0.85)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 12;
    ctx.stroke();

    const rpmNorm = Math.min(1, physics.rpm / 9000);
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, startAngle + rpmNorm * (endAngle - startAngle));
    ctx.strokeStyle = rpmNorm > 0.85 ? '#ff2a5f' : '#00ff88';
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let n = 1; n <= 10; n++) {
      const frac = n / 10;
      const ang = startAngle + frac * (endAngle - startAngle);
      const tx = cx + Math.cos(ang) * (r - 18);
      const ty = cy + Math.sin(ang) * (r - 18);
      ctx.fillText(String(n), tx, ty);
    }

    ctx.fillStyle = '#ffcc00';
    ctx.font = 'italic 900 36px Segoe UI, sans-serif';
    ctx.fillText(Math.round(physics.speedKmh), cx, cy - 2);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px Segoe UI, sans-serif';
    ctx.fillText('KM/H', cx, cy + 20);

    ctx.fillStyle = usingNitro ? '#00f0ff' : '#e2e8f0';
    ctx.font = '900 18px Segoe UI, sans-serif';
    ctx.fillText(String(physics.gear), cx, cy + 40);
  }

  drawMinimap(waypoints, physics, aiRacers) {
    const ctx = this.mapCtx;
    ctx.clearRect(0, 0, 160, 160);
    const scale = 0.11;
    const cx = 80, cy = 80;

    ctx.strokeStyle = 'rgba(255, 0, 127, 0.16)';
    ctx.lineWidth = 1;
    for (let g = 20; g < 160; g += 28) {
      ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, 160); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(160, g); ctx.stroke();
    }

    ctx.beginPath();
    waypoints.forEach((wp, idx) => {
      const mx = cx + (wp.x - physics.pos.x) * scale;
      const mz = cy + (wp.z - physics.pos.z) * scale;
      if (idx === 0) ctx.moveTo(mx, mz);
      else ctx.lineTo(mx, mz);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ff007f';
    aiRacers.forEach(ai => {
      const mx = cx + (ai.pos.x - physics.pos.x) * scale;
      const mz = cy + (ai.pos.z - physics.pos.z) * scale;
      ctx.beginPath();
      ctx.arc(mx, mz, 3.8, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4.8, 0, Math.PI * 2);
    ctx.fill();
  }
}