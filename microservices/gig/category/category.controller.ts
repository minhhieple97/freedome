import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('add_category')
  async addCategory(@Payload() data: { category: string }) {
    await this.categoryService.addCategory(data.category);
    return { message: 'Category added successfully' };
  }

  @MessagePattern('add_subcategory')
  async addSubcategory(
    @Payload() data: { category: string; subcategory: string },
  ) {
    await this.categoryService.addSubcategory(data.category, data.subcategory);
    return { message: 'Subcategory added successfully' };
  }

  @MessagePattern('get_categories')
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @MessagePattern('get_subcategories')
  async getSubcategories(@Payload() data: { category: string }) {
    return this.categoryService.getSubcategories(data.category);
  }

  @MessagePattern('get_all_categories_with_subcategories')
  async getAllCategoriesWithSubcategories() {
    return this.categoryService.getAllCategoriesWithSubcategories();
  }

  @MessagePattern('search_categories_and_subcategories')
  async searchCategoriesAndSubcategories(
    @Payload() data: { searchTerm: string },
  ) {
    return this.categoryService.searchCategoriesAndSubcategories(
      data.searchTerm,
    );
  }
}
