import { AppConfigService } from '@notifications/config/app/config.service';
import {
  APP_ICON,
  AUTH_EMAIL_QUEUE_NAME,
  EXCHANGE_NAME,
  IEmailLocals,
  IEmailMessageDetails,
  ROUTING_KEY,
} from '@freedome/common';
import { EmailService } from './consumers/email/email.service';
import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly appConfigService: AppConfigService,
  ) {}
  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.EMAIL_NOTIFICATIONS,
    routingKey: ROUTING_KEY.AUTH_EMAIL,
    queue: AUTH_EMAIL_QUEUE_NAME,
  })
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
