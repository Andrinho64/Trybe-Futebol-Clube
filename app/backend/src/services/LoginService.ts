import * as bcrypt from 'bcryptjs';
import * as Joi from 'joi';
import { CustomError, JwtService } from '../utils';
import UserModel from '../database/models/userModel';
import { ServiceMessage, ServiceResponse } from '../Interfaces/Service';
import loginSchema from '../schemas/loginSchema';
import { HTTP_STATUS, MSG } from '../configs/strings';
import { IUser } from '../Interfaces/IUser';

export default class LoginService {
  public static async login(email: string, password: string):
  Promise<ServiceResponse<{ token: string }, ServiceMessage>> {
    if (!email || !password) {
      return { status: HTTP_STATUS.BAD_REQUEST, data: { message: MSG.INVALID_EMAIL_OR_PASSWORD } };
    }

    const dbData = await UserModel.findOne({ attributes: ['id', 'password'], where: { email } });

    if (!dbData) {
      return { status: HTTP_STATUS.UNAUTHORIZED, data: { message: MSG.INVALID_EMAIL_OR_PASSWORD } };
    }

    if (!bcrypt.compareSync(password, dbData.dataValues.password)) {
      return { status: HTTP_STATUS.UNAUTHORIZED, data: { message: MSG.INVALID_EMAIL_OR_PASSWORD } };
    }

    const token: string = new JwtService().createToken({ email, id: dbData.dataValues.id });
    return { status: HTTP_STATUS.OK, data: { token } };
  }

  public static validate(loginInfo: { email: string, password: string })
    : Joi.ValidationResult<unknown> {
    return loginSchema.validate(loginInfo);
  }

  public static async getRole(user: IUser): Promise<string> {
    if (!user) {
      throw new CustomError(HTTP_STATUS.UNAUTHORIZED, MSG.INVALID_EMAIL_OR_PASSWORD);
    }
    const data: UserModel | null = await UserModel.findByPk(user.id, { attributes: ['role'] });
    return data?.dataValues.role || '';
  }
}
