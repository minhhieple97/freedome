import { Injectable } from '@nestjs/common';
import { EmailService } from './consumers/email/email.service';

@Injectable()
export class AppService {
  constructor(private readonly emailService: EmailService) {}
}
