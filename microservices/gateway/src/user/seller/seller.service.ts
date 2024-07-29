import { convertGrpcTimestampToPrisma, SERVICE_NAME } from '@freedome/common';
import { CreateSellerDto } from '@freedome/common/dtos/seller.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from 'proto/types/user';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class SellerService {
  private userService: UserServiceClient;
  constructor(@Inject(SERVICE_NAME.USER) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
  async getSellerById(sellerId: string) {
    const seller = await firstValueFrom(
      this.userService.getSellerById({ id: sellerId }).pipe(
        catchError((error) =>
          throwError(
            () =>
              new RpcException({
                code: error.code,
                message: error.details,
              }),
          ),
        ),
      ),
    );
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return {
      ...seller,
      createdAt: convertGrpcTimestampToPrisma(seller.createdAt),
      updatedAt: convertGrpcTimestampToPrisma(seller.updatedAt),
    };
  }
  async createSeller(createSellerDto: CreateSellerDto) {
    const seller = await firstValueFrom(
      this.userService.createSeller(createSellerDto).pipe(
        catchError((error) =>
          throwError(
            () =>
              new RpcException({
                code: error.code,
                message: error.details,
              }),
          ),
        ),
      ),
    );

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return {
      ...seller,
      createdAt: convertGrpcTimestampToPrisma(seller.createdAt),
      updatedAt: convertGrpcTimestampToPrisma(seller.updatedAt),
    };
  }
}
