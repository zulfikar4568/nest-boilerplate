import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import appConfig from './config/app.config';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  await app.listen(appConfig.APP_PORT).then(() => {
    logger.log(`Application running on port ${appConfig.APP_PORT}`);
  });
})();
