import { NestFactory } from '@nestjs/core';
import { GigModule } from './gig.module';
import { Transport } from '@nestjs/microservices';

import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService, SERVICE_NAME } from '@freedome/common';
import { join } from 'path';
import { AppConfigService } from './config/app/config.service';
const logger = new LoggerService('Gig Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GigModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.init();
  await app.startAllMicroservices();
  app
    .connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: SERVICE_NAME.GIG,
        protoPath: join(__dirname, '../../../../proto/gig.proto'),
        url: appConfig.gigGrpcUrl,
      },
    })
    .listen();
}
bootstrap();
