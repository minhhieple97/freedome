import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { LoggerService, USER_BUYER_QUEUE_NAME } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from './config/app/config.service';
import { RabbitMqService } from '@freedome/common/module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from 'proto/types/user';
const logger = new LoggerService('User Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  const rabbitMqService = app.get(RabbitMqService);
  app.init();
  app.connectMicroservice(rabbitMqService.getRmqOptions(USER_BUYER_QUEUE_NAME));
  await app.startAllMicroservices();
  app
    .connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: USER_PACKAGE_NAME,
        protoPath: join(__dirname, '../../../../proto/user.proto'),
        url: appConfig.userGrpcUrl,
      },
    })
    .listen();
}
bootstrap();
