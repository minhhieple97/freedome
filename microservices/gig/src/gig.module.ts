import { Module } from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { AppConfigModule } from './config/app/config.module';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
import {
  ElasticsearchModule,
  RedisCacheService,
  RedisModule,
} from '@freedome/common/module';
import { SearchModule } from './search/search.module';
import { SearchService } from './search/search.service';
import { MongoDBModule } from './mongodb/mongodb.module';
import { UploadService } from '@freedome/common/upload';

@Module({
  imports: [
    ElasticsearchModule,
    SearchModule,
    AppConfigModule,
    RabbitMQDynamicModule.forRootAsync(),
    MongoDBModule.forRootAsync(),
    RedisModule,
  ],
  controllers: [GigController],
  providers: [GigService, SearchService, RedisCacheService, UploadService],
})
export class GigModule {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
