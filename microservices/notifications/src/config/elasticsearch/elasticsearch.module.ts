import { Module } from '@nestjs/common';
import { ElasticsearchModule as ElasticSearchModule } from '@nestjs/elasticsearch';
import { AppConfigModule } from '../app/config.module';
import { AppConfigService } from '../app/config.service';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [
    ElasticSearchModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        node: appConfigService.elasticSearchUrl,
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
