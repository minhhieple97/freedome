import { Injectable } from '@nestjs/common';
import { RedisService } from 'common/src/module/redis/redis.service';

@Injectable()
export class GatewayService {
  private readonly USER_LOGIN_KEY = 'user:online';

  constructor(private readonly redisService: RedisService) {}

  async storeUserLogin(userId: string): Promise<void> {
    await this.redisService.sadd(this.USER_LOGIN_KEY, userId);
  }

  async removeUserLogout(userId: string): Promise<void> {
    await this.redisService.srem(this.USER_LOGIN_KEY, userId);
  }

  async getLoggedInUsers(): Promise<string[]> {
    return this.redisService.smembers(this.USER_LOGIN_KEY);
  }

  async getUserOnlineStatus(userId: string): Promise<boolean> {
    return (
      (await this.redisService.sismember(this.USER_LOGIN_KEY, userId)) === 1
    );
  }
}
