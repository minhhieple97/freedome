import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  userGrpcUrl: process.env.USER_GRPC_URL,
  mongoUri: process.env.MONGODB_URI,
}));
