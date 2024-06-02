import { SearchDtoParam } from '@auth/common/dtos';
import { AppConfigService } from '@auth/config/app/config.service';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import {
  IHitsTotal,
  IQueryList,
  ISearchResult,
  ISellerGig,
  LoggerService,
} from '@freedome/common';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { uniqueId } from 'lodash';
import { SearchGigsRequest } from 'proto/types';

@Injectable()
export class SearchService {
  private readonly logger = new LoggerService(SearchService.name);
  private readonly gigIndex = this.appConfigService.gigElasticSearchIndex;
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly appConfigService: AppConfigService,
  ) {}
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
  public async search(searchParam: SearchDtoParam): Promise<ISellerGig> {
    const { index, gigId } = searchParam;
    const { _source } = await this.esService.get({
      index,
      id: gigId,
    });
    return _source as ISellerGig;
  }
  async gigsSearch(
    searchGigsRequest: SearchGigsRequest,
  ): Promise<ISearchResult> {
    const { searchQuery, deliveryTime, min, max, size, type, from } =
      searchGigsRequest;
    const queryList: IQueryList[] = [
      {
        query_string: {
          fields: [
            'username',
            'title',
            'description',
            'basicDescription',
            'basicTitle',
            'categories',
            'subCategories',
            'tags',
          ],
          query: `*${searchQuery}*`,
        },
      },
      {
        term: {
          active: true,
        },
      },
    ];

    if (deliveryTime) {
      queryList.push({
        query_string: {
          fields: ['expectedDelivery'],
          query: `*${deliveryTime}*`,
        },
      });
    }
    const priceRange = {} as { gte?: number; lte?: number };
    if (Number.isInteger(min) && min >= 0) {
      priceRange.gte = min;
    }
    if (Number.isInteger(max) && max >= 0 && max >= min) {
      priceRange.lte = max;
    }
    queryList.push({
      range: {
        price: priceRange,
      },
    });
    const searchAfter = {} as { search_after: [string] };
    if (from) {
      searchAfter.search_after = [from];
    }
    const result: SearchResponse = await this.esService.search({
      index: this.gigIndex,
      size,
      query: {
        bool: {
          must: [...queryList],
        },
      },
      sort: [
        {
          sortId: type === 'forward' ? 'asc' : 'desc',
        },
      ],
      ...searchAfter,
    });
    const total: IHitsTotal = result.hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: result.hits.hits,
    };
  }
}
