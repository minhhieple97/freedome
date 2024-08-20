import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GigService } from './gig.service';
import {
  CreateGigRequest,
  DeleteGigRequest,
  EVENTS_HTTP,
  GetActiveGigByUserIdRequest,
  GetInactiveGigByUserIdRequest,
  ISearchResult,
  SearchGigsParamDto,
  UpdateGigRequest,
  UpdateGigStatusRequest,
} from '@freedome/common';

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

  @MessagePattern(EVENTS_HTTP.GET_INACTIVE_GIG_BY_USER_ID)
  async getInactiveGigByUserId(data: GetInactiveGigByUserIdRequest) {
    const gigs = await this.gigService.getInactiveGigByUserId(data);
    return { gigs };
  }

  @MessagePattern(EVENTS_HTTP.GET_ACTIVE_GIG_BY_USER_ID)
  async getActiveGigByUserId(data: GetActiveGigByUserIdRequest) {
    const gigs = await this.gigService.getActiveGigByUserId(data);
    return { gigs };
  }

  @MessagePattern(EVENTS_HTTP.CREATE_GIG)
  async createGig(data: CreateGigRequest) {
    return this.gigService.createGig(data);
  }

  @MessagePattern(EVENTS_HTTP.DELETE_GIG)
  async deleteGig(data: DeleteGigRequest) {
    await this.gigService.deleteGig(data);
  }

  @MessagePattern(EVENTS_HTTP.UPDATE_GIG)
  async updateGig(data: UpdateGigRequest) {
    return this.gigService.updateGig(data);
  }

  @MessagePattern(EVENTS_HTTP.UPDATE_GIG_STATUS)
  async updateActiveGigProp(data: UpdateGigStatusRequest) {
    return this.gigService.updateActiveGigProp(data);
  }

  @MessagePattern(EVENTS_HTTP.SEARCH_GIGS)
  public async searchGigs(searchGigsParam: SearchGigsParamDto) {
    return this.gigService.searchGigs(searchGigsParam);
  }
  @MessagePattern(EVENTS_HTTP.SEARCH_GIGS)
  public async moreLikeThis({ gigId }): Promise<ISearchResult> {
    return this.gigService.moreLikeThis({ gigId });
  }
  @MessagePattern(EVENTS_HTTP.SEED_GIG)
  public async seedGig() {
    return this.gigService.seedData('4');
  }
}
