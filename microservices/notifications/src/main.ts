import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from '@freedome/common';
const logger = new LoggerService('Notifications Service');
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    NotificationModule,
    {
      logger,
    },
  );
  await app.listen(8888);
}
bootstrap()
  .then(() => {
    logger.log('Notifications Service is up');
  })
  .catch(() =>
    logger.error('Something fail loading the notifications service'),
  );
