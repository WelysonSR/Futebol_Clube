import Team from '../database/models/Team';
import { ITeam } from '../interfaces/ITeam';

export default class TeamModel {
  protected _model = Team;

  async findAll(): Promise<ITeam[] | null> {
    const result = await this._model.findAll();
    return result;
  }

  async findOne(id: number): Promise<ITeam | null> {
    const result = await this._model.findByPk(id);
    return result;
  }
}
