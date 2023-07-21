import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import HttpExceptionFilter from './frameworks/shared/filters/http.filter';
import ContextInterceptor from './frameworks/shared/interceptors/context.interceptor';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  // Set prefix api globally
  app.setGlobalPrefix('api');

  // Enable CORS for security
  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  // Versioning of default URL V1
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // Use Global Interceptors
  app.useGlobalInterceptors(new ContextInterceptor());

  await app.listen(appConfig.APP_PORT).then(() => {
    logger.log(`Application running on port ${appConfig.APP_PORT}`);
  });
})();
