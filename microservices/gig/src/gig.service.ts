import { Injectable } from '@nestjs/common';
import {
  EXCHANGE_NAME,
  IRatingTypes,
  IReviewMessageDetails,
  ISellerGig,
  ROUTING_KEY,
} from '@freedome/common';
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
  private readonly gigIndex = this.appConfigService.gigElasticSearchIndex;
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
      await this.searchService.addDataToIndex(
        this.gigIndex,
        `${createdGig.id}`,
        data,
      );
    }
    return createdGig;
  }
  async deleteGig(gigId: string, sellerId: string): Promise<void> {
    await this.gigModel.deleteOne({ _id: gigId }).exec();
    const count = -1;
    this.amqpConnection.publish(
      EXCHANGE_NAME.USER_SELLER,
      ROUTING_KEY.UDPATE_GIG_COUNT,
      {
        gigSellerId: sellerId,
        count,
      },
    );
    await this.searchService.deleteIndexedData(this.gigIndex, `${gigId}`);
  }
  async updateGig(gigId: string, gigData: ISellerGig): Promise<ISellerGig> {
    const document: ISellerGig = (
      await this.gigModel
        .findOneAndUpdate(
          { _id: gigId },
          {
            $set: {
              title: gigData.title,
              description: gigData.description,
              categories: gigData.categories,
              subCategories: gigData.subCategories,
              tags: gigData.tags,
              price: gigData.price,
              coverImage: gigData.coverImage,
              expectedDelivery: gigData.expectedDelivery,
              basicTitle: gigData.basicTitle,
              basicDescription: gigData.basicDescription,
            },
          },
          { new: true },
        )
        .exec()
    ).toObject();
    if (document) {
      const data: ISellerGig = document.toJSON?.() as ISellerGig;
      await this.searchService.updateIndexedData(
        this.gigIndex,
        String(document.id),
        data,
      );
    }
    return document;
  }
  async updateActiveGigProp(
    gigId: string,
    gigActive: boolean,
  ): Promise<ISellerGig> {
    const document: ISellerGig = (
      await this.gigModel
        .findOneAndUpdate(
          { _id: gigId },
          {
            $set: {
              active: gigActive,
            },
          },
          { new: true },
        )
        .exec()
    ).toObject();
    if (document) {
      const data: ISellerGig = document.toJSON?.() as ISellerGig;
      await this.searchService.updateIndexedData(
        'gigs',
        String(document.id),
        data,
      );
    }
    return document;
  }
  async updateGigReview(data: IReviewMessageDetails): Promise<void> {
    const ratingTypes: IRatingTypes = {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
    };
    const ratingKey: string = ratingTypes[`${data.rating}`];
    const gig = await this.gigModel
      .findOneAndUpdate(
        { _id: data.gigId },
        {
          $inc: {
            ratingsCount: 1,
            ratingSum: data.rating,
            [`ratingCategories.${ratingKey}.value`]: data.rating,
            [`ratingCategories.${ratingKey}.count`]: 1,
          },
        },
        { new: true, upsert: true },
      )
      .exec();
    if (gig) {
      const data: ISellerGig = gig.toJSON?.() as ISellerGig;
      await this.searchService.updateIndexedData(
        this.gigIndex,
        String(gig._id),
        data,
      );
    }
  }
}
