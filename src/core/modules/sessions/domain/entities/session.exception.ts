import {
  BadRequestException,
  NotFoundException,
} from '../../../../base/frameworks/shared/exceptions/common.exception';

export enum ESessionErrorCode {
  USER_NOT_FOUND = 'U404',
  WRONG_PASSWORD = 'S401',
  INVALID_REFRESH_TOKEN = 'S406',
  REFRESH_TOKEN_EXPIRED = 'S407',
  REFRESH_TOKEN_NOT_FOUND = 'S408',
}

export class RefreshTokenNotFound extends NotFoundException {
  constructor() {
    super({
      message:
        'please provide refresh token, or you request login first before proceed!',
      code: ESessionErrorCode.REFRESH_TOKEN_NOT_FOUND,
    });
  }
}

export class UserNotFound extends NotFoundException {
  constructor(params: { username: string }) {
    super({
      message: 'User not found!',
      code: ESessionErrorCode.USER_NOT_FOUND,
      params,
    });
  }
}

export class WrongPassword extends BadRequestException {
  constructor() {
    super({
      message: 'Wrong password!',
      code: ESessionErrorCode.WRONG_PASSWORD,
    });
  }
}

export class InvalidRefreshToken extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid refresh token!',
      code: ESessionErrorCode.INVALID_REFRESH_TOKEN,
    });
  }
}

export class RefreshTokenExpired extends BadRequestException {
  constructor(params: { expiredAt: string }) {
    super({
      message: `Refresh token expired since ${params.expiredAt}!`,
      code: ESessionErrorCode.REFRESH_TOKEN_EXPIRED,
      params,
    });
  }
}
