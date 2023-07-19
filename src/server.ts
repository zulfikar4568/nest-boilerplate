import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  await app.listen(3000).then(() => {
    logger.log('Application running on port 3000');
  });
})();
