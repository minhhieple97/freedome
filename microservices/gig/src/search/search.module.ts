import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@freedome/common/module';
import { AppConfigModule } from '@gig/config/app/config.module';
import { SearchService } from './search.service';

@Module({
  imports: [ElasticsearchModule, AppConfigModule],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
