import { IAppConfig } from '@freedome/common/interfaces/app-config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService implements IAppConfig {
  constructor(private configService: ConfigService) {}

  get tcpPort(): number {
    return Number(this.configService.get<number>('TCP_PORT'));
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
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
  get rabbitmqEndpoint(): string {
    return this.configService.get<string>('RABBITMQ_ENDPOINT');
  }
}
