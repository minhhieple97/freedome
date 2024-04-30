import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { HealthController } from './api/health/health.controller';
import { ElasticsearchModule } from './config/elasticsearch/elasticsearch.module';
import { WinstonModule } from 'nest-winston';
import { AppService } from './app.service';
import { EmailModule } from './consumers/email/email.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    AppConfigModule,
    ElasticsearchModule,
    EmailModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({}),
      inject: [],
    }),
  ],
  controllers: [HealthController, AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
