import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ISearchResult, SearchGigsDtoParam } from '@freedome/common';
import { sortBy } from 'lodash';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('gigs')
  async searchGigs(@Query() searchGigsParams: SearchGigsDtoParam) {
    const { type } = searchGigsParams.paginate;
    let resultHits = [];
    const gigs = await this.searchService.gigsSearch(searchGigsParams);
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
