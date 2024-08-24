import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from './config/app/config.service';
import { RedisIoAdapter } from './config/socket/socket.adapter';
import { LoggerService } from '@freedome/common';
const logger = new LoggerService('Chat Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ChatModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(appConfig.appPort);
}
bootstrap();
