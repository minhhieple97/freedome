import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
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
  get awsAccessKey(): string {
    return this.configService.get<string>('AWS_ACCESS_KEY_ID');
  }
  get awsSecretKey(): string {
    return this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  }
  get awsRegion(): string {
    return this.configService.get<string>('AWS_S3_REGION');
  }
  get awsBucketS3Name(): string {
    return this.configService.get<string>('AWS_BUCKET_S3_NAME');
  }
}
