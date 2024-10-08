import { NestFactory } from '@nestjs/core';
import { GigModule } from './gig.module';
import { Transport } from '@nestjs/microservices';

import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from '@freedome/common';
import { AppConfigService } from './config/app/config.service';
const logger = new LoggerService('Gig Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GigModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.init();
  await app.startAllMicroservices();
  await app
    .connectMicroservice({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: appConfig.tcpPort },
    })
    .listen();
}
bootstrap();
