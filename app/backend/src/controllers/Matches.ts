import { Request, Response } from 'express';
import CustonError from '../erros/CustonErros';
import MatchesService from '../services/Matches';

export default class MatchesController {
  constructor(private service: MatchesService = new MatchesService()) {
    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.updateResult = this.updateResult.bind(this);
  }

  async findAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress) {
      const progress = await this.service.fiuterAll(inProgress === 'true');
      if (progress.message) {
        return res.status(progress.code).json(progress.message);
      }
      return res.status(progress.code).json(progress.data);
    }
    const matches = await this.service.findAll();
    if (matches.message) {
      return res.status(matches.code).json(matches.message);
    }
    return res.status(matches.code).json(matches.data);
  }

  async create(req: Request, res: Response) {
    try {
      await this.service.create(req.body);
      // return res.status(match.code).json(match.data);
    } catch (err) {
      if (err instanceof CustonError) {
        const customError = (<CustonError>err);
        return res.status(customError.code).json({ message: customError.message });
      }
      return res.status(500).json({ message: 'Unknown error' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const match = await this.service.update(+id);
    if (match.message) {
      return res.status(match.code).json(match.message);
    }
    return res.status(match.code).json(match.data);
  }

  async updateResult(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    const match = await this.service
      .updateResult(+id, homeTeamGoals, awayTeamGoals);
    return res.status(match.code).json(match.data);
  }
}
