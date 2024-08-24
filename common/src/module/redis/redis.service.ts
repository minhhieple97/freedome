import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
  ) {}

  async set(key: string, value: string, expirationSeconds: number) {
    await this.client.set(key, value, 'EX', expirationSeconds);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async sadd(key: string, member: string): Promise<number> {
    return this.client.sadd(key, member);
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async hkeys(key: string): Promise<string[]> {
    return this.client.hkeys(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async scanSet(key: string, matchPattern: string): Promise<string[]> {
    const results: string[] = [];
    let cursor = '0';

    do {
      const [newCursor, items] = await this.client.sscan(
        key,
        cursor,
        'MATCH',
        matchPattern,
      );
      cursor = newCursor;
      results.push(...items);
    } while (cursor !== '0');

    return results;
  }

  async scanHash(key: string, matchPattern: string): Promise<string[]> {
    const results: string[] = [];
    let cursor = '0';

    do {
      const [newCursor, items] = await this.client.hscan(
        key,
        cursor,
        'MATCH',
        matchPattern,
      );
      cursor = newCursor;
      for (let i = 0; i < items.length; i += 2) {
        results.push(items[i]);
      }
    } while (cursor !== '0');

    return results;
  }

  async srem(key: string, member: string): Promise<number> {
    return this.client.srem(key, member);
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.client.sismember(key, member);
  }
}
