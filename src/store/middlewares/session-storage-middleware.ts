import { Middleware } from 'redux';
import { SESSION_STORAGE_CHAT_ID_KEY } from '../../constants';
import { endChat, generateForwardingRequest, initChat, resetNewMessagesAmount, resetState, setIsChatOpen } from '../../slices/chat-slice';
import { setToSessionStorage } from '../../utils/session-storage-utils';
import { clearStateVariablesFromSessionStorage } from '../../utils/state-management-utils';

const sessionStorageMiddleware: Middleware = () => (next) => (action) => {
  if (initChat.fulfilled.match(action)) setToSessionStorage(SESSION_STORAGE_CHAT_ID_KEY, action.payload.id);
  if (generateForwardingRequest.fulfilled.match(action) && action.payload[0].externalId) {
    setToSessionStorage(SESSION_STORAGE_CHAT_ID_KEY, action.payload[0].externalId);
  }
  if (endChat.pending.match(action)) clearStateVariablesFromSessionStorage();
  if (resetState.match(action)) clearStateVariablesFromSessionStorage();
  if (setIsChatOpen.match(action)) setToSessionStorage('newMessagesAmount', 0);
  if (resetNewMessagesAmount.match(action)) setToSessionStorage('newMessagesAmount', 0);

  return next(action);
};

export default sessionStorageMiddleware;
