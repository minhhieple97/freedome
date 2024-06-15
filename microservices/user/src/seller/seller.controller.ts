import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SellerService } from './seller.service';
import { Seller } from './seller.schema';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  async create(@Body() createSellerDto: Seller): Promise<Seller> {
    return this.sellerService.create(createSellerDto);
  }

  @Get()
  async findAll(): Promise<Seller[]> {
    return this.sellerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Seller> {
    return this.sellerService.findById(id);
  }
}
