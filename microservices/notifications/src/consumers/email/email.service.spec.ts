import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { AppConfigModule } from '../../config/app/config.module';
import {
  EmailOrderEventDto,
  LoggerModule,
  LoggerService,
} from '@freedome/common';
import { Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { EMAIL_TEMPLATES_NAME } from '../../common/constants/constants';
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

  it('Should call  sendEmail method and return undefine', async () => {
    const data: EmailOrderEventDto = {
      receiverEmail: 'hieplevuc@gmail.com',
      username: 'john_doe',
      template: EMAIL_TEMPLATES_NAME.ORDER_PLACED,
      sender: 'sender@example.com',
      offerLink: 'https://example.com/offer',
      amount: '10.99',
      buyerUsername: 'jane_doe',
      sellerUsername: 'john_doe',
      title: 'Example Product',
      description: 'This is a description of the example product.',
      deliveryDays: '2-3 business days',
      orderId: '123456789',
      orderDue: '2022-01-01T12:00:00Z',
      requirements: 'This is a requirement for the order.',
      orderUrl: 'https://example.com/order',
      originalDate: '2022-01-01T12:00:00Z',
      newDate: '2022-01-02T12:00:00Z',
      reason: 'This is the reason for the change.',
      subject: 'Order Confirmation',
      header: 'Welcome to our store!',
      type: 'info',
      message: 'Thank you for your order!',
      serviceFee: '1.99',
      total: '12.98',
    };
    const mockMethod = jest
      .spyOn(service, 'sendEmail')
      .mockReturnValue(undefined);
    // Act;
    const result = await service.handleOrderEmail(data);
    // Assert
    expect(mockMethod).toHaveBeenCalled();
    expect(mockMethod).toBeCalledTimes(2);
    expect(result).toBeUndefined();
  });
});
