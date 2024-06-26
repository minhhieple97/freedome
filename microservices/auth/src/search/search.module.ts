import { Module, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';
import { AppConfigService } from '@auth/config/app/config.service';
import { AppConfigModule } from '@auth/config/app/config.module';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@freedome/common/module';
@Module({
  imports: [AppConfigModule, ElasticsearchModule],
  controllers: [SearchController],
  providers: [AppConfigService, SearchService],
  exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
