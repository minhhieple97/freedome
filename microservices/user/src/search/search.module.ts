import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { AppConfigService } from '@auth/config/app/config.service';
import { AppConfigModule } from '@auth/config/app/config.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchController } from './search.controller';
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
  controllers: [SearchController],
  providers: [SearchService, AppConfigService],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
