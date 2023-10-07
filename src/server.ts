import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import HttpExceptionFilter from './core/base/frameworks/shared/filters/http.filter';
import ContextInterceptor from './core/base/frameworks/shared/interceptors/context.interceptor';
import log from './core/base/frameworks/shared/utils/log.util';
import ValidationPipe from './core/base/frameworks/shared/pipes/validation.pipe';
import otelSDK from './tracing';
import UnknownExceptionsFilter from '@/core/base/frameworks/shared/filters/unknown.filter';

const printConfig = () => {
  log.info(`Connected to Grafana Loki: ${appConfig.LOKI_HOST}`);
  log.info(`Connected to Grafana Tempo: ${appConfig.OTLP_URL}`);
  log.info(
    `Cookie Configuration => Samesite: ${appConfig.COOKIE_SAME_SITE}, Secure: ${
      appConfig.COOKIE_SECURE ? 'yes' : 'no'
    }, HTTP Only: ${appConfig.COOKIE_HTTP_ONLY ? 'yes' : 'no'}`,
  );
  log.info(`Environment App: ${appConfig.NODE_ENV}`);
  log.info(`Application Name: ${appConfig.APP_NAME}`);
  log.info(`JWT Expiration: ${appConfig.JWT_EXPIRES_IN}`);
  log.info(`Refresh JWT Expiration: ${appConfig.JWT_REFRESH_EXPIRES_IN}`);
};

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(AppModule);

    // Set prefix api globally
    app.setGlobalPrefix('api', { exclude: ['health', '/'] });

    // Enable CORS for security
    app.enableCors({
      credentials: true,
      origin: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    // Use Exception Filter
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );

    // Versioning of default URL V1
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });

    // Use Global Interceptors
    app.useGlobalInterceptors(new ContextInterceptor());

    // Use Cookie for http only
    app.use(cookieParser());

    if (appConfig.NODE_ENV == 'development') {
      const option = {
        customCss: `
        .topbar-wrapper img {content:url('https://aqbgvzzymp.cloudimg.io/v7/barokahabadi.co.id/wp-content/uploads/2020/11/dummy-logo-1b.png'); width:200px; height:auto;}
        .swagger-ui .topbar { background: #000; }`,
        customfavIcon: `https://aqbgvzzymp.cloudimg.io/v7/barokahabadi.co.id/wp-content/uploads/2020/11/dummy-logo-1b.png`,
        customSiteTitle: 'Backend API',
      };

      const config = new DocumentBuilder()
        .setTitle('Backend API')
        .setDescription('Backend API')
        .setVersion('1.0.0')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('/openapi', app, document, option);
    }

    const port = process.env.PORT ?? appConfig.APP_PORT;
    const host = process.env.HOST || '0.0.0.0';

    await app
      .listen(port, host)
      .then(() => log.info(`Nest app http started at PORT: ${port}`));

    printConfig();
    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  otelSDK.start();
  await Promise.all([httpServer]);
})();
