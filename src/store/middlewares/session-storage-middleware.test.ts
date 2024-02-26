import sessionStorageMiddleware from './session-storage-middleware';
import { endChat, initChat } from '../../slices/chat-slice';
import { SESSION_STORAGE_CHAT_ID_KEY } from '../../constants';
import * as localStorageUtils from '../../utils/local-storage-utils';

const next = jest.fn();
const store = jest.fn();
const setToLocalStorage = jest.spyOn(localStorageUtils, 'setToLocalStorage').mockImplementation(() => null);
const CHAT_ID = '123';
const initAction = { type: initChat.fulfilled.type, payload: { id: CHAT_ID } };
const endAction = { type: endChat.pending.type };

describe('sessionStorageMiddleware', () => {
  it('calls setToLocalStorage on initChat fulfillment with correct arguments', () => {
    sessionStorageMiddleware(store as never)(next)(initAction);
    expect(setToLocalStorage).toHaveBeenCalledWith(SESSION_STORAGE_CHAT_ID_KEY, CHAT_ID);
  });

  it('calls setToLocalStorage on endChat pending with correct arguments', () => {
    sessionStorageMiddleware(store as never)(next)(endAction);
    expect(setToLocalStorage).toHaveBeenCalledWith(SESSION_STORAGE_CHAT_ID_KEY, null);
  });
});
