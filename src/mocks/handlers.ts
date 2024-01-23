import { rest } from 'msw';

import messagesForChatInTimerange from './responses/messages-for-chat-in-timerange.json';
import messagesByChatId from './responses/messages-by-chat-id.json';
import initChat from './responses/init-chat.json';
import chatById from './responses/chat-by-Id.json';
import endChat from './responses/end-chat.json';
import postMessage from './responses/post-message.json';
import { RUUTER_ENDPOINTS } from '../constants';

const ruuterUrl = 'http://localhost:8080';

const handlers = [
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.INIT_CHAT}`, (_req, res, ctx) => res(ctx.json(initChat))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.POST_MESSAGE}`, (_req, res, ctx) => res(ctx.json(postMessage))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_MESSAGES_BY_CHAT_ID}`, (_req, res, ctx) => res(ctx.json(messagesByChatId))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.END_CHAT}`, (_req, res, ctx) => res(ctx.json(endChat))),
  rest.post(`${ruuterUrl}${RUUTER_ENDPOINTS.GET_CHAT}`, (_req, res, ctx) => res(ctx.json(chatById))),
];

export default handlers;
