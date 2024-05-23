import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  tcpPort: process.env.TCP_PORT,
  nodeEnv: process.env.NODE_ENV,
  jwtToken: process.env.JWT_TOKEN,
  gatewayJwtToken: process.env.GATEWAY_JWT_TOKEN,
  secretKeyOne: process.env.SECRET_KEY_ONE,
  secretKeyTwo: process.env.SECRET_KEY_TWO,
  databaseUrl: process.env.DATABASE_URL,
  rabbitmqEndpoint: process.env.RABBITMQ_ENDPOINT,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_S3_REGION,
  awsBucketS3Name: process.env.AWS_BUCKET_S3_NAME,
  authGrpcUrl: process.env.AUTH_GRPC_URL,
}));
