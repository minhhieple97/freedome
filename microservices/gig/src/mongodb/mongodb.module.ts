import { Gig } from './../gig.schema';
import { AppConfigModule } from '@gig/config/app/config.module';
import { AppConfigService } from '@gig/config/app/config.service';
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
        MongooseModule.forFeature([{ name: Gig.name, schema: Gig }]),
      ],
      exports: [MongooseModule],
      global: true,
    };
  }
}
