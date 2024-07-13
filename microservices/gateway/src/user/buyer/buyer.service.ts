import { SERVICE_NAME } from '@freedome/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from 'proto/types/user';

@Injectable()
export class BuyerService {
  private userService: UserServiceClient;
  constructor(@Inject(SERVICE_NAME.USER) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
  getBuyers() {
    // Logic to get buyers from a database or API
    return [];
  }
}
