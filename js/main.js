import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { VEHICLES } from './data.js';
import { SaveManager } from './save.js';
import { SoundEngine } from './audio.js';
import { buildVehicleMesh } from './vehicles.js';
import { OpenWorld } from './world.js';
import { VehiclePhysics } from './physics.js';
import { AIRacerManager } from './ai.js';
import { TrafficSystem } from './traffic.js';
import { RaceDirector } from './race.js';
import { EffectsManager } from './effects.js';
import { InputController } from './controls.js';
import { CameraRig } from './camera.js';
import { UIController } from './ui.js';

class NSDGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.2, 1600);

    // Safe Post-Processing Neon Bloom (Falls back cleanly if GPU blocks EffectComposer)
    this.useBloom = false;
    this.composer = null;
    try {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.65,
        0.4,
        0.85
      );
      this.composer.addPass(this.bloomPass);
      this.useBloom = true;
    } catch (err) {
      console.warn('Bloom post-processing unavailable on this GPU, using direct WebGL render:', err);
      this.useBloom = false;
    }

    // Scene Lighting
    this.ambientLight = new THREE.HemisphereLight(0x8ecae6, 0x0b132b, 0.9);
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    this.dirLight.position.set(80, 140, 60);
    this.scene.add(this.ambientLight, this.dirLight);

    // Initialize Core Modules
    this.saveMgr = new SaveManager();
    this.sound = new SoundEngine();
    this.world = new OpenWorld(this.scene);
    this.effects = new EffectsManager(this.scene);
    this.input = new InputController();
    this.camRig = new CameraRig(this.camera);
    this.aiMgr = new AIRacerManager(this.scene, this.world.waypoints);
    this.traffic = new TrafficSystem(this.scene, this.world.waypoints);
    this.raceDir = new RaceDirector(this.world.waypoints);

    this.inRace = false;
    this.paused = false;
    this.playerMeshObj = null;
    this.physics = null;

    this.ui = new UIController(this.saveMgr, {
      onPreviewCar: id => this.loadCarMesh(id),
      onStartRace: (mode, diff, weather) => this.startRace(mode, diff, weather),
      onWeatherChange: w => this.effects.applyWeather(w, this.dirLight, this.ambientLight),
      onGraphicsChange: preset => this.applyGraphicsPreset(preset)
    });

    this.loadCarMesh(this.saveMgr.data.selectedCarId);
    this.effects.applyWeather('night_wet', this.dirLight, this.ambientLight);
    this.bindGlobalEvents();

    this.lastTime = performance.now();
    requestAnimationFrame(t => this.loop(t));
  }

  loadCarMesh(carId) {
    if (this.playerMeshObj) this.scene.remove(this.playerMeshObj.root);
    const spec = VEHICLES[carId] || VEHICLES[0];
    const cfg = this.saveMgr.getCarConfig(spec.id, spec);
    this.playerMeshObj = buildVehicleMesh(spec, cfg);
    this.scene.add(this.playerMeshObj.root);
    this.physics = new VehiclePhysics(spec, cfg);
  }

  applyGraphicsPreset(preset) {
    this.useBloom = (preset === 'high') && Boolean(this.composer);
    this.renderer.setPixelRatio(preset === 'high' ? Math.min(window.devicePixelRatio || 1, 2) : 1);
  }

  startRace(mode, difficulty, weather) {
    this.sound.init();
    const carId = this.saveMgr.data.selectedCarId;
    this.loadCarMesh(carId);
    this.effects.applyWeather(weather, this.dirLight, this.ambientLight);

    this.inRace = true;
    this.paused = false;
    this.world.setMode(true);

    const startWp = this.world.waypoints[0];
    const nextWp = this.world.waypoints[1];
    const startHeading = Math.atan2(nextWp.x - startWp.x, nextWp.z - startWp.z);
    this.physics.reset(startWp, startHeading);

    const aiCount = (mode === 'freeroam' || mode === 'timetrial' || mode === 'speedtrap') ? 0 : (mode === 'drag' ? 1 : 5);
    this.aiMgr.spawnGrid(aiCount, difficulty, startWp, startHeading);
    this.traffic.spawn(mode === 'freeroam' ? 16 : 8);
    this.raceDir.startEvent(mode);

    document.getElementById('garage-screen').classList.add('hidden');
    document.getElementById('race-hud').classList.remove('hidden');
    document.getElementById('btn-pause').classList.remove('hidden');
    document.getElementById('hud-mode-label').textContent = mode.toUpperCase();
    document.getElementById('hud-total-cars').textContent = `/${aiCount + 1}`;
  }

  returnToGarage() {
    this.inRace = false;
    this.paused = false;
    this.aiMgr.clear();
    this.traffic.clear();
    this.world.setMode(false);
    this.loadCarMesh(this.saveMgr.data.selectedCarId);

    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('race-hud').classList.add('hidden');
    document.getElementById('btn-pause').classList.add('hidden');
    document.getElementById('garage-screen').classList.remove('hidden');
    this.ui.renderAll();
  }

  bindGlobalEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      if (this.composer) this.composer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', e => {
      if (!this.inRace) return;
      if (e.code === 'KeyC') this.camRig.cycleMode();
      if (e.code === 'KeyR') this.physics.reset(this.world.waypoints[this.raceDir.nextWp], this.physics.heading);
      if (e.code === 'KeyL') this.playerMeshObj.headLightSpot.visible = !this.playerMeshObj.headLightSpot.visible;
      if (e.code === 'Escape') this.togglePause();
    });

    document.getElementById('btn-cam-cycle').onclick = () => this.camRig.cycleMode();
    document.getElementById('btn-reset-car').onclick = () => this.physics.reset(this.world.waypoints[this.raceDir.nextWp], this.physics.heading);
    document.getElementById('btn-headlights').onclick = () => {
      this.playerMeshObj.headLightSpot.visible = !this.playerMeshObj.headLightSpot.visible;
    };

    document.getElementById('btn-audio-toggle').onclick = e => {
      this.sound.init();
      const muted = this.sound.toggleMute();
      e.target.textContent = muted ? '🔇' : '🔊';
    };

    document.getElementById('btn-pause').onclick = () => this.togglePause();
    document.getElementById('btn-modal-resume').onclick = () => this.togglePause();
    document.getElementById('btn-modal-garage').onclick = () => this.returnToGarage();
  }

  togglePause() {
    if (!this.inRace) return;
    this.paused = !this.paused;
    const modal = document.getElementById('modal-overlay');
    if (this.paused) {
      document.getElementById('modal-title').textContent = 'GAME PAUSED';
      document.getElementById('modal-body').textContent = 'NSD — NITRO STORM DRIFT';
      document.getElementById('btn-modal-resume').classList.remove('hidden');
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  onRaceFinished(results) {
    this.saveMgr.data.stats.racesPlayed++;
    if (results.won) this.saveMgr.data.stats.wins++;
    this.saveMgr.data.stats.totalDriftScore += results.driftScore;
    this.saveMgr.addRewards(results.creditsEarned, results.xpEarned);

    document.getElementById('modal-title').textContent = results.won ? '1ST PLACE VICTORY!' : `FINISHED P${results.position}`;
    document.getElementById('modal-body').innerHTML = `
      <p>Time: <strong>${results.time.toFixed(2)}s</strong></p>
      <p>Drift Score: <strong>${results.driftScore.toLocaleString()}</strong></p>
      <p style="color:#ffcc00">Reward: <strong>+CR ${results.creditsEarned.toLocaleString()}</strong> | +${results.xpEarned} XP</p>
    `;
    document.getElementById('btn-modal-resume').classList.add('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
  }

  renderScene() {
    if (this.useBloom && this.composer) {
      try {
        this.composer.render();
        return;
      } catch {
        this.useBloom = false;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  loop(now) {
    requestAnimationFrame(t => this.loop(t));
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (!this.inRace) {
      this.playerMeshObj.root.position.set(0, 0, 0);
      this.playerMeshObj.root.rotation.y += dt * 0.35;
      this.camRig.update(dt, false, this.physics, false);
      this.sound.update(0, 0, false, false, false);
      this.renderScene();
      return;
    }

    if (this.paused) return;

    const trans = document.getElementById('select-transmission').value;
    const controls = this.input.poll(trans);
    const canDrive = this.raceDir.state === 'racing';

    const activeInput = canDrive
      ? controls
      : { steer: 0, throttle: 0, brake: 1, nitro: false, handbrake: true, transmission: trans };

    const dyn = this.physics.step(dt, activeInput, this.world.colliders, impact => this.sound.playCollision(impact));

    this.saveMgr.data.stats.totalDistanceKm += (this.physics.speedMs * dt) / 1000;
    if (this.physics.speedKmh > this.saveMgr.data.stats.topSpeedReached) {
      this.saveMgr.data.stats.topSpeedReached = this.physics.speedKmh;
    }

    this.playerMeshObj.root.position.copy(this.physics.pos);
    this.playerMeshObj.root.rotation.y = this.physics.heading;
    this.playerMeshObj.chassisGroup.rotation.z = dyn.bodyRoll;
    this.playerMeshObj.chassisGroup.rotation.x = dyn.bodyPitch;

    this.playerMeshObj.tailMat.color.setHex(activeInput.brake > 0 ? 0xff4466 : 0xaa0015);
    this.playerMeshObj.nitroFlames.forEach(f => {
      f.visible = dyn.usingNitro;
      if (dyn.usingNitro) f.scale.setScalar(0.85 + Math.random() * 0.45);
    });

    this.playerMeshObj.wheels.forEach(w => {
      if (w.front) w.pivot.rotation.y = this.physics.steerAngle;
      w.spinMesh.rotation.x += (this.physics.speedMs * dt) / 0.36;
    });

    this.aiMgr.update(dt, canDrive, this.physics);
    this.traffic.update(dt, this.physics, impact => this.sound.playCollision(impact));
    this.raceDir.update(dt, this.physics, this.aiMgr.racers, res => this.onRaceFinished(res));
    this.effects.update(dt, this.physics.pos, this.physics.isDrifting);
    this.sound.update(this.physics.rpm / 9000, activeInput.throttle, this.physics.isDrifting, dyn.usingNitro, true);
    this.camRig.update(dt, true, this.physics, dyn.usingNitro);

    this.updateHUD(dyn.usingNitro);
    this.renderScene();
  }

  updateHUD(usingNitro) {
    document.getElementById('hud-lap-num').textContent = `${this.raceDir.lap}/${this.raceDir.totalLaps}`;
    document.getElementById('hud-pos').textContent = this.raceDir.position;
    document.getElementById('hud-lap').textContent = `${this.raceDir.raceTime.toFixed(1)}s`;
    document.getElementById('hud-district').textContent = this.world.getDistrictName(this.physics.pos);
    document.getElementById('ind-odo').textContent = `${this.physics.odometerKm.toFixed(1)} km`;
    document.getElementById('ind-nos').classList.toggle('on', usingNitro);

    const cdEl = document.getElementById('hud-countdown');
    if (this.raceDir.state === 'countdown') {
      cdEl.classList.remove('hidden');
      cdEl.textContent = Math.ceil(this.raceDir.countdownTimer);
    } else {
      cdEl.classList.add('hidden');
    }

    const driftBox = document.getElementById('hud-drift-box');
    if (this.raceDir.driftSessionScore > 0) {
      driftBox.classList.remove('hidden');
      document.getElementById('hud-drift-score').textContent = `SLIDING / DRIFT +${this.raceDir.driftSessionScore.toLocaleString()}`;
    } else {
      driftBox.classList.add('hidden');
    }

    this.ui.drawTachometer(this.physics, usingNitro);
    this.ui.drawMinimap(this.world.waypoints, this.physics, this.aiMgr.racers);
  }
}

window.addEventListener('DOMContentLoaded', () => new NSDGame());
