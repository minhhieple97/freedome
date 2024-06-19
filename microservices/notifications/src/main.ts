import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  AUTH_EMAIL_QUEUE_NAME,
  ORDER_EMAIL_QUEUE_NAME,
  LoggerService,
} from '@freedome/common';
import { RabbitMqService } from '@freedome/common/module';
const logger = new LoggerService('Notifications Service');
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    NotificationModule,
    {
      logger,
    },
  );
  const rabbitMqService = app.get(RabbitMqService);
  for (const queueName of [AUTH_EMAIL_QUEUE_NAME, ORDER_EMAIL_QUEUE_NAME]) {
    app.connectMicroservice(rabbitMqService.getRmqOptions(queueName));
  }
  await app.startAllMicroservices();
}
bootstrap()
  .then(() => {
    logger.log('Notifications Service is up');
  })
  .catch(() =>
    logger.error('Something fail loading the notifications service'),
  );
