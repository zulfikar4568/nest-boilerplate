import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Span } from 'nestjs-otel';

@Injectable()
export class InstrumentMiddleware implements NestMiddleware {
  @Span('Instrument Middleware')
  use(_req: Request, _res: Response, next: NextFunction) {
    next();
  }
}
