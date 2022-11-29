import { Request, Response, NextFunction } from 'express';
import MatchesService from '../services/Matches';

export default class MatchesController {
  constructor(private service: MatchesService = new MatchesService()) {
    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.updateResult = this.updateResult.bind(this);
  }

  private async getInProgress(inProgress: string) {
    const progress = await this.service.fiuterAll(inProgress === 'true');
    return progress;
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { inProgress } = req.query as { inProgress: string };
      if (inProgress) {
        const progress = await this.getInProgress(inProgress);
        res.status(progress.code).json(progress.data);
      }
      const matches = await this.service.findAll();
      return res.status(matches.code).json(matches.data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await this.service.create(req.body);
      return res.status(match.code).json(match.data);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const match = await this.service.update(+id);
      return res.status(match.code).json(match.data);
    } catch (err) {
      next(err);
    }
  }

  async updateResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;

      const match = await this.service
        .updateResult(+id, homeTeamGoals, awayTeamGoals);
      return res.status(match.code).json(match.data);
    } catch (err) {
      next(err);
    }
  }
}
