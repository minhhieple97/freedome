import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { join } from 'path';
import { AppConfigModule } from '@gateway/config/app/config.module';
import { AppConfigService } from '@gateway/config/app/config.service';
import { AuthService } from './auth.service';
import { AUTH_PACKAGE_NAME } from 'proto/types/auth';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: AUTH_PACKAGE_NAME,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../../proto/auth.proto'),
            url: appConfig.authGrpcUrl,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
