import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { Buyer } from './buyer.schema';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  async create(@Body() createBuyerDto: Buyer): Promise<Buyer> {
    return this.buyerService.create(createBuyerDto);
  }

  @Get()
  async findAll(): Promise<Buyer[]> {
    return this.buyerService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Buyer> {
    return this.buyerService.findById(id);
  }
}
