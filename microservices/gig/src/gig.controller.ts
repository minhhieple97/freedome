import { Controller, Get } from '@nestjs/common';
import { GigService } from './gig.service';

@Controller()
export class GigController {
  constructor(private readonly gigService: GigService) {}

  @Get()
  getHello(): string {
    return this.gigService.getHello();
  }
}
