import { HttpException, HttpStatus } from '@nestjs/common';
import { IErrorResponse } from '../responses/error.response';

export default class BaseException extends HttpException {
  constructor(
    public httpStatus: HttpStatus,
    private code: string,
    public message: string,
    private params: Record<string, any> = {},
  ) {
    super(message, httpStatus);
  }

  public getHttpCode(): HttpStatus {
    return this.httpStatus;
  }

  public getResponse(): IErrorResponse {
    return {
      code: this.code,
      params: this.params,
    };
  }
}
