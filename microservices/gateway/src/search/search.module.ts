import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTOBUF_PACKAGE, SERVICE_NAME } from '@freedome/common';
import { join } from 'path';
import { AppConfigModule } from '@gateway/config/app/config.module';
import { AppConfigService } from '@gateway/config/app/config.service';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.AUTH,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: PROTOBUF_PACKAGE.AUTH,
            protoPath: join(__dirname, '../../../../proto/auth.proto'),
            url: appConfig.authGrpcUrl,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [],
})
export class SearchModule {}
