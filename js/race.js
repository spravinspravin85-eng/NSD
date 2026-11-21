export class RaceDirector {
  constructor(waypoints) {
    this.waypoints = waypoints;
    this.mode = 'circuit';
    this.state = 'garage';
    this.countdownTimer = 0;
    this.raceTime = 0;
    this.lap = 1;
    this.totalLaps = 3;
    this.nextWp = 1;
    this.driftSessionScore = 0;
    this.driftTotalScore = 0;
    this.driftComboTimer = 0;
    this.position = 1;
  }

  startEvent(mode) {
    this.mode = mode;
    this.raceTime = 0;
    this.lap = 1;
    this.nextWp = 1;
    this.driftSessionScore = 0;
    this.driftTotalScore = 0;
    this.totalLaps = (mode === 'sprint' || mode === 'drag' || mode === 'speedtrap') ? 1 : 3;

    if (mode === 'freeroam') {
      this.state = 'racing';
      this.countdownTimer = 0;
    } else {
      this.state = 'countdown';
      this.countdownTimer = 3.2;
    }
  }

  update(dt, physics, aiRacers, onFinish) {
    if (this.state === 'countdown') {
      this.countdownTimer -= dt;
      if (this.countdownTimer <= 0) this.state = 'racing';
      return;
    }

    if (this.state !== 'racing') return;
    this.raceTime += dt;

    if (physics.isDrifting) {
      this.driftSessionScore += Math.round(physics.speedKmh * physics.driftAngle * dt * 2.2);
      this.driftComboTimer = 1.6;
    } else if (this.driftComboTimer > 0) {
      this.driftComboTimer -= dt;
      if (this.driftComboTimer <= 0) {
        this.driftTotalScore += this.driftSessionScore;
        this.driftSessionScore = 0;
      }
    }

    const wp = this.waypoints[this.nextWp];
    const dist = Math.hypot(physics.pos.x - wp.x, physics.pos.z - wp.z);
    if (dist < 32) {
      this.nextWp = (this.nextWp + 1) % this.waypoints.length;
      if (this.nextWp === 1) {
        if (this.mode !== 'freeroam' && this.lap >= this.totalLaps) {
          this.state = 'finished';
          this.driftTotalScore += this.driftSessionScore;
          onFinish(this.buildResults());
          return;
        }
        this.lap++;
      }
    }

    const playerProgress = this.lap * 1000 + this.nextWp * 50 - dist * 0.1;
    let rank = 1;
    for (const ai of aiRacers) {
      if (ai.progress > playerProgress) rank++;
    }
    this.position = rank;

    if (this.mode === 'speedtrap' && physics.speedKmh >= 290) {
      this.state = 'finished';
      onFinish(this.buildResults());
    }
  }

  buildResults() {
    const won = this.position === 1;
    const baseReward = won ? 12000 : Math.max(2500, 9000 - this.position * 1500);
    const driftBonus = Math.round(this.driftTotalScore * 0.25);
    return {
      won,
      position: this.position,
      time: this.raceTime,
      driftScore: this.driftTotalScore,
      creditsEarned: baseReward + driftBonus,
      xpEarned: won ? 650 : 300
    };
  }
}