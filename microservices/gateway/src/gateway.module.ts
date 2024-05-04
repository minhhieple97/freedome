import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AppConfigModule } from './config/app/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from './config/app/config.service';
import { SERVICE_NAME } from '@freedome/common';
import { AuthController } from './auth.controller';
import { MessageController } from './message.controller';
import { ReviewController } from './review.controller';
import { SearchController } from './search.controller';
import { SellerController } from './seller.controller';
import { CurrentUserController } from './current-user.controller';
import { GigController } from './gig.controller';
import { OrderController } from './order.controller';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.NOTIFICATIONS,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.notificationsHost,
            port: appConfig.notificationsPort,
          },
        }),
        inject: [AppConfigService],
      },
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.AUTH,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.authHost,
            port: appConfig.authPort,
          },
        }),
        inject: [AppConfigService],
      },
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
        imports: [AppConfigModule],
        name: SERVICE_NAME.MESSAGE,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.messageHost,
            port: appConfig.messagePort,
          },
        }),
        inject: [AppConfigService],
      },
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.REVIEW,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.reviewHost,
            port: appConfig.reviewPort,
          },
        }),
        inject: [AppConfigService],
      },
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.ORDER,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.orderHost,
            port: appConfig.orderPort,
          },
        }),
        inject: [AppConfigService],
      },
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.SELLER,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.sellerHost,
            port: appConfig.sellerPort,
          },
        }),
        inject: [AppConfigService],
      },
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.SEARCH,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: appConfig.searchHost,
            port: appConfig.searchPort,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  controllers: [
    GatewayController,
    AuthController,
    MessageController,
    ReviewController,
    SearchController,
    SellerController,
    CurrentUserController,
    GigController,
    OrderController,
  ],
  providers: [GatewayService],
})
export class GatewayModule {}
