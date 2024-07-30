import { Module } from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { AppConfigModule } from './config/app/config.module';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';

@Module({
  imports: [AppConfigModule, RabbitMQDynamicModule.forRootAsync()],
  controllers: [GigController],
  providers: [GigService],
})
export class GigModule {}
