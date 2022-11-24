import { IMatches } from '../interfaces/IMatches';
import Matches from '../database/models/Matches';
import Team from '../database/models/Team';

export default class MatchesModel {
  protected _model = Matches;

  async findAll(): Promise<IMatches[] | null> {
    const result = await this._model.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    return result;
  }

  async fiuterAll(inProgress: boolean): Promise<IMatches[] | null> {
    const result = await this._model.findAll({ where: { inProgress } });
    return result;
  }

  async create(matches: IMatches): Promise<IMatches> {
    const result = await this._model.create({
      homeTeam: matches.homeTeam,
      homeTeamGoals: matches.homeTeamGoals,
      awayTeam: matches.awayTeam,
      awayTeamGoals: matches.awayTeamGoals,
      inProgress: true,
    });
    return result;
  }

  async update(id: number) {
    const result = await this._model.update(
      { inProgress: false },
      { where: { id } },
    );
    return result;
  }
}
