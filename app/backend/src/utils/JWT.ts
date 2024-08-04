import { sign, verify, JwtPayload, SignOptions } from 'jsonwebtoken';

type TokenPayload = {
  id: number,
  email: string,
};
export default class JwtService {
  private readonly secret: string;
  private readonly signOptions: SignOptions = { algorithm: 'HS256', expiresIn: '1h' };

  constructor(secret?: string) {
    this.secret = secret || process.env.JWT_SECRET || 'default_secret_key';
  }

  public createToken(payload: TokenPayload): string {
    return sign(payload, this.secret, this.signOptions);
  }

  public verifyToken(token: string): JwtPayload | string {
    return verify(token, this.secret);
  }
}
