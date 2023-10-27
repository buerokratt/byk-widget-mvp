import sessionStorageMiddleware from './session-storage-middleware';
import { endChat, initChat } from '../../slices/chat-slice';
import { SESSION_STORAGE_CHAT_ID_KEY } from '../../constants';
import * as sessionStorageUtils from '../../utils/session-storage-utils';

const next = jest.fn();
const store = jest.fn();
const setToSessionStorage = jest.spyOn(sessionStorageUtils, 'setToSessionStorage').mockImplementation(() => null);
const CHAT_ID = '123';
const initAction = { type: initChat.fulfilled.type, payload: { id: CHAT_ID } };
const endAction = { type: endChat.pending.type };

describe('sessionStorageMiddleware', () => {
  it('calls setToSessionStorage on initChat fulfillment with correct arguments', () => {
    sessionStorageMiddleware(store as never)(next)(initAction);
    expect(setToSessionStorage).toHaveBeenCalledWith(SESSION_STORAGE_CHAT_ID_KEY, CHAT_ID);
  });

  it('calls setToSessionStorage on endChat pending with correct arguments', () => {
    sessionStorageMiddleware(store as never)(next)(endAction);
    expect(setToSessionStorage).toHaveBeenCalledWith(SESSION_STORAGE_CHAT_ID_KEY, null);
  });
});
