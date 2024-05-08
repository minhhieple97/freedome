import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule } from './config/app/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_EMAIL_QUEUE_NAME, SERVICE_NAME } from '@freedome/common';
import { AppConfigService } from '@auth/config/app/config.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
})
export class AuthModule {}
