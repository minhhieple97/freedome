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
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
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
    RabbitMQDynamicModule.forRootAsync(),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AppConfigService],
})
export class AuthModule {}
