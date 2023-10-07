import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';
import { DataServiceModule } from './services/data-services/data-service.module';
import { DashboardUseCaseModule } from './usecases/dashboards/dashboard.usecase.module';
import { MessagingServiceModule } from './services/messaging-services/messaging.service.module';
import { DashboardController } from './controllers';
import HealthModule from './frameworks/health/health.module';
import AuthModule from './frameworks/auth/auth.module';
import { InstrumentMiddleware } from './frameworks/shared/middlewares/instrument.middleware';
import { logger } from './frameworks/shared/utils/log.util';

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
    MessagingServiceModule,
    HealthModule,
    AuthModule,

    //bussines
    DataServiceModule,
    DashboardUseCaseModule,
  ],
  controllers: [DashboardController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
