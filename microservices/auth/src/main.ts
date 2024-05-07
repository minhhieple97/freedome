import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { LoggerService } from '@freedome/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { AppConfigService } from '@auth/config/app/config.service';
const logger = new LoggerService('Auth Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app
    .connectMicroservice({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: appConfig.tcpPort },
    })
    .listen();
}
bootstrap();
