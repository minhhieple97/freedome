import { Injectable } from '@nestjs/common';
import { EXCHANGE_NAME, ISellerGig, ROUTING_KEY } from '@freedome/common';
import { SearchService } from './search/search.service';
import { AppConfigService } from './config/app/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { Gig, GigDocument } from './gig.schema';
import { Model } from 'mongoose';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class GigService {
  constructor(
    private readonly searchService: SearchService,
    private readonly appConfigService: AppConfigService,
    @InjectModel(Gig.name)
    private readonly gigModel: Model<GigDocument>,
    private readonly amqpConnection: AmqpConnection,
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

  async getSellerPausedGigs(sellerId: string): Promise<ISellerGig[]> {
    const resultsHits: ISellerGig[] = [];
    const gigs = await this.searchService.gigsSearchBySellerId(sellerId, false);
    for (const item of gigs.hits) {
      resultsHits.push(item._source as ISellerGig);
    }
    return resultsHits;
  }

  async createGig(gig: ISellerGig): Promise<ISellerGig> {
    const createdGig: ISellerGig = (await this.gigModel.create(gig)).toObject();
    if (createdGig) {
      const data: ISellerGig = createdGig.toJSON?.() as ISellerGig;
      const count = 1;
      this.amqpConnection.publish(
        EXCHANGE_NAME.USER_SELLER,
        ROUTING_KEY.UDPATE_GIG_COUNT,
        {
          gigSellerId: `${data.sellerId}`,
          count,
        },
      );
      await this.searchService.addDataToIndex('gigs', `${createdGig.id}`, data);
    }
    return createdGig;
  }
}
