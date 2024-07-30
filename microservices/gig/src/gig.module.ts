import { Module } from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { AppConfigModule } from './config/app/config.module';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
import { ElasticsearchModule } from '@freedome/common/module';

@Module({
  imports: [
    ElasticsearchModule,
    AppConfigModule,
    RabbitMQDynamicModule.forRootAsync(),
  ],
  controllers: [GigController],
  providers: [GigService],
})
export class GigModule {
  constructor(private readonly gigService: GigService) {}
  public async onModuleInit() {
    await this.gigService.createIndex();
  }
}
