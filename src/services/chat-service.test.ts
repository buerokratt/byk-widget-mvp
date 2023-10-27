import chatService from './chat-service';
import http from './http-service';
import { Message } from '../model/message-model';
import { RATING_TYPES, RUUTER_ENDPOINTS } from '../constants';
import { EndUserTechnicalData } from '../model/chat-ini-model';

jest.mock('../services/http-service');

describe('ChatService', () => {
  it('should query init chat', () => {
    const message: Message = { chatId: 'chatID', content: 'test', authorTimestamp: 'timeStamp', authorRole: 'R123123123' };
    const endUserTechnicalData: EndUserTechnicalData = { endUserUrl: '', endUserOs: '' };
    chatService.init(message, endUserTechnicalData);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.INIT_CHAT, { message, endUserTechnicalData });
  });

  it('should send new message', () => {
    const messageToSend: Message = { chatId: '1', content: 'hey', authorTimestamp: new Date().toString() };
    chatService.sendNewMessage(messageToSend);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.POST_MESSAGE, messageToSend);
  });

  it('should query all messages of a chat', () => {
    chatService.getMessages('1');
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.GET_MESSAGES_BY_CHAT_ID, { id: '1' });
  });

  it('should query chat by id', () => {
    chatService.getChatById('1');
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.GET_CHAT_BY_ID, { id: '1' });
  });

  it('should end given chat session', () => {
    const messageToSend: Message = { chatId: '1', content: 'hey', authorTimestamp: new Date().toString() };
    chatService.endChat(messageToSend);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.END_CHAT, messageToSend);
  });

  it('return chats, by chat id', () => {
    chatService.getChatById('cid');
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.GET_CHAT_BY_ID, { id: 'cid' });
  });

  it('should query message with rating', () => {
    const message: Message = { chatId: '1', content: 'hey', authorTimestamp: new Date().toString(), rating: RATING_TYPES.LIKED };
    chatService.sendMessageWithRating(message);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.POST_NEW_RATING, message);
  });

  it('should query npm rating', () => {
    chatService.sendNpmRating({ chatId: '1', npmRating: 3 });
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.SEND_NPM_RATING, { chatId: '1', feedbackRating: 3 });
  });

  it('should query feedback message', () => {
    chatService.sendFeedbackMessage({ userFeedback: 'Nice', chatId: '1' });
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.SEND_FEEDBACK_MESSAGE, { feedbackText: 'Nice', chatId: '1' });
  });

  it('should send message with new event', () => {
    const message: Message = { chatId: '1', content: 'hey', authorTimestamp: new Date().toString() };
    chatService.sendMessageWithNewEvent(message);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.SEND_MESSAGE_WITH_NEW_EVENT, message);
  });
});
