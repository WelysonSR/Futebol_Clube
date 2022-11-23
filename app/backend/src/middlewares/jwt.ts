import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const jwtConfig: jwt.SignOptions = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

export const generateTokenJwt = (email: string) => {
  const token = jwt.sign({ email }, JWT_SECRET, jwtConfig);
  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const { email } = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return email;
  } catch (error) {
    return error;
  }
};

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || authorization.length === 0) {
      return next({ code: 401, message: 'Token not found' });
    }
    jwt.verify(authorization as string, JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json({ message: 'Token must be a valid token' });
      }
    });
    next();
  } catch (err) {
    next(err);
  }
};
