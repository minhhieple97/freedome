import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AppConfigModule } from './config/app/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
