import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appPort(): number {
    return Number(this.configService.get<number>('APP_PORT'));
  }
  get notificationsPort(): number {
    return Number(this.configService.get<number>('NOTIFICATIONS_PORT'));
  }
  get notificationsHost(): string {
    return this.configService.get<string>('NOTIFICATIONS_HOST');
  }
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
}
