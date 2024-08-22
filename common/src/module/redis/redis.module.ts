import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
