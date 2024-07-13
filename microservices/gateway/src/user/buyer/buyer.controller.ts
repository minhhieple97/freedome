import { Controller, Get, Param } from '@nestjs/common';
import { BuyerService } from './buyer.service';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}
  @Get('email')
  getEmail() {
    // Implement your logic to get the email
    return { email: 'buyer@example.com' };
  }

  @Get('username')
  getCurrentUsername() {
    // Implement your logic to get the current username
    return { username: 'currentUsername' };
  }

  @Get(':username')
  getUsername(@Param('username') username: string) {
    // Implement your logic to get the username
    return { username };
  }
}
