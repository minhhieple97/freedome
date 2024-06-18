import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppConfigModule } from '@gateway/config/app/config.module';
import { AppConfigService } from '@gateway/config/app/config.service';
import { USER_PACKAGE_NAME } from 'proto/types/user';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        name: USER_PACKAGE_NAME,
        useFactory: (appConfig: AppConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../../proto/user.proto'),
            url: appConfig.userGrpcUrl,
          },
        }),
        inject: [AppConfigService],
      },
    ]),
  ],
  providers: [],
  controllers: [],
})
export class UserModule {}
