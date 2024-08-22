import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { RedisModule } from '@freedome/common/module';
import { CategoryController } from './category.controller';

@Module({
  imports: [RedisModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
