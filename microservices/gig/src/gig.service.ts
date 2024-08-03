import { Injectable } from '@nestjs/common';
import {
  dateToTimestamp,
  EXCHANGE_NAME,
  GIG_QUEUE_NAME,
  IRatingTypes,
  IReviewMessageDetails,
  ISellerGig,
  LoggerService,
  ROUTING_KEY,
} from '@freedome/common';
import { v4 as uuidV4 } from 'uuid';
import { SearchService } from './search/search.service';
import { AppConfigService } from './config/app/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { Gig, GigDocument } from './gig.schema';
import { Model } from 'mongoose';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RedisCacheService } from '@freedome/common/module';
import { UploadService } from '@freedome/common/upload';
import { BUCKET_S3_FOLDER_NAME } from '@auth/common/constants';
import { CreateGigRequest } from 'proto/types/gig';

@Injectable()
export class GigService {
  constructor(
    private readonly searchService: SearchService,
    private readonly appConfigService: AppConfigService,
    @InjectModel(Gig.name)
    private readonly gigModel: Model<GigDocument>,
    private readonly amqpConnection: AmqpConnection,
    private readonly redisCacheService: RedisCacheService,
    private readonly uploadService: UploadService,
  ) {}
  private readonly gigIndex = this.appConfigService.gigElasticSearchIndex;
  private readonly logger = new LoggerService(GigService.name);
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

  async createGig(gig: CreateGigRequest) {
    const coverImageId = await this.uploadGigCover(gig.coverImage);
    const {
      sellerId,
      username,
      email,
      profilePicture,
      title,
      description,
      categories,
      subCategories,
      tags,
      price,
      expectedDelivery,
      basicTitle,
      basicDescription,
    } = gig;
    const count: number = await this.searchService.getDocumentCount(
      this.gigIndex,
    );
    const record = {
      sellerId: sellerId,
      username: username,
      email: email,
      profilePicture: profilePicture,
      title: title,
      description: description,
      categories: categories,
      subCategories: subCategories,
      tags: tags,
      price: price,
      expectedDelivery: expectedDelivery,
      basicTitle: basicTitle,
      basicDescription,
      coverImage: coverImageId,
      sortId: count + 1,
    };
    const createdGig = (await this.gigModel.create(record)).toObject();
    if (createdGig) {
      const count = 1;
      this.amqpConnection.publish(
        EXCHANGE_NAME.USER_SELLER,
        ROUTING_KEY.UPDATE_GIG_COUNT,
        {
          gigSellerId: `${createdGig.sellerId}`,
          count,
        },
      );
      await this.searchService.addDataToIndex(
        this.gigIndex,
        `${createdGig.id}`,
        createdGig,
      );
    }
    const result = {
      ...createdGig,
      createdAt: dateToTimestamp(createdGig.createdAt),
      updatedAt: dateToTimestamp(createdGig.updatedAt),
    };
    return result;
  }
  async deleteGig(gigId: string, sellerId: string): Promise<void> {
    await this.gigModel.deleteOne({ _id: gigId }).exec();
    const count = -1;
    this.amqpConnection.publish(
      EXCHANGE_NAME.USER_SELLER,
      ROUTING_KEY.UPDATE_GIG_COUNT,
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

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.UPDATE_GIG,
    queue: GIG_QUEUE_NAME,
    routingKey: ROUTING_KEY.UPDATE_GIG_FROM_BUYER_REVIEW,
  })
  async updateGigWhenBuyerReview(data: IReviewMessageDetails): Promise<void> {
    await this.updateGigReview(data);
  }
  async getUserSelectedGigCategory(key: string): Promise<string> {
    try {
      const response = (await this.redisCacheService.get(key)) as string;
      return response || '';
    } catch (error) {
      this.logger.error('Error in getUserSelectedGigCategory method:', error);
      return '';
    }
  }
  async uploadGigCover(coverImage: string): Promise<string | null> {
    const coverImageId = uuidV4();
    const buf = Buffer.from(
      coverImage.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    await this.uploadService.upload({
      Bucket: this.appConfigService.awsBucketS3Name,
      Key: `${BUCKET_S3_FOLDER_NAME.GIGS}/${coverImageId}.jpg`,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    });
    return coverImageId;
  }
}
