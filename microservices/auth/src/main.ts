import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { AUTH_EMAIL_QUEUE_NAME, LoggerService } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { AppConfigService } from '@auth/config/app/config.service';
import { LoggerInterceptor } from '@freedome/common/interceptors';
const logger = new LoggerService('Auth Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
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
}
bootstrap();