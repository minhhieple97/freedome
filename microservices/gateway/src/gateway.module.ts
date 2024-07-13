import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { Transport } from '@nestjs/microservices';
import { AppConfigService } from './config/app/config.service';
import { SERVICE_NAME } from '@freedome/common';
import HealthModule from './api/health/health.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/user.module';
import { USER_PACKAGE_NAME } from 'proto/types/user';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from 'proto/types/auth';
import { GrpcClientModule } from '@freedome/common/module/grpc-client/grpc-client.module';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    HealthModule,
    SearchModule,
    UserModule,
    GrpcClientModule.registerAsync([
      {
        name: USER_PACKAGE_NAME,
        imports: [AppConfigModule],
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: SERVICE_NAME.USER,
            protoPath: join(__dirname, '../../../../proto/user.proto'),
            url: appConfig.userGrpcUrl,
          },
        }),
        inject: [AppConfigService],
      },
      {
        name: AUTH_PACKAGE_NAME,
        imports: [AppConfigModule],
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: SERVICE_NAME.AUTH,
            protoPath: join(__dirname, '../../../../proto/auth.proto'),
            url: appConfig.authGrpcUrl,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  controllers: [],
})
export class GatewayModule {}
