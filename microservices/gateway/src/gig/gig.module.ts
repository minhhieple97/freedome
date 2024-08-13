import { Module } from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { SERVICE_NAME } from '@freedome/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from '@gateway/config/app/config.service';
import { AppConfigModule } from '@gateway/config/app/config.module';
import { GIG_PACKAGE_NAME } from 'proto/types/gig';
import { join } from 'path';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.GIG,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.gigHost,
            port: appConfig.gigPort,
          },
        }),
        inject: [AppConfigService],
      },
      {
        name: GIG_PACKAGE_NAME,
        imports: [AppConfigModule],
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: SERVICE_NAME.GIG,
            protoPath: join(__dirname, '../../../../proto/gig.proto'),
            url: appConfig.gigGrpcUrl,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  controllers: [GigController],
  providers: [GigService],
})
export class GigModule {}
