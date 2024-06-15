import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  ElasticsearchModuleOptions,
  ElasticsearchOptionsFactory,
} from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
  constructor(private configService: ConfigService) {}
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return {
      node: this.configService.get('ELASTIC_SEARCH_URL'),
    };
  }
}
