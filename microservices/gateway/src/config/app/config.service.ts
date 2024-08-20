import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appPort(): number {
    return Number(this.configService.get<number>('APP_PORT'));
  }
  get clientUrl(): string {
    return this.configService.get<string>('CLIENT_URL');
  }
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
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
  get jwtToken(): string {
    return this.configService.get<string>('JWT_TOKEN');
  }

  get gatewayJwtToken(): string {
    return this.configService.get<string>('GATEWAY_JWT_TOKEN');
  }

  get secretKeyOne(): string {
    return this.configService.get<string>('SECRET_KEY_ONE');
  }

  get secretKeyTwo(): string {
    return this.configService.get<string>('SECRET_KEY_TWO');
  }
  get rabbitmqEndpoint(): string {
    return this.configService.get<string>('RABBITMQ_ENDPOINT');
  }
  get authGrpcUrl(): string {
    return this.configService.get<string>('AUTH_GRPC_URL');
  }
  get userGrpcUrl(): string {
    return this.configService.get<string>('USER_GRPC_URL');
  }

  get gigGrpcUrl(): string {
    return this.configService.get<string>('GIG_GRPC_URL');
  }
}
