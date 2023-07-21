import { HttpStatus } from '@nestjs/common';
import BaseException from './base.exception';

export enum EErrorCommonException {
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  INTERNAL_SERVER_ERROR = '500',
}

export class BadRequestException extends BaseException {
  constructor(payload?: {
    message?: string;
    code?: string;
    params?: Record<string, any>;
  }) {
    super(
      HttpStatus.BAD_REQUEST,
      payload?.code || EErrorCommonException.BAD_REQUEST,
      payload?.message || 'bad request!',
      payload?.params || {},
    );
  }
}
