import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './consumers/email/email.service';
import { EmailAuthEventDto } from '@freedome/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly emailService: EmailService) {}
  @Post()
  async sendEmail(@Body() emailRequest: EmailAuthEventDto) {
    return this.emailService.handleAuthEmail(emailRequest);
  }
  @MessagePattern({ cmd: 'just_hello' })
  create(data: any) {
    console.log({ data });
    return data;
  }
}
