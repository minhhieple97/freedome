export const AUTH_EMAIL_QUEUE_NAME = 'auth_email_queue';
export const ORDER_EMAIL_QUEUE_NAME = 'order_email_queue';
export const USER_BUYER_QUEUE_NAME = 'user_buyer_queue';
export const USER_SELLER_QUEUE_NAME = 'user_seller_queue';
export const SELLER_REVIEW_QUEUE_NAME = 'seller_review_queue';
export const GIG_QUEUE_NAME = 'gig_queue';
export const ACCEPT_ALL_MESSAGE_FROM_TOPIC = '#';
export const EVENTS_RMQ = {
  AUTH_EMAIL: 'auth_email',
  USER_BUYER: 'user_buyer',
  CREATE_ORDER: 'create_order',
  CANCEL_ORDER: 'cancel_order',
  UPDATE_GIG_COUNT: 'update_gig_count',
  APPROVE_ORDER: 'approve_order',
  REVIEW: 'review',
};
export const EVENTS_HTTP = {
  USER_CREATE: 'user_create',
  USER_SEARCH_BY_CREDENTIALS: 'user_search_by_credentials',
  AT_RF_CREATE: 'at_rf_create',
  TOKEN_DECODE: 'token_decode',
  USER_GET_BY_ID: 'user_get_by_id',
  VERYFY_EMAIL: 'verify_email',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_PASSWORD: 'reset_password',
  RESET_PASSWORD_TOKEN: 'reset_password_token',
  RESEND_EMAIL: 'resend_email',
};

export const EXCHANGE_NAME = {
  EMAIL_NOTIFICATIONS: 'email_notifications',
  USER_BUYER: 'user_buyer',
  USER_SELLER: 'user_seller',
  SELLER_REVIEW: 'seller_review',
  UPDATE_GIG: 'update_gig',
};

export const ROUTING_KEY = {
  AUTH_EMAIL: 'auth_email',
  CREATE_USER_BUYER: 'create_user_buyer',
  CREATE_ORDER: 'create_order',
  APPROVE_ORDER: 'approve_order',
  CANCEL_ORDER: 'cancel_order',
  UPDATE_GIG_COUNT: 'update_gig_count',
  BUYER_REVIEW: 'buyer_review',
  GET_SELLERS: 'get_sellers',
  UPDATE_GIG_FROM_BUYER_REVIEW: 'update_gig_from_buyer_review',
};
