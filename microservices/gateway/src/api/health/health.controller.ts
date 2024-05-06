import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ElasticsearchHealthIndicator } from './elasticsearch-health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private elasticsearchHealthIndicator: ElasticsearchHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      // the process should not use more than 300MB memory
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () =>
        this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      () =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
      () => this.elasticsearchHealthIndicator.isHealthy('elasticsearch health'),
      // () => this.rabbitMqHealthIndicator.isHealthy('rabbitmq health'),
    ]);
  }
}
