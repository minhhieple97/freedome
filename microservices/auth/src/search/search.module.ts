import { Module, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';
import { AppConfigService } from '@auth/config/app/config.service';
import { AppConfigModule } from '@auth/config/app/config.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    AppConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        node: appConfigService.elasticSearchUrl,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [],
  providers: [SearchService, AppConfigService],
  exports: [ElasticsearchModule],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
