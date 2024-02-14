import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../model/message-model';
import ChatService from '../services/chat-service';
import { AUTHOR_ROLES, CHAT_EVENTS, CHAT_STATUS, ERROR_MESSAGE, SESSION_STORAGE_CHAT_ID_KEY, CHAT_MODES } from '../constants';
import { getFromSessionStorage, setToSessionStorage } from '../utils/session-storage-utils';
import { Chat } from '../model/chat-model';
import { clearStateVariablesFromSessionStorage, findMatchingMessageFromMessageList } from '../utils/state-management-utils';
import { getChatModeBasedOnLastMessage } from '../utils/chat-utils';

export interface EstimatedWaiting {
  isActive: boolean;
  time: number;
}

export interface ChatState {
  chatId: string | null;
  isChatOpen: boolean;
  chatStatus: CHAT_STATUS | null;
  customerSupportId: string;
  lastReadMessageTimestamp: string | null;
  messages: Message[];
  messageQueue: Message[];
  newMessagesAmount: number;
  eventMessagesToHandle: Message[];
  errorMessage: string;
  estimatedWaiting: EstimatedWaiting;
  loading: boolean;
  showContactForm: boolean;
  contactMsgId: string;
  isChatRedirected: boolean;
  feedback: {
    isFeedbackConfirmationShown: boolean;
    isFeedbackMessageGiven: boolean;
    isFeedbackRatingGiven: boolean;
    showFeedbackWarning: boolean;
  };
  endUserContacts: {
    idCode: string;
    mailAddress: string;
    phoneNr: string;
    comment: string;
  };
  chatMode: CHAT_MODES;
}

const initialState: ChatState = {
  chatId: null,
  isChatOpen: false,
  chatStatus: null,
  customerSupportId: '',
  lastReadMessageTimestamp: null,
  messages: [],
  messageQueue: [],
  newMessagesAmount: 0,
  eventMessagesToHandle: [],
  errorMessage: '',
  showContactForm: false,
  isChatRedirected: false,
  estimatedWaiting: {
    isActive: false,
    time: 0,
  },
  loading: false,
  endUserContacts: {
    idCode: '',
    mailAddress: '',
    phoneNr: '',
    comment: '',
  },
  contactMsgId: '',
  feedback: {
    isFeedbackConfirmationShown: false,
    isFeedbackMessageGiven: false,
    isFeedbackRatingGiven: false,
    showFeedbackWarning: false,
  },
  chatMode: CHAT_MODES.FREE,
};

export const initChat = createAsyncThunk('chat/init', async (message: Message) =>
  ChatService.init(message, {
    endUserUrl: window.location.href.toString(),
    endUserOs: navigator.userAgent.toString(),
  }),
);

export const getChat = createAsyncThunk('chat/getChat', async (_args, thunkApi) => {
  return ChatService.getChat();
});

export const getChatMessages = createAsyncThunk('chat/getChatMessages', async (args, thunkApi) => {
  const {
    chat: { chatId },
  } = thunkApi.getState() as { chat: ChatState };
  return chatId ? ChatService.getMessages(chatId) : null;
});

export const sendChatNpmRating = createAsyncThunk('chat/sendChatNpmRating', (args: { NpmRating: number }, thunkApi) => {
  const {
    chat: { chatId },
  } = (thunkApi.getState() as { chat: ChatState }) || '';
  if (chatId === null) return;
  ChatService.sendNpmRating({ chatId, npmRating: args.NpmRating });
});

export const sendFeedbackMessage = createAsyncThunk('chat/sendFeedbackMessage', (args: { userInput: string }, thunkApi) => {
  const {
    chat: { chatId },
  } = (thunkApi.getState() as { chat: ChatState }) || '';
  if (chatId === null) return;
  ChatService.sendFeedbackMessage({ chatId, userFeedback: args.userInput });
});

