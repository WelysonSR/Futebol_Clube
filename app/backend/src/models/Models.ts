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
}
