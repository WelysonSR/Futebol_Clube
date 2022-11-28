import { NextFunction, Request, Response } from 'express';
import LeaderService from '../services/LeaderBoard';

export default class LeaderController {
  constructor(private service: LeaderService = new LeaderService()) {
    this.getAllHome = this.getAllHome.bind(this);
    this.getAllAway = this.getAllAway.bind(this);
  }

  async getAllHome(_req: Request, res: Response, next: NextFunction) {
    try {
      const team = await this.service.getAllHome();
      return res.status(team.code).json(team.data);
    } catch (err) {
      next(err);
    }
  }

  async getAllAway(_req: Request, res: Response, next: NextFunction) {
    try {
      const team = await this.service.getAllAway();
      return res.status(team.code).json(team.data);
    } catch (err) {
      next(err);
    }
  }
}
