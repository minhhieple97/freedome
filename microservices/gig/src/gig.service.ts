import { Injectable } from '@nestjs/common';
import {
  dateToTimestamp,
  EXCHANGE_NAME,
  IRatingTypes,
  IReviewMessageDetails,
  ISearchResult,
  ISellerGig,
  isValidBase64,
  LoggerService,
  ROUTING_KEY,
  SearchGigsParamDto,
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
import * as _ from 'lodash';
import {
  CreateGigRequest,
  DeleteGigRequest,
  GetActiveGigByUserIdRequest,
  GetInactiveGigByUserIdRequest,
  UpdateActiveGigPropRequest,
  UpdateGigRequest,
} from 'proto/types/gig';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { User, UserDocument } from './user/user.schema';
import { sortBy } from 'lodash';
import { GigType } from '@freedome/common/enums';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
@Injectable()
export class GigService {
  constructor(
    private readonly searchService: SearchService,
    private readonly appConfigService: AppConfigService,
    @InjectModel(Gig.name)
    private readonly gigModel: Model<GigDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly amqpConnection: AmqpConnection,
    private readonly redisCacheService: RedisCacheService,
    private readonly uploadService: UploadService,
  ) {}
  private readonly gigIndex = this.appConfigService.gigElasticSearchIndex;
  private readonly logger = new LoggerService(GigService.name);
  private categories: string[] = [
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Data',
    'Business',
  ];

  private expectedDelivery: string[] = [
    '1 Day Delivery',
    '2 Days Delivery',
    '3 Days Delivery',
    '4 Days Delivery',
    '5 Days Delivery',
  ];

  // private randomRatings = [
  //   { sum: 20, count: 4 },
  //   { sum: 10, count: 2 },
  //   { sum: 20, count: 4 },
  //   { sum: 15, count: 3 },
  //   { sum: 5, count: 1 },
  // ];
  async getGigById(gigId: string): Promise<ISellerGig> {
    const gigIndex = this.appConfigService.gigElasticSearchIndex;
    const gig: ISellerGig = await this.searchService.getIndexedData(
      gigIndex,
      gigId,
    );
    return gig;
  }
  async getActiveGigByUserId(
    data: GetActiveGigByUserIdRequest,
  ): Promise<ISellerGig[]> {
    const resultsHits: ISellerGig[] = [];
    const user = (
      await this.userModel.findOne({ userId: data.userId })
    ).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
    const gigs = await this.searchService.getGigsByUserId(user._id, true);
    for (const item of gigs.hits) {
      resultsHits.push(item._source as ISellerGig);
    }
    return resultsHits;
  }

  async getInactiveGigByUserId(
    data: GetInactiveGigByUserIdRequest,
  ): Promise<ISellerGig[]> {
    const user = (
      await this.userModel.findOne({ userId: data.userId })
    ).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
    const resultsHits: ISellerGig[] = [];
    const gigs = await this.searchService.getGigsByUserId(user._id, false);
    for (const item of gigs.hits) {
      resultsHits.push(item._source as ISellerGig);
    }
    return resultsHits;
  }

  async createGig(gig: CreateGigRequest) {
    const coverImageId = await this.uploadGigCover(gig.coverImage);
    const {
      userId,
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
    const [count, userObject] = await Promise.all([
      this.searchService.getDocumentCount(this.gigIndex),
      (await this.userModel.findOne({ userId })).toJSON(),
    ]);
    if (!userObject) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
    console.log({ userObject, count });
    const record = {
      user: userObject._id,
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
    console.log({ record });
    const createdGig = (await this.gigModel.create(record)).toObject();
    console.log({ createdGig });
    if (createdGig) {
      const gigDataEs = _.omit(
        {
          ...createdGig,
          user: {
            email: userObject.email,
            username: userObject.username,
          },
        },
        ['_id'],
      );
      const count = 1;
      await this.amqpConnection.publish(
        EXCHANGE_NAME.USER_SELLER,
        ROUTING_KEY.UPDATE_GIG_COUNT,
        {
          userId,
          count,
        },
      );
      await this.searchService.addDataToIndex(
        this.gigIndex,
        `${createdGig._id.toString()}`,
        gigDataEs,
      );
    }
    const result = {
      ...createdGig,
      createdAt: dateToTimestamp(createdGig.createdAt),
      updatedAt: dateToTimestamp(createdGig.updatedAt),
    };
    return result;
  }
  async deleteGig(deleteGigRequest: DeleteGigRequest): Promise<void> {
    const { id, userId } = deleteGigRequest;
    const user = (await this.userModel.findOne({ userId })).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
    const gig = (
      await this.gigModel.findOne({
        userId: user._id,
        _id: id,
      })
    ).toObject();
    if (!gig) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Gig not found',
      });
    }
    await this.gigModel.deleteOne({ _id: id }).exec();
    const count = -1;
    await this.amqpConnection.publish(
      EXCHANGE_NAME.USER_SELLER,
      ROUTING_KEY.UPDATE_GIG_COUNT,
      {
        userId,
        count,
      },
    );
    await this.searchService.deleteIndexedData(this.gigIndex, id);
  }
  async updateGig(gigData: UpdateGigRequest): Promise<GigDocument> {
    const userId = gigData.userId;
    const user = (await this.userModel.findOne({ userId })).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
    const gig = (
      await this.gigModel.findOne({
        userId: user._id,
        _id: gigData.id,
      })
    ).toObject();
    if (!gig) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Gig not found',
      });
    }
    const {
      id,
      title,
      description,
      categories,
      subCategories,
      tags,
      price,
      coverImage,
      expectedDelivery,
      basicTitle,
      basicDescription,
    } = gigData;
    const covertImageId = isValidBase64(coverImage)
      ? await this.uploadGigCover(coverImage)
      : coverImage;

    const document = (
      await this.gigModel
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              title,
              description,
              categories,
              subCategories,
              tags,
              price,
              coverImage: covertImageId,
              expectedDelivery,
              basicTitle,
              basicDescription,
            },
          },
          { new: true },
        )
        .exec()
    ).toObject();
    if (document) {
      await this.searchService.updateIndexedData(document.id, document, user);
    }
    return document;
  }
  async updateActiveGigProp(
    updateActiveGig: UpdateActiveGigPropRequest,
  ): Promise<GigDocument> {
    const { userId, id, active } = updateActiveGig;
    const user = (await this.userModel.findOne({ userId })).toObject();
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
    const gig = (
      await this.gigModel.findOne({
        userId: user._id,
        _id: id,
      })
    ).toObject();
    if (!gig) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Gig not found',
      });
    }
    const document: GigDocument = (
      await this.gigModel
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              active,
            },
          },
          { new: true },
        )
        .exec()
    ).toObject();
    if (document) {
      await this.searchService.updateIndexedData(
        String(document.id),
        document,
        user,
      );
    }
    return document;
  }
  async updateGigReview(data: IReviewMessageDetails): Promise<void> {
    const gig = (await this.gigModel.findById(data.gigId)).toObject();
    if (!gig) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Gig not found',
      });
    }
    const user = (await this.userModel.findById(gig.user)).toObject();
    const ratingTypes: IRatingTypes = {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
    };
    const ratingKey: string = ratingTypes[`${data.rating}`];
    const updatedGig = await this.gigModel
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
    if (updatedGig) {
      const data = updatedGig.toObject();
      await this.searchService.updateIndexedData(
        String(updatedGig._id),
        data,
        user,
      );
    }
  }

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.UPDATE_GIG,
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
    if (!coverImage) return null;
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
  processSearchResults(gigs: ISearchResult, type: GigType): ISellerGig[] {
    let resultHits = gigs.hits.map((item) => item._source as ISellerGig);
    if (type === GigType.BACKWARD) {
      resultHits = sortBy(resultHits, ['sortId']);
    }
    return resultHits;
  }
  async searchGigs(searchGigsParam: SearchGigsParamDto) {
    const { type } = searchGigsParam;
    const gigs = await this.searchService.searchGigs(searchGigsParam);
    const processedGigs = this.processSearchResults(gigs, type);
    return { total: gigs.total, hits: processedGigs };
  }
  moreLikeThis({ gigId }) {
    return this.searchService.getMoreGigsLikeThis(gigId);
  }
  async seedData(count: string) {
    console.log({ count });
    for (let i = 0; i < 1; i++) {
      const title = `I will ${faker.word.words(5)}`;
      const basicTitle = faker.commerce.productName();
      const basicDescription = faker.commerce.productDescription();
      // const rating = sample(this.randomRatings);
      const gig: CreateGigRequest = {
        userId: 1,
        title: title.length <= 80 ? title : title.slice(0, 80),
        basicTitle:
          basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
        basicDescription:
          basicDescription.length <= 100
            ? basicDescription
            : basicDescription.slice(0, 100),
        categories: `${sample(this.categories)}`,
        subCategories: [
          faker.commerce.department(),
          faker.commerce.department(),
          faker.commerce.department(),
        ],
        description: faker.lorem.sentences({ min: 2, max: 4 }),
        tags: [
          faker.commerce.product(),
          faker.commerce.product(),
          faker.commerce.product(),
          faker.commerce.product(),
        ],
        price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
        coverImage: faker.image.urlPicsumPhotos(),
        expectedDelivery: `${sample(this.expectedDelivery)}`,
        // sortId: parseInt(count, 10) + i + 1,
        // ratingsCount: (i + 1) % 4 === 0 ? rating?.['count'] : 0,
        // ratingSum: (i + 1) % 4 === 0 ? rating?.['sum'] : 0,
      };
      console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`);
      console.log(gig);
      await this.createGig(gig);
    }
    return { message: 'success' };
  }
}
