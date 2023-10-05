import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OptionalUser } from '@/core/entities';

export interface IContextParams {
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
}

export interface IContext {
  headers: Record<string, any>;
  user: OptionalUser;
  accessToken?: string;
  refreshToken?: string;
  params: IContextParams;
}

export default class ContextInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: any;
        params: Record<string, any>;
        query: Record<string, any>;
        cookies: Record<string, any>;
        customContext: IContext;
      }
    >();

    // It's must be implement the cookies parser, otherwise will error

    const context: IContext = {
      headers: request.headers,
      user: request.user,
      params: {
        params: request.params,
        query: request.query,
        body: request.body as Record<string, any>,
      },
      accessToken:
        request.cookies['access-token'] === undefined
          ? undefined
          : request.cookies['access-token'],
      refreshToken:
        request.cookies['refresh-token'] === undefined
          ? undefined
          : request.cookies['refresh-token'],
    };

    request.customContext = context;

    return next.handle();
  }
}
