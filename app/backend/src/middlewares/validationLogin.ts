import { NextFunction, Request, Response } from 'express';
import { ILogin } from '../interfaces/ILogin';

export default function validationLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body as ILogin;
  const regexEmail = /\S+@\S+\.\S+/;

  if (!password || password.length < 6) {
    return res.status(400)
      .json({ message: 'All fields must be filled' });
  }

  if (!email || !regexEmail.test(email)) {
    return res.status(400)
      .json({ message: 'All fields must be filled' });
  }

  next();
}
