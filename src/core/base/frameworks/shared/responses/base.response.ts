export default class BaseResponse<R = any, E = any> {
  constructor(
    public success: boolean,
    public message: string,
    public result: R,
    private error: E,
    public meta: any,
  ) {}

  public getResult(): R {
    return this.result;
  }

  public getError(): E {
    return this.error;
  }
}
