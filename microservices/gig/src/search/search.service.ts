import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  IHitsTotal,
  IQueryList,
  ISearchResult,
  ISellerGig,
  LoggerService,
  SearchGigsParamDto,
  SearchQueryGigs,
} from '@freedome/common';
import {
  CountResponse,
  GetResponse,
  IndexResponse,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { AppConfigService } from '@gig/config/app/config.service';
import { UserDocument } from '../user/user.schema';
import { GigDocument } from '../gig.schema';
import { DEFAULT_PAGE_SIZE } from '@gig/common/constants';

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
    itemId: string,
    gigDocument: GigDocument,
    user: UserDocument,
  ): Promise<void> {
    try {
      const doc = {
        ...gigDocument,
        user: {
          username: user.username,
          email: user.email,
        },
      };
      await this.esService.update({
        index: this.gigIndex,
        id: itemId,
        doc,
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
  async getGigsByUserId(
    searchQuery: string,
    active: boolean,
  ): Promise<ISearchResult> {
    const queryList: IQueryList[] = [
      {
        query_string: {
          fields: ['userId'],
          query: `*${searchQuery}*`,
        },
      },
      {
        term: {
          active,
        },
      },
    ];

    const result: SearchResponse = await this.esService.search({
      index: this.gigIndex,
      query: {
        bool: {
          must: [...queryList],
        },
      },
    });

    const total: IHitsTotal = result.hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: result.hits.hits,
    };
  }

  async addDataToIndex(
    index: string,
    itemId: string,
    gigDocument: unknown,
  ): Promise<void> {
    try {
      const result: IndexResponse = await this.esService.index({
        index,
        id: itemId,
        document: gigDocument,
      });

      this.logger.debug(`Document indexed successfully: ${result.result}`);
    } catch (error) {
      this.logger.error('Error adding data to Elasticsearch index', {
        index,
        itemId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  async getDocumentCount(index: string): Promise<number> {
    try {
      const result: CountResponse = await this.esService.count({ index });
      return result.count;
    } catch (error) {
      this.logger.error(
        'GigService elasticsearch getDocumentCount() method error:',
        error,
      );
      return 0;
    }
  }
  async bulkUpdate(updates: Array<{ id: string; doc: any }>) {
    const body = updates.flatMap(({ id, doc }) => [
      { update: { _index: this.gigIndex, _id: id } },
      { doc: { doc } },
    ]);
    const bulkResponse = await this.esService.bulk({
      refresh: true,
      body,
    });
    if (bulkResponse.errors) {
      const erroredDocuments = bulkResponse.items.filter(
        (item: any) => item.update && item.update.error,
      );
      this.logger.error('Bulk update errors:', erroredDocuments);
      throw new Error('Bulk update failed');
    }

    return bulkResponse;
  }

  async searchGigs(
    searchGigsParam: SearchGigsParamDto,
  ): Promise<ISearchResult> {
    const { from, size, type } = searchGigsParam;
    const queryList = this.buildQueryList(searchGigsParam);

    const result: SearchResponse = await this.esService.search({
      index: this.gigIndex,
      size,
      query: {
        bool: {
          must: queryList,
        },
      },
      sort: [
        {
          sortId: type === 'forward' ? 'asc' : 'desc',
        },
      ],
      ...(from !== '0' && { search_after: [from] }),
    });

    return this.formatSearchResult(result);
  }

  private buildQueryList(searchGigsParam: SearchGigsParamDto): object[] {
    const { searchQuery, deliveryTime, max, min } = searchGigsParam;
    const queryList: SearchQueryGigs[] = [
      {
        query_string: {
          fields: [
            'user.username',
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

    if (this.isValidPriceRange(min, max)) {
      queryList.push({
        range: {
          price: {
            gte: min,
            lte: max,
          },
        },
      });
    }

    return queryList;
  }

  private isValidPriceRange(min?: number, max?: number): boolean {
    return !isNaN(Number(min)) && !isNaN(Number(max));
  }

  private formatSearchResult(result: SearchResponse): ISearchResult {
    const total = (result.hits.total as { value: number }).value;
    return {
      total,
      hits: result.hits.hits,
    };
  }
  async searchGigsByCategory(searchQuery: string): Promise<ISearchResult> {
    const queryList = this.buildCategoryQueryList(searchQuery);

    const result: SearchResponse = await this.esService.search({
      index: this.gigIndex,
      size: DEFAULT_PAGE_SIZE,
      query: {
        bool: {
          must: queryList,
        },
      },
    });

    return this.formatSearchResult(result);
  }

  private buildCategoryQueryList(searchQuery: string): SearchQueryGigs[] {
    return [
      {
        query_string: {
          fields: ['categories'],
          query: `*${searchQuery}*`,
        },
      },
      {
        term: {
          active: true,
        },
      },
    ];
  }
  async getMoreGigsLikeThis(gigId: string): Promise<ISearchResult> {
    const result: SearchResponse = await this.esService.search({
      index: this.gigIndex,
      size: DEFAULT_PAGE_SIZE,
      query: this.buildMoreLikeThisQuery(gigId),
    });

    return this.formatSearchResult(result);
  }

  private buildMoreLikeThisQuery(gigId: string) {
    return {
      more_like_this: {
        fields: [
          'user.username',
          'title',
          'description',
          'basicDescription',
          'basicTitle',
          'categories',
          'subCategories',
          'tags',
        ],
        like: [
          {
            _index: this.gigIndex,
            _id: gigId,
          },
        ],
      },
    };
  }
  async getTopRatedGigsByCategory(category: string): Promise<ISearchResult> {
    const result: SearchResponse = await this.esService.search({
      index: this.gigIndex,
      size: DEFAULT_PAGE_SIZE,
      query: this.buildTopRatedGigsByCategoryQuery(category),
    });

    return this.formatSearchResult(result);
  }

  private buildTopRatedGigsByCategoryQuery(category: string) {
    return {
      bool: {
        filter: {
          script: {
            script: {
              source:
                "doc['ratingSum'].value != 0 && (doc['ratingSum'].value / doc['ratingsCount'].value == params.threshold)",
              lang: 'painless',
              params: {
                threshold: 5,
              },
            },
          },
        },
        must: [
          {
            query_string: {
              fields: ['categories'],
              query: `*${category}*`,
            },
          },
        ],
      },
    };
  }
}
