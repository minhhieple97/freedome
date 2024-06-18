import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { AUTH_EMAIL_QUEUE_NAME, LoggerService } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { AppConfigService } from '@auth/config/app/config.service';
import { join } from 'path';
import { RabbitMqService } from '@freedome/common/module';
import { AUTH_PACKAGE_NAME } from 'proto/types/auth';
const logger = new LoggerService('Auth Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  const rabbitMqService = app.get(RabbitMqService);
  app.init();
  for (const queueName of [AUTH_EMAIL_QUEUE_NAME]) {
    app.connectMicroservice(rabbitMqService.getRmqOptions(queueName));
  }
  app
    .connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: AUTH_PACKAGE_NAME,
        protoPath: join(__dirname, '../../../../proto/auth.proto'),
        url: appConfig.authGrpcUrl,
      },
    })
    .listen();
}
bootstrap();
