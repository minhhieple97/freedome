import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AppConfigModule } from './config/app/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from './config/app/config.service';
import { NOTIFICATIONS_SERVICE } from '@freedome/common';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: NOTIFICATIONS_SERVICE,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.notificationsHost,
            port: appConfig.notificationsPort,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
