import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/Matches';

export default class MatchesController {
  constructor(private service: MatchesService = new MatchesService()) {
    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.updateResult = this.updateResult.bind(this);
  }

  async findAll(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { inProgress } = req.query;
    if (inProgress) {
      const progress = await this.service.fiuterAll(inProgress === 'true');
      if (progress.message) {
        return res.status(progress.code).json(progress.message);
      } return res.status(progress.code).json(progress.data);
    }
    const matches = await this.service.findAll();
    if (matches.message) {
      return res.status(matches.code).json(matches.message);
    } return res.status(matches.code).json(matches.data);
  }

  async create(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { code, data } = await this.service.create(req.body);
    if (code !== 201) {
      return res.status(code).json({ message: data });
    }
    return res.status(code).json(data);
  }

  async update(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { id } = req.params;
    const { code, data } = await this.service.update(+id);
    return res.status(code).json({ message: data });
  }

  async updateResult(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    const { code, data } = await this.service
      .updateResult(+id, homeTeamGoals, awayTeamGoals);

    return res.status(code).json(data);
  }
}
