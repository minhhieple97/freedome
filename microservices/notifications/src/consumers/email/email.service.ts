import {
  IEmailLocals,
  EmailAuthEventDto,
  APP_ICON,
  EmailOrderEventDto,
  LoggerService,
} from '@freedome/common';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import { AppConfigService } from '../../config/app/config.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';
import { EMAIL_TEMPLATES_NAME } from '../../common/constants';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(
    private readonly logger: LoggerService,
    private readonly appConfig: AppConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.appConfig.senderEmailHost,
      port: this.appConfig.senderEmailPort,
      auth: {
        user: this.appConfig.senderEmailUsername,
        pass: this.appConfig.senderEmailPassword,
      },
    } as SMTPTransport.Options);
  }

  async sendEmail(
    template: string,
    receiver: string,
    locals: IEmailLocals,
  ): Promise<void> {
    try {
      const email: Email = new Email({
        message: {
          from: `Freedome App <${this.appConfig.senderEmail}>`,
        },
        send: true,
        preview: false,
        transport: this.transporter,
        views: {
          options: {
            extension: 'ejs',
          },
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: path.join(
              __dirname,
              '../../dist/microservices/notifications',
            ),
          },
        },
      });

      await email.send({
        template: path.join(
          __dirname,
          '..',
          'notifications/email-templates',
          template,
        ),
        message: { to: receiver },
        locals,
      });
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }

  async handleAuthEmail(emailAuthDataEvent: EmailAuthEventDto) {
    this.logger.log(EmailService.name, emailAuthDataEvent);
  }
  async handleOrderEmail(emailOrderEventDto: EmailOrderEventDto) {
    const {
      receiverEmail,
      username,
      template,
      sender,
      offerLink,
      amount,
      buyerUsername,
      sellerUsername,
      title,
      description,
      deliveryDays,
      orderId,
      orderDue,
      requirements,
      orderUrl,
      originalDate,
      newDate,
      reason,
      subject,
      header,
      type,
      message,
      serviceFee,
      total,
    } = emailOrderEventDto;
    const locals: IEmailLocals = {
      appLink: `${this.appConfig.clientUrl}`,
      appIcon: APP_ICON,
      username,
      sender,
      offerLink,
      amount,
      buyerUsername,
      sellerUsername,
      title,
      description,
      deliveryDays,
      orderId,
      orderDue,
      requirements,
      orderUrl,
      originalDate,
      newDate,
      reason,
      subject,
      header,
      type,
      message,
      serviceFee,
      total,
    };
    if (template === EMAIL_TEMPLATES_NAME.ORDER_PLACED) {
      await this.sendEmail(
        EMAIL_TEMPLATES_NAME.ORDER_PLACED,
        receiverEmail,
        locals,
      );
      await this.sendEmail(
        EMAIL_TEMPLATES_NAME.ORDER_RECEIPT,
        receiverEmail,
        locals,
      );
      return;
    }
    await this.sendEmail(template, receiverEmail, locals);
  }
}
