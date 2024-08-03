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
  get mongoUri(): string {
    return this.configService.get<string>('MONGODB_URI');
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
