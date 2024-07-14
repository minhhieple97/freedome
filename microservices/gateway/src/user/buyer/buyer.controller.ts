import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from '@gateway/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthorizedRequest } from '@freedome/common';

@ApiBearerAuth('authorization')
@ApiTags('buyer')
@UseGuards(JwtAuthGuard)
@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}
  @Get('email')
  getUserBuyerWithEmail(@Req() request: IAuthorizedRequest) {
    const user = request.user;
    const email = user.email;
    return this.buyerService.getUserBuyerWithEmail(email);
  }

  // @Get('username')
  // getCurrentUsername(@Req() request: IAuthorizedRequest) {
  //   const user = request.user;
  //   const username = user.username;
  //   return this.buyerService.getUserBuyerWithUsername(username);
  // }

  // @Get(':username')
  // getUsername(@Param('username') username: string) {
  //   return this.buyerService.getUserBuyerWithUsername(username);
  // }
}
