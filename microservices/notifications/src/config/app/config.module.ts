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
        ENABLE_APM: Joi.number().valid(0).required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'staging')
          .required(),
        CLIENT_URL: Joi.string().uri().required(),
        RABBITMQ_ENDPOINT: Joi.string().uri().required(),
        SENDER_EMAIL_HOST: Joi.string().required(),
        SENDER_EMAIL: Joi.string().required(),
        SENDER_EMAIL_PASSWORD: Joi.string().required(),
        SENDER_EMAIL_USERNAME: Joi.string().required(),
        SENDER_EMAIL_PORT: Joi.number().required(),
        ELASTIC_SEARCH_URL: Joi.string().uri().required(),
        ELASTIC_APM_SERVER_URL: Joi.string().uri().required(),
        ELASTIC_APM_SECRET_TOKEN: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
