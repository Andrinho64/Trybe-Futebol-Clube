import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '../utils';
import { HTTP_STATUS, MSG } from '../configs/strings';

const tokenHandler = (
  req: Request & JwtPayload,
  res: Response,
  next: NextFunction,
) => {
  const PREFIX = 'Bearer ';
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.TOKEN_NOT_FOUND }).end();
  }
  const jwt: string = authorization.startsWith(PREFIX) ? authorization.substring(PREFIX.length)
    : authorization;
  try {
    res.locals.user = new JwtService().verifyToken(jwt as string);
    return next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.TOKEN_NOT_VALID });
  }
};

export default tokenHandler;
