import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AUTH_EMAIL_QUEUE_NAME, ORDER_EMAIL_QUEUE_NAME } from '@app/common';
import { Transport } from '@nestjs/microservices';
import { LoggerService } from '@app/common/logger/logger.service';
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
  await app.listen(3001);
}
bootstrap()
  .then(() => {
    logger.log('Notifications Service is up');
  })
  .catch(() =>
    logger.error('Something fail loading the notifications service'),
  );
