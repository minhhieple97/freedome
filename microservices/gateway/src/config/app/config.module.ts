import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { AppConfigService } from './config.service';
import { DEFAULT_PORT } from '../../common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(DEFAULT_PORT),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'staging')
          .required(),
        CLIENT_URL: Joi.string().uri().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        MESSAGE_HOST: Joi.string().required(),
        MESSAGE_PORT: Joi.number().required(),
        REVIEW_HOST: Joi.string().required(),
        REVIEW_PORT: Joi.number().required(),
        ORDER_HOST: Joi.string().required(),
        ORDER_PORT: Joi.number().required(),
        SELLER_HOST: Joi.string().required(),
        SELLER_PORT: Joi.number().required(),
        SEARCH_HOST: Joi.string().required(),
        SEARCH_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        GIG_HOST: Joi.string().required(),
        GIG_PORT: Joi.number().required(),
        JWT_TOKEN: Joi.string().required(),
        GATEWAY_JWT_TOKEN: Joi.string().required(),
        SECRET_KEY_ONE: Joi.string().required(),
        SECRET_KEY_TWO: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
