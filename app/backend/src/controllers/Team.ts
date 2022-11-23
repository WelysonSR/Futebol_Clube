import { NextFunction, Request, Response } from 'express';
import TeamService from '../services/Team';

export default class ControllerTeam {
  constructor(private service: TeamService = new TeamService()) {
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  async findAll(
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { code, data } = await this.service.findAll();

    return res.status(code).json(data);
  }

  async findOne(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const { id } = req.params;
    const { code, data } = await this.service.findOne(+id);
    return res.status(code).json(data);
  }
}
