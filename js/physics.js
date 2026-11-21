import * as THREE from 'three';

export class VehiclePhysics {
  constructor(carSpec, config) {
    this.applySpec(carSpec, config);
    this.reset(new THREE.Vector3(0, 0, 0), 0);
  }

  applySpec(carSpec, config) {
    const up = config.upgrades || {};
    this.maxSpeedKmh = carSpec.topSpeed + (up.engine || 0) * 12;
    this.maxSpeedMs = this.maxSpeedKmh / 3.6;
    this.accelForce = (18 + carSpec.accel * 0.24) * (1 + (up.transmission || 0) * 0.06);
    this.grip = (2.8 + carSpec.handling * 0.032) * (1 + (up.tires || 0) * 0.07);
    this.brakeForce = 38 * (1 + (up.brakes || 0) * 0.08);
    this.nitroPower = 1.32 + (carSpec.nitro / 100) * 0.25 + (up.nitro || 0) * 0.04;
    this.rollFactor = Math.max(0.015, 0.045 - (up.suspension || 0) * 0.006);
  }

  reset(pos, heading = 0) {
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.heading = heading;
    this.speedMs = 0;
    this.speedKmh = 0;
    this.rpm = 1000;
    this.gear = 1;
    this.nitro = 100;
    this.isDrifting = false;
    this.driftAngle = 0;
    this.odometerKm = 0;
    this.steerAngle = 0;
  }

  step(dt, input, colliders, onCollide) {
    const forward = new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
    const right = new THREE.Vector3(Math.cos(this.heading), 0, -Math.sin(this.heading));

    let forwardSpeed = this.vel.dot(forward);
    let lateralSpeed = this.vel.dot(right);

    const targetSteer = input.steer * 0.52;
    this.steerAngle += (targetSteer - this.steerAngle) * Math.min(1, dt * 10);

    const speedFactor = Math.min(1, Math.abs(forwardSpeed) / 8);
    const reverseSign = forwardSpeed >= -0.5 ? 1 : -1;
    const driftTurnBoost = input.handbrake ? 1.38 : 1.0;

    this.heading += this.steerAngle * 2.35 * speedFactor * reverseSign * driftTurnBoost * dt;

    const usingNitro = input.nitro && this.nitro > 2 && input.throttle > 0;
    if (usingNitro) {
      this.nitro = Math.max(0, this.nitro - 24 * dt);
    } else {
      this.nitro = Math.min(100, this.nitro + (this.isDrifting ? 14 : 6) * dt);
    }

    const effectiveMaxMs = this.maxSpeedMs * (usingNitro ? this.nitroPower : 1.0);
    if (input.throttle > 0 && forwardSpeed < effectiveMaxMs) {
      const thrust = this.accelForce * input.throttle * (usingNitro ? this.nitroPower : 1.0);
      forwardSpeed += thrust * dt;
    }

    if (input.brake > 0) {
      if (forwardSpeed > 1.2) {
        forwardSpeed -= this.brakeForce * input.brake * dt;
      } else {
        forwardSpeed = Math.max(-18, forwardSpeed - 16 * input.brake * dt);
      }
    }

    forwardSpeed *= Math.pow(0.985, dt * 60);

    const activeGrip = input.handbrake ? this.grip * 0.34 : this.grip;
    lateralSpeed *= Math.exp(-activeGrip * dt);

    this.vel.copy(forward).multiplyScalar(forwardSpeed).addScaledVector(right, lateralSpeed);
    this.pos.addScaledVector(this.vel, dt);

    this.speedMs = this.vel.length();
    this.speedKmh = Math.abs(forwardSpeed) * 3.6;
    this.odometerKm += (this.speedMs * dt) / 1000;

    this.driftAngle = Math.abs(lateralSpeed);
    this.isDrifting = this.speedKmh > 48 && (this.driftAngle > 3.6 || input.handbrake);

    if (input.transmission === 'manual') {
      if (input.shiftUp) this.gear = Math.min(6, this.gear + 1);
      if (input.shiftDown) this.gear = Math.max(1, this.gear - 1);
    } else {
      const gearSpan = this.maxSpeedKmh / 6;
      this.gear = Math.min(6, Math.max(1, Math.floor(this.speedKmh / gearSpan) + 1));
    }

    const gearMax = (this.maxSpeedKmh / 6) * this.gear;
    const gearMin = (this.maxSpeedKmh / 6) * (this.gear - 1);
    const ratio = Math.min(1, Math.max(0.12, (this.speedKmh - gearMin) / Math.max(1, gearMax - gearMin)));
    this.rpm = Math.round(1100 + ratio * 7900);

    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      const dx = this.pos.x - c.x;
      const dz = this.pos.z - c.z;
      if (Math.abs(dx) < c.hw && Math.abs(dz) < c.hd) {
        const penX = c.hw - Math.abs(dx);
        const penZ = c.hd - Math.abs(dz);
        if (penX < penZ) {
          this.pos.x += dx > 0 ? penX : -penX;
          this.vel.x *= -0.35;
        } else {
          this.pos.z += dz > 0 ? penZ : -penZ;
          this.vel.z *= -0.35;
        }
        if (onCollide) onCollide(this.speedKmh / 150);
      }
    }

    return {
      usingNitro,
      bodyRoll: -this.steerAngle * Math.min(1, this.speedKmh / 140) * this.rollFactor * 4.5,
      bodyPitch: (input.brake > 0 && forwardSpeed > 2 ? 0.035 : (input.throttle > 0 ? -0.025 : 0))
    };
  }
}