import CustonError from '../erros/CustonErros';
import TeamModel from '../models/Team';

export default class TeamService {
  constructor(private model: TeamModel = new TeamModel()) {}

  async findAll() {
    const team = await this.model.findAll();
    if (!team) throw new CustonError(404, 'No teams found');
    return { code: 200, data: team };
  }

  async findOne(id: number) {
    const team = await this.model.findOne(id);
    if (!team) throw new CustonError(404, 'No teams found by id');
    return { code: 200, data: team };
  }
}
