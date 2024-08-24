/* eslint-disable @typescript-eslint/no-unused-vars */

import { LoggerService } from '@freedome/common';
import { SOCKET_EVENTS } from '@gateway/common/constants';
import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from '../gateway.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
@Injectable()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  constructor(private readonly gatewayService: GatewayService) {}

  private readonly logger = new LoggerService(SocketGateway.name);

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage(SOCKET_EVENTS.LOGIN)
  async saveUserLogin(@MessageBody() userId: string) {
    await this.gatewayService.storeUserLogin(userId);
  }

  @SubscribeMessage(SOCKET_EVENTS.LOGOUT)
  async removeUserLogout(@MessageBody() userId: string) {
    await this.gatewayService.removeUserLogout(userId);
  }

  @SubscribeMessage(SOCKET_EVENTS.GET_USER_ONLINE_STATUS)
  async getUserOnlineStatus(@MessageBody() userId: string) {
    return await this.gatewayService.getUserOnlineStatus(userId);
  }
}
