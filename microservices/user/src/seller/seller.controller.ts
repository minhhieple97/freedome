import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SellerService } from './seller.service';
import {
  CreateSellerRequest,
  GetUserSellerByIdRequest,
  UpdateSellerRequest,
  USER_SERVICE_NAME,
} from 'proto/types/user';

@Controller()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'createSeller')
  async createSeller(data: CreateSellerRequest) {
    return this.sellerService.createSeller(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'updateSeller')
  async updateSeller(data: UpdateSellerRequest) {
    return this.sellerService.updateSeller(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getSellerById')
  async getSellerById(data: GetUserSellerByIdRequest) {
    return this.sellerService.getSellerById(data.id);
  }
}
