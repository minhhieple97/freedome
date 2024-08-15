import { Module } from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { SERVICE_NAME } from '@freedome/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from '@gateway/config/app/config.service';
import { AppConfigModule } from '@gateway/config/app/config.module';

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
    ]),
  ],
  controllers: [GigController],
  providers: [GigService],
})
export class GigModule {}
