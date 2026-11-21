import { VEHICLES } from './data.js';

export class GarageManager {
  constructor(saveMgr) {
    this.saveMgr = saveMgr;
  }

  purchaseVehicle(carId) {
    const car = VEHICLES[carId];
    if (!car) return false;
    if (this.saveMgr.data.ownedCars.includes(carId)) return true;
    if (this.saveMgr.data.credits < car.price) return false;

    this.saveMgr.data.credits -= car.price;
    this.saveMgr.data.ownedCars.push(carId);
    this.saveMgr.data.selectedCarId = carId;
    this.saveMgr.save();
    return true;
  }

  upgradePart(carId, upgradeKey, baseCost) {
    const car = VEHICLES[carId];
    const cfg = this.saveMgr.getCarConfig(carId, car);
    const currentLevel = cfg.upgrades[upgradeKey] || 0;
    const cost = baseCost * (currentLevel + 1);

    if (currentLevel >= 5 || this.saveMgr.data.credits < cost) return false;
    this.saveMgr.data.credits -= cost;
    cfg.upgrades[upgradeKey] = currentLevel + 1;
    this.saveMgr.save();
    return true;
  }
}