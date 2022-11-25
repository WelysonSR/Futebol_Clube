import { Request, Response, NextFunction } from 'express';
import LeaderService from '../services/LeaderBoard';

export default class LeaderController {
  constructor(private service: LeaderService = new LeaderService()) {
    this.getAllHome = this.getAllHome.bind(this);
  }

  async getAllHome(
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const team = await this.service.getAllHome();
    return res.status(team.code).json(team.data);
  }
}
