import { SearchDtoParam } from '@auth/common/dtos';
import { AppConfigService } from '@auth/config/app/config.service';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import {
  IHitsTotal,
  IQueryList,
  ISearchResult,
  ISellerGig,
  LoggerService,
  SearchGigsDtoParam,
} from '@freedome/common';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { uniqueId } from 'lodash';

@Injectable()
export class SearchService {
  private readonly logger = new LoggerService(SearchService.name);
  private readonly gigIndex = this.appConfigService.gigElasticSearchIndex;
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly appConfigService: AppConfigService,
  ) {}
  public async createIndex() {
    this.logger.log(`Creating index ${this.gigIndex}`);
    const checkIndex = await this.esService.indices.exists({
      index: this.gigIndex,
    });
    this.logger.log(`Index ${this.gigIndex} ${checkIndex}`);
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
  async gigsSearch({
    searchQuery,
    paginate,
    deliveryTime,
    min,
    max,
  }: SearchGigsDtoParam): Promise<ISearchResult> {
    const { from, size, type } = paginate;
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

    if (deliveryTime !== 'undefined') {
      queryList.push({
        query_string: {
          fields: ['expectedDelivery'],
          query: `*${deliveryTime}*`,
        },
      });
    }

    if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
      queryList.push({
        range: {
          price: {
            gte: min,
            lte: max,
          },
        },
      });
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
      ...(from !== '0' && { search_after: [from] }),
    });
    const total: IHitsTotal = result.hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: result.hits.hits,
    };
  }
}
