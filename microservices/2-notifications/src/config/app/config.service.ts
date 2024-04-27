import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appPort(): number {
    return Number(this.configService.get<number>('APP_PORT'));
  }
  get enableApm(): number {
    return Number(this.configService.get<number>('ENABLE_APM'));
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get clientUrl(): string {
    return this.configService.get<string>('CLIENT_URL');
  }

  get rabbitmqEndpoint(): string {
    return this.configService.get<string>('RABBITMQ_ENDPOINT');
  }

  get senderEmail(): string {
    return this.configService.get<string>('SENDER_EMAIL');
  }

  get senderEmailPassword(): string {
    return this.configService.get<string>('SENDER_EMAIL_PASSWORD');
  }

  get elasticSearchUrl(): string {
    return this.configService.get<string>('ELASTIC_SEARCH_URL');
  }

  get elasticApmServerUrl(): string {
    return this.configService.get<string>('ELASTIC_APM_SERVER_URL');
  }

  get elasticApmSecretToken(): string {
    return this.configService.get<string>('ELASTIC_APM_SECRET_TOKEN');
  }
}
