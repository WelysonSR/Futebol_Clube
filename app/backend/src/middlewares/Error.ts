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

  // if (err instanceof CustonError) {
  //   const customError = (<CustonError>err);
  //   return res.status(customError.code).json({ message: customError.message });
  // }
  // return res.status(500).json({ message: 'Unknown error' });

  res.status(code || 500).json({ message });
}
