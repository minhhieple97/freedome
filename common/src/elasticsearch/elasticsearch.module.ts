import { Module } from '@nestjs/common';
import { ElasticsearchModule as ElasticSearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [
    ElasticSearchModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        node: process.env.ELASTIC_SEARCH_URL,
      }),
      inject: [],
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
