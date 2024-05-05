import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { LoggerService } from '@freedome/common';
import { AppConfigService } from './config/app/config.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as hpp from 'hpp';
import { GlobalExcetionFilter } from './common/filters/global-exception.filter';
const logger = new LoggerService('APIGW Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule, {
    cors: true,
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.setGlobalPrefix('api/gateway/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(compression());
  app.use(helmet());
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '10mb' });
  app.useGlobalFilters(new GlobalExcetionFilter());
  app.use(hpp());
  if (appConfig.nodeEnv == 'development') {
    const options = new DocumentBuilder()
      .setTitle('API docs')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(appConfig.appPort);
}
bootstrap();
