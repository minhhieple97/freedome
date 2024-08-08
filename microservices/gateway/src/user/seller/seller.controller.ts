import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@gateway/common/guards/jwt-auth.guard';
import { CreateSellerDto } from '@freedome/common/dtos/seller.dto';
import { IAuthorizedRequest } from '@freedome/common';

@ApiBearerAuth('authorization')
@ApiTags('seller')
@Controller('seller')
export class SellerControler {
  constructor(private readonly sellerService: SellerService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async getSellerById(@Param('id') id: string) {
    return this.sellerService.getSellerById(id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createSeller(
    @Body() createSellerDto: CreateSellerDto,
    @Req() request: IAuthorizedRequest,
  ) {
    const user = request.user;
    return this.sellerService.createSeller(createSellerDto, user.id);
  }
}
