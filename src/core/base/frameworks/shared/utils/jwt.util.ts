import ms from 'ms';
import * as jwt from 'jsonwebtoken';
import suuid from 'short-uuid';

import CryptoJS from 'crypto-js';
import { ExtractJwt } from 'passport-jwt';
import { TCompactUser } from '../../../domain/entities/auth.entity';
import { rand, sha512 } from './security.util';
import appConfig from '@/config/app.config';

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;
export interface IGeneratedJwt {
  refresh: string;
  token: string;
  expired: Date;
}

export interface IDecryptedJwt {
  payload: string;
  aud: string;
  iss: string;
  sub: string;
  exp: number;
  iat: number;
}

export const translator = suuid();

export const generateRefresh = async (): Promise<string> => {
  const randStr = await rand(64);
  const random = `${randStr}-${Date.now()}`;
  const refresh = await sha512(random);

  return refresh;
};

export const generateExpiredDateToken = (): Date => {
  const expIn = appConfig.JWT_EXPIRES_IN;

  return new Date(Date.now() + ms(expIn));
};

export const generateExpiredDateRefresh = (): Date => {
  const expIn = appConfig.JWT_REFRESH_EXPIRES_IN;

  return new Date(Date.now() + ms(expIn));
};

export const generateJwt = async ({
  origin,
  userId,
  user,
}: {
  origin: string;
  userId: string;
  user: TCompactUser;
}): Promise<IGeneratedJwt> => {
  const refresh = await generateRefresh();
  const token = jwt.sign(
    { payload: encryptedDataUser(user) },
    appConfig.JWT_SECRET,
    {
      expiresIn: appConfig.JWT_EXPIRES_IN,
      subject: translator.fromUUID(userId),
      audience: origin,
      issuer: `by_zulfikar:peradabatik.com`,
    },
  );

  const expired = generateExpiredDateToken();

  return {
    refresh,
    token,
    expired,
  };
};

export const jwtOptions = {
  jwtFromRequest: fromExtractors([
    cookieExtractor,
    fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: appConfig.JWT_SECRET,
  jwtCookieName: 'access-token',
};

export function cookieExtractor(req: any) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[jwtOptions.jwtCookieName];
  }
  return token;
}

export const encryptedDataUser = (user: TCompactUser) => {
  return encodeURIComponent(
    CryptoJS.AES.encrypt(
      JSON.stringify(user),
      appConfig.ECRYPTED_SECRET,
    ).toString(),
  );
};

export const decryptedDataUser = (secureData: string) => {
  const deData = CryptoJS.AES.decrypt(
    decodeURIComponent(secureData),
    appConfig.ECRYPTED_SECRET,
  );

  if (!isJsonString(deData.toString(CryptoJS.enc.Utf8))) {
    return null;
  }

  return JSON.parse(deData.toString(CryptoJS.enc.Utf8)) as TCompactUser;
};

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
