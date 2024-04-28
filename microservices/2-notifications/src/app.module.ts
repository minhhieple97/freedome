import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { HealthController } from './api/health/health.controller';
import { ElasticsearchModule } from './config/elasticsearch/elasticsearch.module';

@Module({
  imports: [AppConfigModule, ElasticsearchModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
