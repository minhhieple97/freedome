import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT,
  enableApm: process.env.ENABLE_APM,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  rabbitmqEndpoint: process.env.RABBITMQ_ENDPOINT,
  senderEmail: process.env.SENDER_EMAIL,
  senderEmailPassword: process.env.SENDER_EMAIL_PASSWORD,
  elasticSearchUrl: process.env.ELASTIC_SEARCH_URL,
  elasticApmServerUrl: process.env.ELASTIC_APM_SERVER_URL,
  elasticApmSecretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
}));
