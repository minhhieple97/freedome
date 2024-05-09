import { AppConfigService } from '@notifications/config/app/config.service';
import { APP_ICON, IEmailLocals, IEmailMessageDetails } from '@freedome/common';
import { EmailService } from './consumers/email/email.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly appConfigService: AppConfigService,
  ) {}
  async handleCreateAuthEmail(data: IEmailMessageDetails) {
    const { receiverEmail, username, verifyLink, resetLink, template } = data;
    const locals: IEmailLocals = {
      appLink: this.appConfigService.clientUrl,
      appIcon: APP_ICON,
      username,
      verifyLink,
      resetLink,
    };
    await this.emailService.sendEmail(template, receiverEmail, locals);
  }
}
