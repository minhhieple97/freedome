import { AppConfigModule } from '@chat/config/app/config.module';
import { AppConfigService } from '@chat/config/app/config.service';
import { User, UserSchema } from '@freedome/common';
import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({})
export class MongoDBModule {
  static forRootAsync(): DynamicModule {
    return {
      module: MongoDBModule,
      imports: [
        AppConfigModule,
        MongooseModule.forRootAsync({
          imports: [AppConfigModule],
          useFactory: async (
            appConfigService: AppConfigService,
          ): Promise<MongooseModuleOptions> => ({
            uri: appConfigService.mongoUri,
          }),
          inject: [AppConfigService],
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      exports: [MongooseModule],
      global: true,
    };
  }
}
