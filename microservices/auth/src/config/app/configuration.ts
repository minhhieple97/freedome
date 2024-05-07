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
}));
