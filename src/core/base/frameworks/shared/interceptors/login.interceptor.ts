import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import SuccessResponse from '../responses/success.response';
import { generateExpiredDateRefresh } from '../utils/jwt.util';
import appConfig from '@/config/app.config';

export class LoginInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data: SuccessResponse) => {
        const response = context.switchToHttp().getResponse();
        const result = data.result;

        response.cookie('access-token', result.token, {
          expires: result.expiredAt,
          sameSite: appConfig.COOKIE_SAME_SITE,
          httpOnly: appConfig.COOKIE_HTTP_ONLY,
          secure: appConfig.COOKIE_SECURE,
        });

        response.cookie('refresh-token', result.refresh, {
          expires: generateExpiredDateRefresh(),
          sameSite: appConfig.COOKIE_SAME_SITE,
          httpOnly: appConfig.COOKIE_HTTP_ONLY,
          secure: appConfig.COOKIE_SECURE,
        });

        return data;
      }),
    );
  }
}
