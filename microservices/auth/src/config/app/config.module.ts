import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'staging')
          .required(),
        CLIENT_URL: Joi.string().uri().required(),
        JWT_TOKEN: Joi.string().required(),
        GATEWAY_JWT_TOKEN: Joi.string().required(),
        SECRET_KEY_ONE: Joi.string().required(),
        SECRET_KEY_TWO: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_ENDPOINT: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
