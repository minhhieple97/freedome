import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { LoggerService, SERVICE_NAME } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { AppConfigService } from '@auth/config/app/config.service';
import { join } from 'path';
const logger = new LoggerService('Auth Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app
    .connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: SERVICE_NAME.AUTH,
        protoPath: join(__dirname, '../../../../proto/auth.proto'),
        url: appConfig.authGrpcUrl,
      },
    })
    .listen();
}
bootstrap();
