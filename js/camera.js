import * as THREE from 'three';

export class EffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    const geo = new THREE.SphereGeometry(0.24, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.45 });

    for (let i = 0; i < 60; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.visible = false;
      this.scene.add(m);
      this.particles.push({ mesh: m, life: 0, vel: new THREE.Vector3() });
    }
    this.cursor = 0;

    const rainCount = 900;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 140;
      positions[i + 1] = Math.random() * 45;
      positions[i + 2] = (Math.random() - 0.5) * 140;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainSystem = new THREE.Points(
      rainGeo,
      new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.22, transparent: true, opacity: 0.65 })
    );
    this.rainSystem.visible = false;
    this.scene.add(this.rainSystem);
  }

  emitSmoke(pos) {
    const p = this.particles[this.cursor];
    this.cursor = (this.cursor + 1) % this.particles.length;
    p.mesh.position.copy(pos);
    p.mesh.position.y = 0.2;
    p.mesh.scale.setScalar(0.6);
    p.mesh.visible = true;
    p.life = 0.55;
    p.vel.set((Math.random() - 0.5) * 2, 1.4, (Math.random() - 0.5) * 2);
  }

  applyWeather(preset, dirLight, ambientLight) {
    this.rainSystem.visible = preset === 'storm' || preset === 'night_wet';
    if (preset === 'day') {
      this.scene.background = new THREE.Color(0x5da9e9);
      this.scene.fog = new THREE.FogExp2(0x7cc0f5, 0.0014);
      dirLight.intensity = 2.4;
      ambientLight.intensity = 1.1;
    } else if (preset === 'sunset') {
      this.scene.background = new THREE.Color(0x2a1438);
      this.scene.fog = new THREE.FogExp2(0x3b1847, 0.002);
      dirLight.intensity = 1.6;
      ambientLight.intensity = 0.8;
    } else {
      this.scene.background = new THREE.Color(0x050811);
      this.scene.fog = new THREE.FogExp2(0x070d1d, 0.0024);
      dirLight.intensity = 0.85;
      ambientLight.intensity = 0.55;
    }
  }

  update(dt, playerPos, isDrifting) {
    if (isDrifting) this.emitSmoke(playerPos);

    for (const p of this.particles) {
      if (!p.mesh.visible) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        continue;
      }
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.scale.addScalar(dt * 2.2);
    }

    if (this.rainSystem.visible) {
      this.rainSystem.position.set(playerPos.x, 0, playerPos.z);
      const arr = this.rainSystem.geometry.attributes.position.array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] -= 38 * dt;
        if (arr[i] < 0) arr[i] = 45;
      }
      this.rainSystem.geometry.attributes.position.needsUpdate = true;
    }
  }
}