import { SearchService } from './search.service';
import { SearchGigsDtoParam } from '@freedome/common';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { SearchGigsResponse } from 'proto/types/auth';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('gigs')
  searchGigs(
    @Query() searchGigsParams: SearchGigsDtoParam,
  ): Observable<SearchGigsResponse> {
    return this.searchService.searchGigs(searchGigsParams);
  }
}
