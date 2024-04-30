import { IEmailLocals, EmailAuthDataEventDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as nodemailer from 'nodemailer';
import { Logger } from 'winston';
import * as Email from 'email-templates';
import { AppConfigService } from '../../config/app/config.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
      console.error(error);
      this.logger.error(error);
    }
  }

  async handleAuthEmail(emailAuthDataEvent: EmailAuthDataEventDto) {
    console.log({ emailAuthDataEvent });
  }
}
