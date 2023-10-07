import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JsonWebTokenError } from 'jsonwebtoken';
import {
  IDecryptedJwt,
  cookieExtractor,
  decryptedDataUser,
} from '../shared/utils/jwt.util';
import { TCompactUser } from '../../domain/entities/auth.entity';
import appConfig from '@/config/app.config';

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest:
        fromExtractors([cookieExtractor, fromAuthHeaderAsBearerToken()]) ??
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.JWT_SECRET,
    });
  }

  async validate(jwt: IDecryptedJwt) {
    const customUser = await this.getCustomUser(jwt);

    return customUser;
  }

  private async getCustomUser(jwt: IDecryptedJwt): Promise<TCompactUser> {
    const user = decryptedDataUser(jwt.payload);

    if (!user) {
      throw new JsonWebTokenError('sub not valid');
    }

    return user;
  }
}
