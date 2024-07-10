import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule } from './config/app/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigService } from '@auth/config/app/config.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from '@freedome/common/upload';
import { SearchModule } from './search/search.module';
import { EXCHANGE_NAME } from '@freedome/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQExchangeType } from '@freedome/common/enums';
@Module({
  imports: [
    SearchModule,
    AppConfigModule,
    PrismaModule,
    UploadModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => {
        return {
          secret: appConfigService.jwtToken,
        };
      },
      inject: [AppConfigService],
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        exchanges: [
          {
            name: EXCHANGE_NAME.EMAIL_NOTIFICATIONS,
            type: RabbitMQExchangeType.Direct,
          },
          {
            name: EXCHANGE_NAME.USER_BUYER,
            type: RabbitMQExchangeType.Direct,
          },
          {
            name: EXCHANGE_NAME.SELLER_REVIEW,
            type: RabbitMQExchangeType.Topic,
          },
        ],
        uri: appConfigService.rabbitmqEndpoint,
        connectionInitOptions: { wait: false },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AppConfigService],
})
export class AuthModule {}
