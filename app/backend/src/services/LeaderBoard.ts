import { sortLeaderBoardHome, calculateLeaderboard } from '../assets/Leader';
import { ILeaderBoardHomeAway } from '../interfaces/ILeaderBoard';
import LeaderModel from '../models/LeaderBoard';

export default class LeaderService {
  constructor(
    private leaderModel: LeaderModel = new LeaderModel(),
  ) { }

  async getAllHome() {
    const leader = await this.leaderModel.getAllHome() as unknown as ILeaderBoardHomeAway[];
    const result = calculateLeaderboard(leader);
    const sortLeader = sortLeaderBoardHome(result);
    return { code: 200, data: sortLeader };
  }
}
