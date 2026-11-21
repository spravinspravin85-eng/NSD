const SAVE_KEY = 'NSD_NITRO_STORM_DRIFT_V12_FINAL';

const DEFAULT_SAVE = {
  version: 12,
  credits: 50000,
  xp: 0,
  level: 1,
  selectedCarId: 0,
  ownedCars: [0, 20, 40, 60, 80, 100],
  carConfigs: {},
  stats: {
    racesPlayed: 0,
    wins: 0,
    totalDriftScore: 0,
    totalDistanceKm: 0,
    topSpeedReached: 0
  },
  claimedMissions: []
};

export class SaveManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return structuredClone(DEFAULT_SAVE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT_SAVE),
        ...parsed,
        stats: { ...DEFAULT_SAVE.stats, ...(parsed.stats || {}) }
      };
    } catch {
      return structuredClone(DEFAULT_SAVE);
    }
  }

  save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  reset() {
    localStorage.removeItem(SAVE_KEY);
    this.data = structuredClone(DEFAULT_SAVE);
    this.save();
  }

  getCarConfig(carId, fallbackCar) {
    if (!this.data.carConfigs[carId]) {
      this.data.carConfigs[carId] = {
        color: fallbackCar.defaultColor,
        neon: '#00f0ff',
        hood: 0,
        spoiler: fallbackCar.bodyShape.defaultSpoiler,
        rims: 0,
        upgrades: { engine: 0, transmission: 0, tires: 0, suspension: 0, brakes: 0, nitro: 0 }
      };
    }
    return this.data.carConfigs[carId];
  }

  addRewards(credits, xp) {
    this.data.credits += Math.round(credits);
    this.data.xp += Math.round(xp);
    this.data.level = Math.floor(this.data.xp / 1000) + 1;
    this.save();
  }
}