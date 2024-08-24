import { Module } from '@nestjs/common';
import { RedisModule } from '@freedome/common/module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AppConfigModule } from './config/app/config.module';
@Module({
  imports: [RedisModule, AppConfigModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
