import CustonError from '../erros/CustonErros';
import { IMatches } from '../interfaces/IMatches';
import MatchesModel from '../models/Models';
import TeamModel from '../models/Team';

export default class MatchesService {
  constructor(
    private model: MatchesModel = new MatchesModel(),
    private teamModel: TeamModel = new TeamModel(),
  ) { }

  async findAll() {
    const matches = await this.model.findAll();
    if (!matches) throw new CustonError(404, 'No matches found');
    return { code: 200, data: matches };
  }

  async fiuterAll(inProgress: boolean) {
    const matches = await this.model.fiuterAll(inProgress);
    if (!matches) throw new CustonError(404, 'No matches found');
    return { code: 200, data: matches };
  }

  async create(matches: IMatches) {
    const { homeTeam, awayTeam } = matches;
    const home = await this.teamModel.findOne(homeTeam);
    const away = await this.teamModel.findOne(awayTeam);
    if (!home || !away) {
      throw new CustonError(404, 'There is no team with such id!');
    }
    if (homeTeam === awayTeam) {
      throw new CustonError(422, 'It is not possible to create a match with two equal teams');
    }
    const match = await this.model.create(matches);
    return { code: 201, data: match };
  }

  async update(id: number) {
    const match = await this.model.update(id);
    if (!match) {
      throw new CustonError(404, 'Unable to change a match inProgress status');
    }
    return { code: 200, data: 'Finished' };
  }

  async updateResult(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await this.model.updateResult(id, homeTeamGoals, awayTeamGoals);
    return { code: 200, data: { homeTeamGoals, awayTeamGoals } };
  }
}
