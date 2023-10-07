import { HttpStatus } from '@nestjs/common';

import BaseException from './base.exception';

export enum EErrorCommonCode {
  BAD_REQUEST = 'C400',
  UNAUTHORIZED = 'C401',
  FORBIDDEN = 'C403',
  NOT_FOUND = 'C404',
  INTERNAL_SERVER_ERROR = 'C500',
  DUPLICATE = 'C409',
}

export class DuplicateException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.CONFLICT,
      payload?.code || EErrorCommonCode.DUPLICATE,
      payload?.message || 'Duplicate!',
      payload?.params || {},
    );
  }
}

export class BadRequestException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.BAD_REQUEST,
      payload?.code || EErrorCommonCode.BAD_REQUEST,
      payload?.message || 'Bad request!',
      payload?.params || {},
    );
  }
}

export class UnauthorizedException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.UNAUTHORIZED,
      payload?.code || EErrorCommonCode.UNAUTHORIZED,
      payload?.message || 'Unauthorized!',
      payload?.params || {},
    );
  }
}

export class ForbiddenException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.FORBIDDEN,
      payload?.code || EErrorCommonCode.FORBIDDEN,
      payload?.message || 'Forbidden!',
      payload?.params || {},
    );
  }
}

export class NotFoundException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.NOT_FOUND,
      payload?.code || EErrorCommonCode.NOT_FOUND,
      payload?.message || 'Not found!',
      payload?.params || {},
    );
  }
}

export class UnknownException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      payload?.code || EErrorCommonCode.INTERNAL_SERVER_ERROR,
      payload?.message || 'Internal server error!',
      payload?.params || {},
    );
  }
}
