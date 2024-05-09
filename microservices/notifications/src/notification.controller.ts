import { Controller } from '@nestjs/common';
import { EVENTS_RMQ, IEmailMessageDetails } from '@freedome/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @MessagePattern(EVENTS_RMQ.AUTH_EMAIL)
  handleCreateAuthEmail(data: IEmailMessageDetails) {
    return this.notificationService.handleCreateAuthEmail(data);
  }
}
