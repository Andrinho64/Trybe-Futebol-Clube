import { NextFunction, Request, Response } from 'express';
import LoginService from '../services/LoginService';
import { HTTP_STATUS, MSG } from '../configs/strings';
import { IUser } from '../Interfaces/IUser';

export default class LoginController {
  public static validate(req: Request, _res: Response, next: NextFunction): void {
    const loginInfo = req.body;
    const validation = LoginService.validate(loginInfo);
    if (validation.error) throw validation.error;
    next();
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      const serviceResponse = await LoginService.login(email, password);
      res.status(serviceResponse.status).json(serviceResponse.data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
      }
    }
  }

  public static async getRole(req: Request, res: Response): Promise<void> {
    const role: string = await LoginService.getRole(res.locals.user as IUser);
    res.status(HTTP_STATUS.OK).json({ role });
  }
}
