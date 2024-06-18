import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule as ElasticSearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchConfigService } from './elasticsearch.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    ElasticSearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  providers: [],
  exports: [ElasticSearchModule],
})
export class ElasticsearchModule {}
