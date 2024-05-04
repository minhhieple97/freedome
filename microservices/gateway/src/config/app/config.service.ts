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
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  get authHost(): string {
    return this.configService.get<string>('AUTH_HOST');
  }
  get authPort(): number {
    return this.configService.get<number>('AUTH_PORT');
  }
  get gigHost(): string {
    return this.configService.get<string>('GIG_HOST');
  }
  get gigPort(): number {
    return this.configService.get<number>('GIG_PORT');
  }
  get messageHost(): string {
    return this.configService.get<string>('MESSAGE_HOST');
  }

  get messagePort(): number {
    return this.configService.get<number>('MESSAGE_PORT');
  }

  get reviewHost(): string {
    return this.configService.get<string>('REVIEW_HOST');
  }

  get reviewPort(): number {
    return this.configService.get<number>('REVIEW_PORT');
  }

  get orderHost(): string {
    return this.configService.get<string>('ORDER_HOST');
  }

  get orderPort(): number {
    return this.configService.get<number>('ORDER_PORT');
  }

  get sellerHost(): string {
    return this.configService.get<string>('SELLER_HOST');
  }

  get sellerPort(): number {
    return this.configService.get<number>('SELLER_PORT');
  }

  get searchHost(): string {
    return this.configService.get<string>('SEARCH_HOST');
  }

  get searchPort(): number {
    return this.configService.get<number>('SEARCH_PORT');
  }
}
