import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './consumers/email/email.service';
import { EmailAuthEventDto } from '@app/common';

@Controller()
export class AppController {
  constructor(private readonly emailService: EmailService) {}
  @Post()
  async sendEmail(@Body() emailRequest: EmailAuthEventDto) {
    return this.emailService.handleAuthEmail(emailRequest);
  }
}
