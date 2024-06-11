import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { LoggerService } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
const logger = new LoggerService('User Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule, {
    logger,
  });
  app.init();
}
bootstrap();
