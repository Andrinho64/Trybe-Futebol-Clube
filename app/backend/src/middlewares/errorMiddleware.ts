import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils';
import { HTTP_STATUS, MSG, JOI_ERROR_CODE } from '../configs/strings';

const errorLogger: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  next(err);
};

const errorHandlerJoi: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.isJoi) {
    const { details: [{ type, message }] } = err;
    res
      .status(JOI_ERROR_CODE[type as keyof typeof JOI_ERROR_CODE] || HTTP_STATUS.BAD_REQUEST)
      .json({ message })
      .end();
  }
  next(err);
};

const errorHandlerDefault: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.code in HTTP_STATUS) {
    res.status(err.code).json({ message: err.message }).end();
  }
  // Se chegamos aqui, trata-se de um erro inesperado e devemos retornar 500
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: MSG.INTERNAL_SERVER_ERROR }) // 'Something went wrong'
    .end();
};

export default [errorLogger, errorHandlerJoi, errorHandlerDefault];
