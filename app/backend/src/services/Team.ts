import TeamModel from '../models/Team';

export default class TeamService {
  constructor(private model: TeamModel = new TeamModel()) {}

  public async gatAll() {
    const team = await this.model.findAll();
    if (!team) {
      return { code: 404, message: 'No teams found' };
    }
    return { code: 200, data: team };
  }
}
