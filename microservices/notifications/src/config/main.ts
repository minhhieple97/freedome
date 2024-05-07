import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  AUTH_EMAIL_QUEUE_NAME,
  ORDER_EMAIL_QUEUE_NAME,
  LoggerService,
} from '@freedome/common';
import { Transport } from '@nestjs/microservices';
import { NotificationModule } from '../notification.module';
import { AppConfigService } from '@notifications/config/app/config.service';
const logger = new LoggerService('Notifications Service');
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    NotificationModule,
    {
      logger,
    },
  );
  const appConfig: AppConfigService = app.get(AppConfigService);
  for (const queueName of [AUTH_EMAIL_QUEUE_NAME, ORDER_EMAIL_QUEUE_NAME]) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [appConfig.rabbitmqEndpoint],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    });
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
