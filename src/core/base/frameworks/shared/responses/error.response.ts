import BaseResponse from './base.response';

export interface IErrorResponse {
  code: string;
  params: Record<string, string>;
}

export default class ErrorResponse extends BaseResponse<null, IErrorResponse> {
  constructor(
    public message: string,
    error: IErrorResponse,
  ) {
    super(false, message, null, error, {});
  }
}
