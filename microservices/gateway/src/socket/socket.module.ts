import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { GatewayService } from '../gateway.service';

@Module({
  providers: [SocketGateway, GatewayService],
  exports: [SocketGateway],
})
export class SocketModule {}
