import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { winstonLogger } from '@app/common';
import { WinstonModule } from 'nest-winston';
import { Transport } from '@nestjs/microservices';
import {
  AUTH_EMAIL_QUEUE_NAME,
  ORDER_EMAIL_QUEUE_NAME,
} from './common/constants/constants';
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger('Notifications Service', 'debug'),
    }),
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
    console.log('Done');
  })
  .catch(() => new Error('Something fail loading the app'));
