import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import BaseException from '../exceptions/base.exception';
import ErrorResponse from '../responses/error.response';

@Catch(BaseException)
export default class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status = exception.getHttpCode();
    const response = new ErrorResponse(
      exception.message,
      exception.getResponse(),
    );

    res.status(status).json(response);
  }
}
