import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import SuccessResponse from '../responses/success.response';

export class LogoutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data: SuccessResponse) => {
        const response = context.switchToHttp().getResponse();
        response.clearCookie('access-token', { httpOnly: true });
        response.clearCookie('refresh-token', { httpOnly: true });

        return data;
      }),
    );
  }
}
