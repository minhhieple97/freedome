import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appPort(): number {
    return Number(this.configService.get<number>('APP_PORT'));
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get clientUrl(): string {
    return this.configService.get<string>('CLIENT_URL');
  }
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }
  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }
}
