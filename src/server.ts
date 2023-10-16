import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import HttpExceptionFilter from './core/base/frameworks/shared/filters/http.filter';
import ContextInterceptor from './core/base/frameworks/shared/interceptors/context.interceptor';
import log from './core/base/frameworks/shared/utils/log.util';
import ValidationPipe from './core/base/frameworks/shared/pipes/validation.pipe';
import otelSDK from './tracing';
import UnknownExceptionsFilter from '@/core/base/frameworks/shared/filters/unknown.filter';

const printConfig = () => {
  log.info(`Connected to Redis: ${appConfig.REDIS_URL}`);
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
      const option: SwaggerCustomOptions = {
        customCss: `
        .topbar-wrapper a {content: url('https://seeklogo.com/images/E/e-letter-digital-media-company-logo-03BA4A5AE3-seeklogo.com.png'); max-width: 150px !important; height:auto; margin-bottom: 0 !important; margin-top: 0 !important;}
        .topbar-wrapper a svg {display: none;}
        .swagger-ui .topbar { background: #fff !important; }`,
        customfavIcon: `https://seeklogo.com/images/E/e-letter-digital-media-company-logo-03BA4A5AE3-seeklogo.com.png`,
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
