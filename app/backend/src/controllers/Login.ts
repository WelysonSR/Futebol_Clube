import { NextFunction, Request, Response } from 'express';
import ServiceLogin from '../services/Login';
import { ILogin } from '../interfaces/ILogin';
import { verifyJwt } from '../middlewares/jwt';

interface IToken {
  authorization: string;
}

export default class ControllerLogin {
  constructor(private service: ServiceLogin = new ServiceLogin()) {
    this.login = this.login.bind(this);
    this.validateToken = this.validateToken.bind(this);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body as ILogin;
      const result = await this.service.login(user);

      return res.status(result.code).json({ token: result.token });
    } catch (err) {
      next(err);
    }
  }

  async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers as IToken;

      const email = verifyJwt(authorization);
      const { code, role } = await this.service.validate(email);
      return res.status(code).json({ role });
    } catch (err) {
      next(err);
    }
  }
}
