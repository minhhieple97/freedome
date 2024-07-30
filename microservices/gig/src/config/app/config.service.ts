import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
  get gigGrpcUrl(): string {
    return this.configService.get<string>('GIG_GRPC_URL');
  }

  get gigElasticSearchIndex(): string {
    return this.configService.get<string>('GIG_ELASTIC_SEARCH_INDEX');
  }
}
