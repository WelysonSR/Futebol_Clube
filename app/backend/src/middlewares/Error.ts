import { NextFunction, Request, Response } from 'express';

interface IErrorCustom {
  code: number,
  message: string,
}

export default function middlewareError(
  err: IErrorCustom,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // const [code, message] = err.message.split('|');
  const { code, message } = err;

  res.status(code || 500).json({ message });
}
