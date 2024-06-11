import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { RedisModule } from '@freedome/common/module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from './config/app/config.service';
@Module({
  imports: [
    AppConfigModule,
    RedisModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        uri: appConfigService.getMongoUri(),
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
