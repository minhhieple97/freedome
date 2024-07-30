import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SellerService } from './seller.service';
import { GetUserSellerByIdRequest, USER_SERVICE_NAME } from 'proto/types/user';
import { ISellerDocument } from '@freedome/common';
import { SellerDocument } from './seller.schema';

@Controller()
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'createSeller')
  async createSeller(data: ISellerDocument) {
    return this.sellerService.createSeller(data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'updateSeller')
  async updateSeller(data: ISellerDocument): Promise<SellerDocument> {
    return this.sellerService.updateSeller(data._id, data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getSellerById')
  async getSellerById(data: GetUserSellerByIdRequest) {
    return this.sellerService.getSellerById(data.id);
  }
}
