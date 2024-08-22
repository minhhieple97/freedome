import { RedisService } from '@freedome/common/module';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  private readonly CATEGORY_SET_KEY = 'categories';
  private readonly SUBCATEGORY_HASH_PREFIX = 'subcategories:';

  constructor(private readonly redisService: RedisService) {}

  async addCategory(category: string): Promise<void> {
    await this.redisService.sadd(this.CATEGORY_SET_KEY, category);
  }

  async addSubcategory(category: string, subcategory: string): Promise<void> {
    await this.addCategory(category);
    await this.redisService.hset(
      `${this.SUBCATEGORY_HASH_PREFIX}${category}`,
      subcategory,
      '1',
    );
  }

  async getCategories(): Promise<string[]> {
    return this.redisService.smembers(this.CATEGORY_SET_KEY);
  }

  async getSubcategories(category: string): Promise<string[]> {
    return this.redisService.hkeys(
      `${this.SUBCATEGORY_HASH_PREFIX}${category}`,
    );
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
    keyword: string,
  ): Promise<{ categories: string[]; subcategories: string[] }> {
    const categories = await this.redisService.scanSet(
      this.CATEGORY_SET_KEY,
      `*${keyword}*`,
    );
    const subcategories = await this.searchSubcategories(keyword, categories);

    return { categories, subcategories };
  }

  private async searchSubcategories(
    keyword: string,
    categories: string[],
  ): Promise<string[]> {
    const subcategories: string[] = [];

    for (const category of categories) {
      const subcategoryResults = await this.redisService.scanHash(
        `${this.SUBCATEGORY_HASH_PREFIX}${category}`,
        `*${keyword}*`,
      );
      subcategories.push(...subcategoryResults);
    }

    return subcategories;
  }
}
