import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT,
  nodeEnv: process.env.NODE_ENV,
  notificationsPort: process.env.NOTIFICATIONS_PORT,
  notificationsHost: process.env.NOTIFICATIONS_HOST,
  jwtSecret: process.env.JWT_SECRET,
  messageHost: process.env.MESSAGE_HOST,
  messagePort: process.env.MESSAGE_PORT,
  reviewHost: process.env.REVIEW_HOST,
  reviewPort: process.env.REVIEW_PORT,
  orderHost: process.env.ORDER_HOST,
  orderPort: process.env.ORDER_PORT,
  sellerHost: process.env.SELLER_HOST,
  sellerPort: process.env.SELLER_PORT,
  searchHost: process.env.SEARCH_HOST,
  searchPort: process.env.SEARCH_PORT,
  authHost: process.env.AUTH_HOST,
  authPort: process.env.AUTH_PORT,
  gigHost: process.env.GIG_HOST,
  gigPort: process.env.GIG_PORT,
}));
