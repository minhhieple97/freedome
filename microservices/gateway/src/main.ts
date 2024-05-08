import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { LoggerService } from '@freedome/common';
import { AppConfigService } from './config/app/config.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as hpp from 'hpp';
const logger = new LoggerService('APIGW Service');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule, {
    logger,
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.setGlobalPrefix('api/gateway/v1');
  app.enableCors({
    origin: appConfig.clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
    }),
  );
  app.use(compression());
  app.use(helmet());
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '10mb' });
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
