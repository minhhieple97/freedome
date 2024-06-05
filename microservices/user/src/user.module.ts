import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './config/app/config.module';
import { AppConfigService } from './config/app/config.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        uri: appConfigService.getMongoUri(),
      }),
      inject: [AppConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (appConfigService: AppConfigService) => ({
        store: await redisStore({
          socket: {
            host: appConfigService.getRedisHost(),
            port: appConfigService.getRedisPort(),
          },
          password: appConfigService.getRedisPassword(),
        }),
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
