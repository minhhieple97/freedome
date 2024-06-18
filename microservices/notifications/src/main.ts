import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { AppConfigService } from './config/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  AUTH_EMAIL_QUEUE_NAME,
  ORDER_EMAIL_QUEUE_NAME,
  LoggerService,
} from '@freedome/common';
import { Transport } from '@nestjs/microservices';
import { RabbitMqService } from '@freedome/common/module';
const logger = new LoggerService('Notifications Service');
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    NotificationModule,
    {
      logger,
    },
  );
  const appConfig: AppConfigService = app.get(AppConfigService);
  const rabbitMqService = app.get(RabbitMqService);
  for (const queueName of [AUTH_EMAIL_QUEUE_NAME, ORDER_EMAIL_QUEUE_NAME]) {
    app.connectMicroservice(rabbitMqService.getRmqOptions(queueName));
  }
  await app.startAllMicroservices();
  app
    .connectMicroservice({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: appConfig.tcpPort },
    })
    .listen();
}
bootstrap()
  .then(() => {
    logger.log('Notifications Service is up');
  })
  .catch(() =>
    logger.error('Something fail loading the notifications service'),
  );