export const endChat = createAsyncThunk('chat/endChat', async (_args, thunkApi) => {
  const {
    chat: { chatStatus, chatId },
  } = thunkApi.getState() as { chat: ChatState };
  
  thunkApi.dispatch(resetState());

  if(chatStatus === CHAT_STATUS.ENDED)
    return null;

  return ChatService.endChat({
      chatId,
      event: CHAT_EVENTS.CLIENT_LEFT,
      authorTimestamp: new Date().toISOString(),
      authorRole: AUTHOR_ROLES.END_USER,
    });
});

export const sendMessageWithRating = createAsyncThunk('chat/sendMessageWithRating', async (message: Message) =>
  ChatService.sendMessageWithRating(message),
);

export const sendMessageWithNewEvent = createAsyncThunk('chat/sendMessageWithNewEvent', (message: Message) =>
  ChatService.sendMessageWithNewEvent(message),
);

export const getGreeting = createAsyncThunk('chat/getGreeting', async () => ChatService.getGreeting());

export const sendNewMessage = createAsyncThunk('chat/sendNewMessage', (message: Message) => ChatService.sendNewMessage(message));

export const getEstimatedWaitingTime = createAsyncThunk('chat/getEstimatedWaitingTime', async () => ChatService.getEstimatedWaitingTime());

export const removeChatForwardingValue = createAsyncThunk('chat/removeChatForwardingValue', async () => ChatService.removeChatForwardingValue());

