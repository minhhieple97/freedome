export const AUTH_EMAIL_QUEUE_NAME = 'auth_email_queue';
export const ORDER_EMAIL_QUEUE_NAME = 'order_email_queue';
export const USER_BUYER_QUEUE_NAME = 'user_buyer_queue';
export const USER_SELLER_QUEUE_NAME = 'user_seller_queue';
export const SELLER_REVIEW_QUEUE_NAME = 'seller_review_queue';
export const GIG_QUEUE_NAME = 'gig_queue';
export const USER_QUEUE_NAME = 'user_queue';
export const ACCEPT_ALL_MESSAGE_FROM_TOPIC = '#';
export const EXCHANGE_NAME = {
  EMAIL_NOTIFICATIONS: 'email_notifications',
  USER_BUYER: 'user_buyer',
  USER_SELLER: 'user_seller',
  SELLER_REVIEW: 'seller_review',
  UPDATE_GIG: 'update_gig',
  UPDATE_USER: 'update_user',
  CREATE_USER: 'create_user',
};
export const ROUTING_KEY = {
  EMPTY: '',
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
