import BaseResponse from './base.response';

interface IListSuccessResponse<T> {
  total: number;
  data: T[];
  page?: number;
  limit?: number;
}

export default class SuccessResponse<T = any> extends BaseResponse<
  T | IListSuccessResponse<T>
> {
  constructor(
    public message: string,
    result: T | IListSuccessResponse<T>,
    meta = {},
  ) {
    super(true, message, result, null, meta);
  }
}
