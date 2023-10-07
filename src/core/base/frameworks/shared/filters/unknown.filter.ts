import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UnknownException } from '../exceptions/common.exception';
import ErrorResponse from '../responses/error.response';
import log from '../utils/log.util';

@Catch()
export default class UnknownExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      log.fatal('Unhandled Error!', exception);
    } else {
      log.error('Known Error!', exception);
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const { status, response } = this.prepareException(exception);

    res.status(status).send(response);
  }

  private prepareException(exception: any): {
    status: HttpStatus;
    response: ErrorResponse;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const data = exception.getResponse();

      const errMessage =
        typeof data === 'object'
          ? (data as { error: string }).error || exception.message
          : exception.message;

      const response = new ErrorResponse(
        errMessage,
        typeof data === 'string'
          ? { code: '500', params: {} }
          : {
              code: '500',
              params: data,
            },
      );

      return { status, response };
    }

    const error = new UnknownException({
      message: exception.name ? exception.name : 'internal server error!',
      params: this.processSomeMessage(exception),
    });

    const status = error.getHttpCode();
    const response = new ErrorResponse(error.message, error.getResponse());

    return { status, response };
  }

  public processSomeMessage(exception: any) {
    if (typeof exception.message === 'string') {
      return exception.message;
    }
    return exception;
  }
}
