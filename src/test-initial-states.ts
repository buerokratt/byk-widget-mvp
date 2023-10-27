import { ChatState } from './slices/chat-slice';
import { AuthenticationState } from './slices/authentication-slice';
import { Message } from './model/message-model';
import { CHAT_STATUS } from './constants';

export const initialChatState: ChatState = {
  endUserContacts: {
    idCode: '',
    mailAddress: '',
    phoneNr: '',
    comment: '',
  },
  errorMessage: '',
  chatId: null,
  customerSupportId: '1',
  isChatOpen: false,
  showContactForm: false,
  isChatRedirected: false,
  messages: [],
  messageQueue: [],
  eventMessagesToHandle: [],
  chatStatus: null,
  lastReadMessageTimestamp: null,
  contactMsgId: '',
  estimatedWaiting: {
    isActive: false,
    time: 20,
  },
  loading: false,
  newMessagesAmount: 0,
  feedback: {
    isFeedbackConfirmationShown: false,
    isFeedbackMessageGiven: false,
    isFeedbackRatingGiven: false,
    showFeedbackWarning: false,
  },
};

export const initialAuthState: AuthenticationState = {
  fetchingUserInfo: true,
  loggedInWithTaraJwt: false,
  isAuthenticated: false,
  authenticationFailed: false,
  userInfo: {
    jwtExpirationTimestamp: '',
    firstName: '',
    lastName: '',
    personalCode: '',
  },
};

export const mockMessages: Message[] = [
  {
    chatId: 'id',
    content: 'hello world',
    authorTimestamp: '2022-03-09T10:25:31.519Z',
  },
];

export const mockMessage = {
  chatId: '123',
  content: 'Hello World',
  authorTimestamp: new Date().toISOString(),
};

export const mockMessage2 = {
  chatId: '321',
  content: 'bye',
  authorTimestamp: new Date().toISOString(),
};

export const mockChat = {
  id: '1',
  customerSupportId: '9',
  status: CHAT_STATUS.OPEN,
};
