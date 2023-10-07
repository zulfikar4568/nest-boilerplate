import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { logger } from '../utils/log.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;

    logger.info(
      `Request: ${method} - ${url} - ${ip}: Controller: (${
        context.getClass().name
      }) | Handler Route (${context.getHandler().name})`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.get('content-length');

        logger.info(
          `Respose: ${method} - ${url} - ${statusCode} - ${contentLength}: ${userAgent} ${ip} ${
            Date.now() - now
          }ms`,
        );

        logger.info(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
