/* eslint-disable @typescript-eslint/no-unused-vars */

import { LoggerService } from '@freedome/common';
import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { SOCKET_EVENTS } from '../common/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
@Injectable()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  constructor(private readonly chatService: ChatService) {}

  private readonly logger = new LoggerService(ChatGateway.name);

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
    await this.chatService.storeUserLogin(userId);
  }

  @SubscribeMessage(SOCKET_EVENTS.LOGOUT)
  async removeUserLogout(@MessageBody() userId: string) {
    await this.chatService.removeUserLogout(userId);
  }

  @SubscribeMessage(SOCKET_EVENTS.GET_USER_ONLINE_STATUS)
  async getUserOnlineStatus(@MessageBody() userId: string) {
    return await this.chatService.getUserOnlineStatus(userId);
  }
}
