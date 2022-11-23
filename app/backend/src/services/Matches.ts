import MatchesModel from '../models/Models';

export default class MatchesService {
  constructor(
    private model: MatchesModel = new MatchesModel(),
  ) { }

  async findAll() {
    const matches = await this.model.findAll();
    if (!matches) {
      return { code: 404, message: 'No matches found' };
    }
    return { code: 200, data: matches };
  }
}
