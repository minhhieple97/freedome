import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  userGrpcUrl: process.env.USER_GRPC_URL,
  mongoUri: process.env.MONGODB_URI,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_S3_REGION,
  awsBucketS3Name: process.env.AWS_BUCKET_S3_NAME,
}));
