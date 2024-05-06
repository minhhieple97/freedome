import { ElasticsearchService } from '@freedome/common/elasticsearch';
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

@Injectable()
export class ElasticsearchHealthIndicator extends HealthIndicator {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.elasticsearchService.checkElasticsearchConnection();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'ElasticsearchHealthIndicator failed',
        this.getStatus(key, false),
      );
    }
  }
}
