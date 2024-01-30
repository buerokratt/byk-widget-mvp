/* eslint-disable */
export const SESSION_STORAGE_CHAT_ID_KEY = 'byk-va-cid';
export const LOCAL_STORAGE_TARA_LOGIN_REDIRECT = 'byk-va-tara-login-redirect';
export const OFFICE_HOURS_INTERVAL_TIMEOUT = 60000;
// BYK-648 enable to show customer service agent name in chat window
export const CLIENT_NAME_ENABLED = false;
export const EMAIL_REGEX = '^$|^[\\wöäüÖÄÜ!#$%&’*+\\/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+\\/=?`{|}~^-]+)*@(?:[a-zA-ZöäüÖÄÜ0-9-]+\\.)+[a-zA-ZöäüÖÄÜ]{2,6}$';
export const PHONE_NR_REGEX = '^$|^[+]*[0-9]{1,4}[-\\s.0-9]{6,15}$';
export const MESSAGE_MAX_CHAR_LIMIT = 3000;
export const MESSAGE_WARNING_LIMIT = 2900;
export const MESSAGE_VISIBILITY_LIMIT = 500;
export const MAXIMUM_MESSAGE_TEXT_LENGTH_FOR_ONE_ROW = 27;
export const FEEDBACK_CONFIRMATION_TIMEOUT = 5000;
export const FEEDBACK_MESSAGE_MAX_CHAR_LIMIT = 500;
export const FEEDBACK_MESSAGE_LIMIT_WARNING_AT = 400;
export const FEEDBACK_MESSAGE_LIMIT_VISIBILE_AT = 100;
export const MESSAGE_QUE_MAX_LENGTH = 5;
export const TERMS_AND_CONDITIONS_LINK = 'https://www.kratid.ee/kasutustingimused';
export const ERROR_MESSAGE = 'An error has occured';

export enum CHAT_STATUS {
  ENDED = 'ENDED',
  OPEN = 'OPEN',
}

export enum CHAT_MODES {
  FLOW = 'flow',
  FREE = 'free',
}

export enum CHAT_EVENTS {
  ANSWERED = 'answered',
  TERMINATED = 'terminated',
  CLIENT_LEFT = 'client-left',
  GREETING = 'greeting',
  RATING = 'rating',
  REQUESTED_AUTHENTICATION = 'requested-authentication',
  ASK_PERMISSION = 'ask-permission',
  ASK_PERMISSION_ACCEPTED = 'ask-permission-accepted',
  ASK_PERMISSION_REJECTED = 'ask-permission-rejected',
  ASK_PERMISSION_IGNORED = 'ask-permission-ignored',
  REQUESTED_CHAT_FORWARD = 'requested-chat-forward',
  REQUESTED_CHAT_FORWARD_ACCEPTED = 'requested-chat-forward-accepted',
  REQUESTED_CHAT_FORWARD_REJECTED = 'requested-chat-forward-rejected',
  REDIRECTED = 'redirected',
  CONTACT_INFORMATION = 'contact-information',
  CONTACT_INFORMATION_FULFILLED = 'contact-information-fulfilled',
  CONTACT_INFORMATION_REJECTED = 'contact-information-rejected',
}

export enum AUTHOR_ROLES {
  END_USER = 'end-user',
  BACKOFFICE_USER = 'backoffice-user',
}

export enum RUUTER_ENDPOINTS {
  INIT_CHAT = '/init-chat',
  GET_CHAT = '/chat',
  POST_MESSAGE = '/post-message',
  POST_NEW_RATING = '/post-message-with-rating',
  GET_MESSAGES_BY_CHAT_ID = '/get-messages-by-chat-id',
  END_CHAT = '/end-chat',
  GET_GREETING = '/get-greeting-message',
  SEND_NPM_RATING = '/post-chat-feedback-rating',
  SEND_FEEDBACK_MESSAGE = '/post-chat-feedback-text',
  GET_WAITING_TIME = '/get-estimated-waiting-time',
  SEND_MESSAGE_WITH_NEW_EVENT = '/post-message-with-new-event',
  REMOVE_CHAT_FORWARDING_VALUE = '/remove-chat-forwarding-value',
  GENERATE_FORWARDING_REQUEST = '/origin-forward',
}

export enum StyledButtonType {
  LIGHT = 'LIGHT',
  GRAY = 'GRAY',
  DARK = 'DARK',
}

export enum RATING_TYPES {
  LIKED = 'liked',
  DISLIKED = 'disliked',
}
