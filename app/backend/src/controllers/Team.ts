import { NextFunction, Request, Response } from 'express';
import TeamService from '../services/Team';

export default class ControllerTeam {
  constructor(private service: TeamService = new TeamService()) {
    this.findAll = this.findAll.bind(this);
  }

  public async findAll(
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { code, data } = await this.service.gatAll();

    return res.status(code).json(data);
  }
}
