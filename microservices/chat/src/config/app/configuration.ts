import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}));
