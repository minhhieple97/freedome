import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { HealthController } from './api/health/health.controller';
import { ElasticsearchModule } from './config/elasticsearch/elasticsearch.module';
import { WinstonModule } from 'nest-winston';
@Module({
  imports: [
    AppConfigModule,
    ElasticsearchModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({}),
      inject: [],
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
