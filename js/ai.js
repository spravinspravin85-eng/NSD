import * as THREE from 'three';
import { VEHICLES } from './data.js';
import { buildVehicleMesh } from './vehicle.js';

export class AIRacerManager {
  constructor(scene, waypoints) {
    this.scene = scene;
    this.waypoints = waypoints;
    this.racers = [];
  }

  clear() {
    this.racers.forEach(r => this.scene.remove(r.meshObj.root));
    this.racers = [];
  }

  spawnGrid(count, difficultyMult, playerPos, playerHeading) {
    this.clear();
    const forward = new THREE.Vector3(Math.sin(playerHeading), 0, Math.cos(playerHeading));
    const right = new THREE.Vector3(Math.cos(playerHeading), 0, -Math.sin(playerHeading));

    for (let i = 0; i < count; i++) {
      const carSpec = VEHICLES[(i * 17 + 7) % VEHICLES.length];
      const cfg = {
        color: carSpec.defaultColor,
        neon: i % 2 === 0 ? '#ff007f' : '#00f0ff',
        hood: i % 2,
        spoiler: 2,
        rims: i % 3
      };
      const meshObj = buildVehicleMesh(carSpec, cfg);

      const row = Math.floor((i + 1) / 2);
      const side = (i % 2 === 0) ? 1 : -1;
      const startPos = playerPos.clone()
        .addScaledVector(forward, -row * 9)
        .addScaledVector(right, side * 3.2);

      meshObj.root.position.copy(startPos);
      meshObj.root.rotation.y = playerHeading;
      this.scene.add(meshObj.root);

      this.racers.push({
        name: `Rival ${i + 1}`,
        meshObj,
        pos: startPos,
        heading: playerHeading,
        speed: 0,
        maxSpeed: (carSpec.topSpeed / 3.6) * difficultyMult * (0.94 + (i % 3) * 0.03),
        wpIndex: 1,
        laneOffset: side * (2.5 + (i % 3) * 1.5),
        lap: 1,
        progress: 0
      });
    }
  }

  update(dt, activeRace, playerPhysics) {
    if (!activeRace || this.racers.length === 0) return;

    for (const ai of this.racers) {
      const targetWp = this.waypoints[ai.wpIndex];
      const nextWp = this.waypoints[(ai.wpIndex + 1) % this.waypoints.length];

      const segDir = nextWp.clone().sub(targetWp).normalize();
      const lateral = new THREE.Vector3(-segDir.z, 0, segDir.x);
      const aimPoint = targetWp.clone().addScaledVector(lateral, ai.laneOffset);

      const toTarget = aimPoint.clone().sub(ai.pos);
      const dist = toTarget.length();
      if (dist < 22) {
        ai.wpIndex = (ai.wpIndex + 1) % this.waypoints.length;
        if (ai.wpIndex === 1) ai.lap++;
      }

      const desiredHeading = Math.atan2(toTarget.x, toTarget.z);
      let angleDiff = desiredHeading - ai.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      ai.heading += Math.max(-2.2 * dt, Math.min(2.2 * dt, angleDiff * 3.5));

      const cornerFactor = Math.abs(angleDiff) > 0.45 ? 0.62 : 1.0;
      const targetSpeed = ai.maxSpeed * cornerFactor;
      ai.speed += (targetSpeed - ai.speed) * Math.min(1, dt * 1.8);

      ai.pos.x += Math.sin(ai.heading) * ai.speed * dt;
      ai.pos.z += Math.cos(ai.heading) * ai.speed * dt;
      ai.progress = ai.lap * 1000 + ai.wpIndex * 50 - dist * 0.1;

      const dx = playerPhysics.pos.x - ai.pos.x;
      const dz = playerPhysics.pos.z - ai.pos.z;
      const sep = Math.hypot(dx, dz);
      if (sep < 3.4 && sep > 0.01) {
        const push = (3.4 - sep) * 0.5;
        playerPhysics.pos.x += (dx / sep) * push;
        playerPhysics.pos.z += (dz / sep) * push;
        ai.pos.x -= (dx / sep) * push;
        ai.pos.z -= (dz / sep) * push;
      }

      ai.meshObj.root.position.copy(ai.pos);
      ai.meshObj.root.rotation.y = ai.heading;
      ai.meshObj.wheels.forEach(w => {
        w.spinMesh.rotation.x += (ai.speed * dt) / 0.36;
      });
    }
  }
}