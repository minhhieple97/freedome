import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { AppConfigService } from '@auth/config/app/config.service';
import { AppConfigModule } from '@auth/config/app/config.module';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@freedome/common/module';
@Module({
  imports: [AppConfigModule, ElasticsearchModule],
  controllers: [SearchController],
  providers: [SearchService, AppConfigService],
  exports: [],
})
export class SearchModule {}
