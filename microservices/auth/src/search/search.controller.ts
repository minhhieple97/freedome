import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import { sortBy } from 'lodash';
import {
  AUTH_SERVICE_NAME,
  SearchGigsRequest,
  SearchGigsResponse,
} from 'proto/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'searchGigs')
  async searchGigs(
    searchGigsRequest: SearchGigsRequest,
  ): Promise<SearchGigsResponse> {
    const { type } = searchGigsRequest;
    let resultHits = [];
    const gigs = await this.searchService.gigsSearch(searchGigsRequest);
    const { hits, total } = gigs;
    for (const item of hits) {
      resultHits.push(item._source);
    }
    if (type === 'backward') {
      resultHits = sortBy(resultHits, ['sortId']);
    }
    return { total, gigs: resultHits };
  }
}
