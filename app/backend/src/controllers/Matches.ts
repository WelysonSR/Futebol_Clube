import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/Matches';

export default class MatchesController {
  constructor(private service: MatchesService = new MatchesService()) {
    this.findAll = this.findAll.bind(this);
  }

  public async findAll(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { code, data } = await this.service.findAll();
    return res.status(code).json(data);
  }
}
