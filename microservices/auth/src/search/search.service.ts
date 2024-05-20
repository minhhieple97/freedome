import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}
  public async createIndex() {
    // create index if doesn't exist
    try {
      const index = process.env.ELASTIC_INDEX;
      const checkIndex = await this.esService.indices.exists({ index });
      if (!checkIndex) {
        this.esService.indices.create({
          index,
        });
      }
    } catch (err) {}
  }
}
