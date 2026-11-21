import * as THREE from 'three';

export class TrafficSystem {
  constructor(scene, waypoints) {
    this.scene = scene;
    this.waypoints = waypoints;
    this.vehicles = [];
  }

  spawn(count = 14) {
    this.clear();
    const colors = [0x94a3b8, 0x334155, 0xf8fafc, 0xd97706, 0x0284c7];

    for (let i = 0; i < count; i++) {
      const isBusOrTruck = i % 4 === 0;
      const w = isBusOrTruck ? 2.4 : 1.9;
      const h = isBusOrTruck ? 2.7 : 1.4;
      const l = isBusOrTruck ? 8.2 : 4.3;

      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, l),
        new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          metalness: 0.5,
          roughness: 0.4
        })
      );
      body.position.y = h / 2 + 0.25;

      const hl = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.8, 0.2, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xfffbeb })
      );
      hl.position.set(0, 0.7, l / 2 + 0.02);

      const tl = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.8, 0.2, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xdc2626 })
      );
      tl.position.set(0, 0.7, -l / 2 - 0.02);
      group.add(body, hl, tl);

      const wpIndex = (i * 2) % this.waypoints.length;
      const pos = this.waypoints[wpIndex].clone();
      const laneOffset = i % 2 === 0 ? 5.5 : -5.5;
      pos.x += laneOffset;

      group.position.copy(pos);
      this.scene.add(group);

      this.vehicles.push({
        mesh: group,
        pos,
        wpIndex,
        laneOffset,
        speed: isBusOrTruck ? 11 : 15,
        radius: isBusOrTruck ? 4.2 : 2.6
      });
    }
  }

  clear() {
    this.vehicles.forEach(v => this.scene.remove(v.mesh));
    this.vehicles = [];
  }

  update(dt, playerPhysics, onCollide) {
    for (const v of this.vehicles) {
      const target = this.waypoints[v.wpIndex];
      const aim = new THREE.Vector3(target.x + v.laneOffset, 0, target.z);
      const dir = aim.clone().sub(v.pos);

      if (dir.length() < 18) {
        v.wpIndex = (v.wpIndex + 1) % this.waypoints.length;
      } else {
        dir.normalize();
        v.pos.addScaledVector(dir, v.speed * dt);
        v.mesh.position.copy(v.pos);
        v.mesh.lookAt(v.pos.clone().add(dir));
      }

      const dx = playerPhysics.pos.x - v.pos.x;
      const dz = playerPhysics.pos.z - v.pos.z;
      const sep = Math.hypot(dx, dz);
      if (sep < v.radius + 1.5 && sep > 0.01) {
        const push = v.radius + 1.5 - sep;
        playerPhysics.pos.x += (dx / sep) * push;
        playerPhysics.pos.z += (dz / sep) * push;
        playerPhysics.vel.multiplyScalar(0.6);
        if (onCollide) onCollide(0.7);
      }
    }
  }
}