import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { LoggerService } from '@freedome/common';
import { AppConfigService } from './config/app/config.service';
const logger = new LoggerService('APIGW Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule, {
    cors: true,
    logger,
  });
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('api/gateway/v1');
  const appConfig: AppConfigService = app.get(AppConfigService);
  await app.listen(appConfig.appPort);
}
bootstrap();
