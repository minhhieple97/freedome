import { ElasticsearchModule } from '@freedome/common/elasticsearch';
import { Module, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';
@Module({
  imports: [ElasticsearchModule],
  controllers: [],
  providers: [],
  exports: [ElasticsearchModule],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
