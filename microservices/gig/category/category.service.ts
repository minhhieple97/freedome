import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';

@Injectable()
export class CategoryService {
  private readonly CATEGORY_SET_KEY = 'categories';
  private readonly SUBCATEGORY_HASH_PREFIX = 'subcategories:';
  private redisClient: RedisClientType;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.redisClient = (this.cacheManager.store as any).getClient();
  }

  async addCategory(category: string): Promise<void> {
    await this.redisClient.sAdd(this.CATEGORY_SET_KEY, category);
  }

  async addSubcategory(category: string, subcategory: string): Promise<void> {
    await this.addCategory(category);
    await this.redisClient.hSet(
      `${this.SUBCATEGORY_HASH_PREFIX}${category}`,
      subcategory,
      '1',
    );
  }

  async getCategories(): Promise<string[]> {
    return this.redisClient.sMembers(this.CATEGORY_SET_KEY);
  }

  async getSubcategories(category: string): Promise<string[]> {
    return this.redisClient.hKeys(`${this.SUBCATEGORY_HASH_PREFIX}${category}`);
  }

  async getAllCategoriesWithSubcategories(): Promise<Record<string, string[]>> {
    const categories = await this.getCategories();
    const result: Record<string, string[]> = {};

    for (const category of categories) {
      result[category] = await this.getSubcategories(category);
    }

    return result;
  }

  async searchCategoriesAndSubcategories(
    searchTerm: string,
  ): Promise<Record<string, string[]>> {
    const result: Record<string, string[]> = {};
    const pattern = `*${searchTerm}*`;

    for await (const key of this.redisClient.scanIterator({
      MATCH: pattern,
      TYPE: 'set',
    })) {
      if (key === this.CATEGORY_SET_KEY) {
        const categories = await this.redisClient.sScan(
          this.CATEGORY_SET_KEY,
          0,
          { MATCH: pattern },
        );
        for (const category of categories.members) {
          result[category] = await this.getSubcategories(category);
        }
      }
    }

    for await (const key of this.redisClient.scanIterator({
      MATCH: `${this.SUBCATEGORY_HASH_PREFIX}*`,
      TYPE: 'hash',
    })) {
      const category = key.split(':')[1];
      const subcategories = await this.redisClient.hScan(key, 0, {
        MATCH: pattern,
      });
      if (subcategories.tuples.length > 0) {
        result[category] = result[category] || [];
        result[category].push(...subcategories.tuples.map((t) => t.field));
      }
    }

    return result;
  }
}
