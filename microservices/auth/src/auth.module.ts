import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule } from './config/app/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_EMAIL_QUEUE_NAME,
  SERVICE_NAME,
  USER_BUYER_QUEUE_NAME,
} from '@freedome/common';
import { AppConfigService } from '@auth/config/app/config.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from '@freedome/common/upload';
import { SearchModule } from './search/search.module';
import { RabbitModule } from '@freedome/common/module';

@Module({
  imports: [
    SearchModule,
    AppConfigModule,
    PrismaModule,
    UploadModule,
    RabbitModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => {
        return {
          secret: appConfigService.jwtToken,
        };
      },
      inject: [AppConfigService],
    }),
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.NOTIFICATIONS,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [appConfig.rabbitmqEndpoint],
            queue: AUTH_EMAIL_QUEUE_NAME,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [AppConfigService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: SERVICE_NAME.USER,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [appConfig.rabbitmqEndpoint],
            queue: USER_BUYER_QUEUE_NAME,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AppConfigService],
})
export class AuthModule {}
