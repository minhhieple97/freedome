import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT,
  nodeEnv: process.env.NODE_ENV,
}));
