import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { winstonLogger } from '@app/common';
import { WinstonModule } from 'nest-winston';
import { Transport } from '@nestjs/microservices';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    logger: WinstonModule.createLogger({
      instance: winstonLogger('Notifications Service', 'debug'),
    }),
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [appConfig.rabbitmqEndpoint],
      queue: 'cats_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(helmet());
  await app.listen(appConfig.appPort);
}
bootstrap()
  .then(() => {
    console.log('Done');
  })
  .catch(() => new Error('Something fail loading the app'));
