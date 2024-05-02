import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { AppConfigModule } from '../../config/app/config.module';
import { IEmailLocals, LoggerModule, LoggerService } from '@freedome/common';
import { Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
describe('EmailService', () => {
  let service: EmailService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, LoggerModule],
      providers: [
        EmailService,
        {
          provide: LoggerService,
          scope: Scope.TRANSIENT,
          inject: [INQUIRER],
          useFactory: (parentClass: object) =>
            new LoggerService(parentClass.constructor.name),
        },
      ],
    }).compile();
    service = module.get<EmailService>(EmailService);
  });
  it('True should be Truthy', () => {
    expect(true).toBeTruthy();
  });
  // send email with valid template, receiver and locals
  it('should send email with valid template, receiver and locals', async () => {
    const template = 'valid-template';
    const receiver = 'example@example.com';
    const locals: IEmailLocals = {
      appLink: 'https://example.com',
      appIcon: 'https://i.ibb.co/FDVhD0J/Screenshot-2024-04-30-134547.png',
    };

    // Act
    await service.sendEmail(template, receiver, locals);

    // Assert
    // Add assertions here to check if the email was sent successfully
  });
});
