import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from '@redis/client';
import { redisStore } from 'cache-manager-redis-yet';
import HealthModule from './core/base/frameworks/health/health.module';
import AuthModule from './core/base/frameworks/auth/auth.module';
import { InstrumentMiddleware } from './core/base/frameworks/shared/middlewares/instrument.middleware';
import { logger } from './core/base/frameworks/shared/utils/log.util';
import { RegistrationModule } from './modules/registration.module';
import appConfig from './config/app.config';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

const PinoLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    customLogLevel: function (_, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'error';
      } else if (res.statusCode >= 500 || err) {
        return 'fatal';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'warn';
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        return 'info';
      }
      return 'debug';
    },
    logger,
  },
});

@Module({
  imports: [
    // framework
    TerminusModule,
    OpenTelemetryModuleConfig,
    PinoLoggerModule,
    HealthModule,
    AuthModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      ttl: appConfig.REDIS_TTL,
      url: appConfig.REDIS_URL,
    }),

    //bussines
    RegistrationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
