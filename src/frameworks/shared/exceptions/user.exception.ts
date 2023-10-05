import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@/frameworks/shared/exceptions/common.exception';

export enum ESiteErrorCode {
  USER_NOT_FOUND = 'U404',
  DUPLICATE_USER = 'U402',
  PASSWORD_NOT_MATCH = 'U401',
}

export class DeleteUnauthorized extends UnauthorizedException {
  constructor(params: { username: string }) {
    super({
      message: `You can't delete your self!`,
      code: ESiteErrorCode.USER_NOT_FOUND,
      params,
    });
  }
}

export class UserNotFound extends NotFoundException {
  constructor(params: { id: string }) {
    super({
      message: `User dengan Id ${params.id} tidak ditemukan!`,
      code: ESiteErrorCode.USER_NOT_FOUND,
      params,
    });
  }
}

export class DuplicateUser extends NotFoundException {
  constructor(params: { username: string }) {
    super({
      message: `User dengan username ${params.username} sudah ada!`,
      code: ESiteErrorCode.DUPLICATE_USER,
      params,
    });
  }
}

export class PasswordIsNotMatch extends BadRequestException {
  constructor(params: { message: string }) {
    super({
      message: 'Password tidak matches!',
      code: ESiteErrorCode.PASSWORD_NOT_MATCH,
      params,
    });
  }
}
