import { DEFAULT_MISSIONS } from './data.js';

export class CareerManager {
  constructor(saveMgr) {
    this.saveMgr = saveMgr;
  }

  getMissionProgress(mission) {
    const s = this.saveMgr.data.stats;
    if (mission.type === 'wins') return s.wins;
    if (mission.type === 'drift') return s.totalDriftScore;
    if (mission.type === 'distance') return Math.floor(s.totalDistanceKm);
    if (mission.type === 'cars') return this.saveMgr.data.ownedCars.length;
    return 0;
  }

  claimMission(missionId) {
    const mission = DEFAULT_MISSIONS.find(m => m.id === missionId);
    if (!mission) return false;
    if (this.saveMgr.data.claimedMissions.includes(missionId)) return false;

    const prog = this.getMissionProgress(mission);
    if (prog < mission.target) return false;

    this.saveMgr.data.claimedMissions.push(missionId);
    this.saveMgr.addRewards(mission.reward, 400);
    return true;
  }
}