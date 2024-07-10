import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { LoggerService } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from './config/app/config.service';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from 'proto/types/user';
const logger = new LoggerService('User Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.init();
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
