import { Injectable } from '@nestjs/common';
import { ElasticsearchService as ElasticSearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(private readonly elasticsearchService: ElasticSearchService) {}
  checkElasticsearchConnection() {
    return this.elasticsearchService.ping();
  }
}
