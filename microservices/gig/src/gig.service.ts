import { Injectable } from '@nestjs/common';
import { ISellerGig } from '@freedome/common';
import { SearchService } from './search/search.service';
import { AppConfigService } from './config/app/config.service';

@Injectable()
export class GigService {
  constructor(
    private readonly searchService: SearchService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async getGigById(gigId: string): Promise<ISellerGig> {
    const gigIndex = this.appConfigService.gigElasticSearchIndex;
    const gig: ISellerGig = await this.searchService.getIndexedData(
      gigIndex,
      gigId,
    );
    return gig;
  }
  async getSellerGigs(sellerId: string): Promise<ISellerGig[]> {
    const resultsHits: ISellerGig[] = [];
    const gigs = await this.searchService.gigsSearchBySellerId(sellerId, true);
    for (const item of gigs.hits) {
      resultsHits.push(item._source as ISellerGig);
    }
    return resultsHits;
  }
}
