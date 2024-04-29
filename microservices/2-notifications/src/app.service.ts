import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from './config/elasticsearch/elasticsearch.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
