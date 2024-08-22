import { Module } from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { AppConfigModule } from './config/app/config.module';
import { RabbitMQDynamicModule } from '@freedome/common/module/rabbitmq';
import { ElasticsearchModule, RedisModule } from '@freedome/common/module';
import { SearchModule } from './search/search.module';
import { SearchService } from './search/search.service';
import { MongoDBModule } from './mongodb/mongodb.module';
import { UploadService } from '@freedome/common/upload';
import { UserService } from './user/user.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    ElasticsearchModule,
    SearchModule,
    AppConfigModule,
    RabbitMQDynamicModule.forRootAsync(),
    MongoDBModule.forRootAsync(),
    RedisModule,
    CategoryModule,
  ],
  controllers: [GigController],
  providers: [GigService, SearchService, UploadService, UserService],
})
export class GigModule {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
