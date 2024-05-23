import { AppConfigService } from '@auth/config/app/config.service';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { uniqueId } from 'lodash';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly appConfigService: AppConfigService,
  ) {}
  public async createIndex() {
    const gigIndex = this.appConfigService.gigElasticSearchIndex;
    const checkIndex = await this.esService.indices.exists({
      index: gigIndex,
    });
    if (!checkIndex) {
      await this.esService.indices.create({
        index: gigIndex,
      });
    }
  }
  public async indexData(payload: any) {
    const gigIndex = this.appConfigService.gigElasticSearchIndex;
    return await this.esService.index({
      index: gigIndex,
      id: uniqueId(),
      body: payload,
    });
  }
}
