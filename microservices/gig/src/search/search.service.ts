import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ISellerGig, LoggerService } from '@freedome/common';
import { GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { AppConfigService } from '@gig/config/app/config.service';

@Injectable()
export class SearchService {
  private readonly logger = new LoggerService(SearchService.name);
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly appConfigService: AppConfigService,
  ) {}
  private readonly gigIndex = this.appConfigService.gigElasticSearchIndex;
  public async createIndex() {
    const checkIndex = await this.esService.indices.exists({
      index: this.gigIndex,
    });
    this.logger.log(`Index ${this.gigIndex} already exists`);
    if (!checkIndex) {
      this.logger.log(`Created index ${this.gigIndex}`);
      await this.esService.indices.create({
        index: this.gigIndex,
      });
      await this.esService.indices.refresh({
        index: this.gigIndex,
      });
    }
  }
  async getIndexedData(index: string, itemId: string): Promise<ISellerGig> {
    try {
      const result: GetResponse = await this.esService.get({
        index,
        id: itemId,
      });
      return result._source as ISellerGig;
    } catch (error) {
      this.logger.error(
        'GigService elasticsearch getIndexedData() method error:',
        error,
      );
      return {} as ISellerGig;
    }
  }
  async updateIndexedData(
    index: string,
    itemId: string,
    gigDocument: unknown,
  ): Promise<void> {
    try {
      await this.esService.update({
        index,
        id: itemId,
        doc: gigDocument,
      });
    } catch (error) {
      this.logger.error(
        'GigService elasticsearch updateIndexedData() method error:',
        error,
      );
    }
  }
  async deleteIndexedData(index: string, itemId: string): Promise<void> {
    try {
      await this.esService.delete({
        index,
        id: itemId,
      });
    } catch (error) {
      this.logger.error(
        'GigService elasticsearch deleteIndexedData() method error:',
        error,
      );
    }
  }
}
