import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AppConfigModule } from '@user/config/app/config.module';
import { AppConfigService } from '@user/config/app/config.service';
import { Seller, SellerSchema } from '../seller/seller.schema';
import { Buyer, BuyerSchema } from '../buyer/buyer.schema';

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
        MongooseModule.forFeature([
          { name: Seller.name, schema: SellerSchema },
          { name: Buyer.name, schema: BuyerSchema },
        ]),
      ],
      exports: [MongooseModule],
      global: true,
    };
  }
}
