import Team from '../database/models/Team';
import Matches from '../database/models/Matches';

export default class LeaderBoardModel {
  protected _model = Team;

  async getAllHome() {
    const result = await this._model.findAll({
      attributes: { exclude: ['id'] },
      include: [{ model: Matches, as: 'teamHome', where: { inProgress: 0 } }],
    });
    return result;
  }
}
