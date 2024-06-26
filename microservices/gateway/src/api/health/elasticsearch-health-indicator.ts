import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
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
      await this.elasticsearchService.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'ElasticsearchHealthIndicator failed',
        this.getStatus(key, false),
      );
    }
  }
}
