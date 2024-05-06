import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ElasticsearchHealthIndicator } from './elasticsearch-health-indicator';
import { HealthController } from './health.controller';
import { ElasticsearchModule } from '@freedome/common/elasticsearch';
@Module({
  imports: [TerminusModule, ElasticsearchModule],
  controllers: [HealthController],
  providers: [ElasticsearchHealthIndicator],
})
export default class HealthModule {}
