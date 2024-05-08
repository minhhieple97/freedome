import { Body, Controller } from '@nestjs/common';
import { EmailService } from './consumers/email/email.service';
import { EVENTS_RMQ, EmailAuthEventDto } from '@freedome/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly emailService: EmailService) {}
  @MessagePattern({ cmd: 'email_verification' })
  async sendEmailVerification(@Body() emailRequest: EmailAuthEventDto) {
    return this.emailService.handleAuthEmail(emailRequest);
  }
  @MessagePattern(EVENTS_RMQ.AUTH_EMAIL)
  create(data: any) {
    console.log({ data });
    return data;
  }
}
