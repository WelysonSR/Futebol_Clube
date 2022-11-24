import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/Matches';

export default class MatchesController {
  constructor(private service: MatchesService = new MatchesService()) {
    this.findAll = this.findAll.bind(this);
    this.fiuterAll = this.fiuterAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  async findAll(
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { code, data } = await this.service.findAll();
    return res.status(code).json(data);
  }

  async fiuterAll(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { inProgress } = req.query;
    console.log(inProgress);
    const { code, data } = await this.service.fiuterAll(Boolean(inProgress));
    return res.status(code).json(data);
  }

  async create(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { code, data } = await this.service.create(req.body);
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
}
