import { EmailService } from './email.service';
import { EVENTS_RMQ, EmailAuthEventDto } from '@freedome/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @EventPattern(EVENTS_RMQ.AUTH_EMAIL)
  handleAuthEmail(@Payload() emailAuth: EmailAuthEventDto) {
    return this.emailService.handleAuthEmail(emailAuth);
  }
}
