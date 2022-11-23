import { NextFunction, Request, Response } from 'express';
import ServiceLogin from '../services/Login';
import { ILogin } from '../interfaces/ILogin';

export default class ControllerLogin {
  constructor(private service: ServiceLogin = new ServiceLogin()) {
    this.login = this.login.bind(this);
  }

  async login(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const user = req.body as ILogin;
    const result = await this.service.login(user);

    if (result.code === 200) {
      return res.status(result.code).json({ token: result.token });
    }
    return res.status(result.code).json({ message: result.message });
  }
}
