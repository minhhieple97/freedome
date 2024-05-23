import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {
  AUTH_EMAIL_QUEUE_NAME,
  LoggerService,
  PROTOBUF_PACKAGE,
} from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { AppConfigService } from '@auth/config/app/config.service';
import { LoggerInterceptor } from '@freedome/common/interceptors';
import { GlobalExcetionFilter } from './common/filters/global-exception.filter';
import { join } from 'path';
const logger = new LoggerService('Auth Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.useGlobalFilters(new GlobalExcetionFilter(appConfig));
  app.useGlobalInterceptors(new LoggerInterceptor());
  for (const queueName of [AUTH_EMAIL_QUEUE_NAME]) {
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
  app
    .connectMicroservice({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: appConfig.tcpPort },
    })
    .listen();
  app
    .connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: PROTOBUF_PACKAGE.AUTH,
        protoPath: join(__dirname, '../../../../proto/auth.proto'),
        url: appConfig.authGrpcUrl,
      },
    })
    .listen();
}
bootstrap();