export const generateForwardingRequest = createAsyncThunk('chat/generateForwardingRequest', async () => ChatService.generateForwardingRequest());

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetState: () => initialState,
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setIsChatOpen: (state, action: PayloadAction<boolean>) => {
      state.chatId = getFromSessionStorage(SESSION_STORAGE_CHAT_ID_KEY);
      state.isChatOpen = action.payload;
      state.newMessagesAmount = 0;
    },
    clearMessageQueue: (state) => {
      state.messageQueue = [];
    },
    setFeedbackMessageGiven: (state, action: PayloadAction<boolean>) => {
      state.feedback.isFeedbackMessageGiven = action.payload;
    },
    setFeedbackRatingGiven: (state, action: PayloadAction<boolean>) => {
      state.feedback.isFeedbackRatingGiven = action.payload;
      state.feedback.showFeedbackWarning = false;
    },
    setFeedbackWarning: (state, action: PayloadAction<boolean>) => {
      state.feedback.showFeedbackWarning = action.payload;
    },
    setShowContactForm: (state, action: PayloadAction<boolean>) => {
      state.showContactForm = action.payload;
    },
    queueMessage: (state, action: PayloadAction<Message>) => {
      state.messageQueue.push(action.payload);
    },
    resetNewMessagesAmount: (state) => {
      state.newMessagesAmount = 0;
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages.map((message) => (message.id === action.payload.id ? action.payload : message));
    },
    setIsFeedbackConfirmationShown: (state, action: PayloadAction<boolean>) => {
      state.feedback.isFeedbackConfirmationShown = action.payload;
    },
    setEstimatedWaitingTimeToZero: (state) => {
      state.estimatedWaiting.time = 0;
    },
    setEmailAdress: (state, action) => {
      state.endUserContacts.mailAddress = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.endUserContacts.phoneNr = action.payload;
    },
    setChat: (state, action: PayloadAction<Chat>) => {
      if (action.payload) {
        state.chatStatus = action.payload.status as CHAT_STATUS;
        state.customerSupportId = action.payload.customerSupportId;
      }
    },
    addMessagesToDisplay: (state, action: PayloadAction<Message[]>) => {
      let receivedMessages = action.payload || [];
      if (!receivedMessages.length) return;
      
      const newMessagesList = state.messages.map((existingMessage) => {
        const matchingMessage = findMatchingMessageFromMessageList(existingMessage, receivedMessages);
        if (!matchingMessage) return existingMessage;
        receivedMessages = receivedMessages.filter((rMsg) => rMsg.id !== matchingMessage.id);
        return { ...existingMessage, ...matchingMessage };
      });

      newMessagesList.push(...receivedMessages);
      if(newMessagesList.length === state.messages.length){
        return;
      }
      state.messages = newMessagesList;
      state.lastReadMessageTimestamp = new Date().toISOString();
      state.newMessagesAmount += receivedMessages.length;
      setToSessionStorage('newMessagesAmount', state.newMessagesAmount);

      state.chatMode = getChatModeBasedOnLastMessage(state.messages);
    },
    handleStateChangingEventMessages: (state, action: PayloadAction<Message[]>) => {
      action.payload.forEach((msg) => {
        switch (msg.event) {
          case CHAT_EVENTS.ASK_PERMISSION_IGNORED:
            state.messages = state.messages.map((message) => (message.id === msg.id ? msg : message));
            break;
          case CHAT_EVENTS.CONTACT_INFORMATION:
            state.showContactForm = true;
            state.contactMsgId = msg.id || '';
            break;
          case CHAT_EVENTS.ANSWERED:
            state.chatStatus = CHAT_STATUS.ENDED;
            clearStateVariablesFromSessionStorage();
            break;
          case CHAT_EVENTS.TERMINATED:
            clearStateVariablesFromSessionStorage();
            state.chatStatus = CHAT_STATUS.ENDED;
            break;
          default:
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initChat.pending, (state) => {
      state.lastReadMessageTimestamp = new Date().toISOString();
      state.loading = true;
    });
    builder.addCase(initChat.fulfilled, (state, action) => {
      state.chatId = action.payload.id;
      state.loading = false;
      state.chatStatus = CHAT_STATUS.OPEN;
    });
    builder.addCase(getChat.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.chatStatus = action.payload.status as CHAT_STATUS;
      state.customerSupportId = action.payload.customerSupportId;
    });
    builder.addCase(getChatMessages.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.lastReadMessageTimestamp = new Date().toISOString();
      state.messages = action.payload;
      state.chatMode = getChatModeBasedOnLastMessage(state.messages);
    });
    builder.addCase(getGreeting.fulfilled, (state, action) => {
      if (!action.payload.isActive) return;
      state.messages.push({
        content: action.payload.est.replaceAll(/\\n/g, '\n'),
        chatId: null,
        event: 'greeting',
        authorTimestamp: new Date().toISOString(),
      });
    });
    builder.addCase(endChat.fulfilled, (state) => {
      state.chatStatus = CHAT_STATUS.ENDED;
      state.feedback.isFeedbackMessageGiven = false;
      state.feedback.isFeedbackRatingGiven = false;
      clearStateVariablesFromSessionStorage();
    });
    builder.addCase(sendChatNpmRating.rejected, (state) => {
      state.errorMessage = ERROR_MESSAGE;
    });
    builder.addCase(sendFeedbackMessage.rejected, (state) => {
      state.errorMessage = ERROR_MESSAGE;
    });
    builder.addCase(getEstimatedWaitingTime.fulfilled, (state, action) => {
      state.estimatedWaiting = action.payload;
    });
    builder.addCase(generateForwardingRequest.fulfilled, (state, action) => {
      if (action.payload[0].externalId) {
        state.chatId = action.payload[0].externalId;
        state.isChatRedirected = true;
      }
    });
  },
});

export const {
  addMessage,
  setChatId,
  setIsChatOpen,
  resetState,
  clearMessageQueue,
  queueMessage,
  updateMessage,
  setFeedbackMessageGiven,
  setFeedbackRatingGiven,
  setFeedbackWarning,
  resetNewMessagesAmount,
  setPhoneNumber,
  setIsFeedbackConfirmationShown,
  setEmailAdress,
  setShowContactForm,
  setEstimatedWaitingTimeToZero,
  setChat,
  addMessagesToDisplay,
  handleStateChangingEventMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
