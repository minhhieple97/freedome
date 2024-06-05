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
        RABBITMQ_ENDPOINT: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_S3_REGION: Joi.string().required(),
        AWS_BUCKET_S3_NAME: Joi.string().required(),
        GIG_ELASTIC_SEARCH_INDEX: Joi.string().required(),
        ELASTIC_SEARCH_URL: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
