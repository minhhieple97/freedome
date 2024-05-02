import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  AUTH_EMAIL_QUEUE_NAME,
  ORDER_EMAIL_QUEUE_NAME,
} from '@freedome/common';
import { Transport } from '@nestjs/microservices';
import { LoggerService } from '@freedome/common';
const logger = new LoggerService('Notifications Service');
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });
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
