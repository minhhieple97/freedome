import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GigService } from './gig.service';
import {
  CreateGigRequest,
  GIG_SERVICE_NAME,
  UpdateGigRequest,
} from 'proto/types/gig';

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

  // @GrpcMethod('GigService', 'GetSellerPausedGigs')
  // async getSellerPausedGigs(data: {
  //   sellerId: string;
  // }): Promise<{ gigs: ISellerGig[] }> {
  //   const gigs = await this.gigService.getSellerPausedGigs(data.sellerId);
  //   return { gigs };
  // }

  @GrpcMethod(GIG_SERVICE_NAME, 'createGig')
  async createGig(data: CreateGigRequest) {
    return this.gigService.createGig(data);
  }

  // @GrpcMethod('GigService', 'deleteGig')
  // async deleteGig(data: { gigId: string; sellerId: string }): Promise<void> {
  //   await this.gigService.deleteGig(data.gigId, data.sellerId);
  // }

  @GrpcMethod(GIG_SERVICE_NAME, 'updateGig')
  async updateGig(data: UpdateGigRequest) {
    return this.gigService.updateGig(data);
  }

  // @GrpcMethod('GigService', 'updateActiveGigProp')
  // async updateActiveGigProp(data: {
  //   gigId: string;
  //   active: boolean;
  // }): Promise<ISellerGig> {
  //   return this.gigService.updateActiveGigProp(data.gigId, data.active);
  // }

  // @GrpcMethod('GigService', 'getUserSelectedGigCategory')
  // async getUserSelectedGigCategory(data: {
  //   key: string;
  // }): Promise<{ category: string }> {
  //   const category = await this.gigService.getUserSelectedGigCategory(data.key);
  //   return { category };
  // }
}
