import { NextFunction, Request, Response } from 'express';
import CustonError from '../erros/CustonErros';

export default function middlewareError(
  err: CustonError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof CustonError) {
    const customError = (<CustonError>err);
    return res.status(customError.code).json({ message: customError.message });
  }
  return res.status(500).json({ message: 'Unknown error' });
}
