import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { GigService } from './gig.service';
import {
  CreateGigRequest,
  DeleteGigRequest,
  GetInactiveGigByUserIdRequest,
  GIG_SERVICE_NAME,
  UpdateActiveGigPropRequest,
  UpdateGigRequest,
} from 'proto/types/gig';
import { EVENTS_HTTP, SearchGigsParamDto } from '@freedome/common';

@Controller()
export class GigController {
  constructor(private readonly gigService: GigService) {}

  // @GrpcMethod('GigService', 'GetGigById')
  // async getGigById(data: { gigId: string }): Promise<ISellerGig> {
  //   return this.gigService.getGigById(data.gigId);
  // }

  // @GrpcMethod('GigService', 'GetSellerGigs')
  // async getSellerGigs(data: {
  //   sellerId: string;
  // }): Promise<{ gigs: ISellerGig[] }> {
  //   const gigs = await this.gigService.getSellerGigs(data.sellerId);
  //   return { gigs };
  // }

  @GrpcMethod('GigService', 'GetInactiveGigByUserId')
  async getInactiveGigByUserId(data: GetInactiveGigByUserIdRequest) {
    const gigs = await this.gigService.getInactiveGigByUserId(data);
    return { gigs };
  }

  @GrpcMethod('GigService', 'GetActiveGigByUserId')
  async getActiveGigByUserId(data: GetInactiveGigByUserIdRequest) {
    const gigs = await this.gigService.getActiveGigByUserId(data);
    return { gigs };
  }

  @GrpcMethod(GIG_SERVICE_NAME, 'createGig')
  async createGig(data: CreateGigRequest) {
    return this.gigService.createGig(data);
  }

  @GrpcMethod('GigService', 'deleteGig')
  async deleteGig(data: DeleteGigRequest) {
    await this.gigService.deleteGig(data);
  }

  @GrpcMethod(GIG_SERVICE_NAME, 'updateGig')
  async updateGig(data: UpdateGigRequest) {
    return this.gigService.updateGig(data);
  }

  @GrpcMethod('GigService', 'updateActiveGigProp')
  async updateActiveGigProp(data: UpdateActiveGigPropRequest) {
    return this.gigService.updateActiveGigProp(data);
  }

  // @GrpcMethod('GigService', 'getUserSelectedGigCategory')
  // async getUserSelectedGigCategory(data: {
  //   key: string;
  // }): Promise<{ category: string }> {
  //   const category = await this.gigService.getUserSelectedGigCategory(data.key);
  //   return { category };
  // }

  @MessagePattern(EVENTS_HTTP.SEARCH_GIGS)
  public async searchGigs(searchGigsParam: SearchGigsParamDto) {
    return this.gigService.searchGigs(searchGigsParam);
  }
}
