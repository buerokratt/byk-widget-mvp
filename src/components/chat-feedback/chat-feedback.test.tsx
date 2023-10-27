import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import chatReducer from '../../slices/chat-slice';
import authenticationReducer from '../../slices/authentication-slice';
import ChatFeedback from './chat-feedback';
import ChatService from '../../services/chat-service';
import { CHAT_STATUS } from '../../constants';
import Chat from '../chat/chat';
import widgetReducer from '../../slices/widget-slice';
import ChatFeedbackConfirmation from './chat-feedback-confirmation';
import { initialChatState } from '../../test-initial-states';

let store: EnhancedStore;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
  });
}

function createStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      widget: widgetReducer,
      authentication: authenticationReducer,
    },
    preloadedState: {
      chat: { ...initialChatState, chatId: '1', chatStatus: CHAT_STATUS.ENDED },
    },
  });
}

describe('chat-feedback', () => {
  beforeEach(() => {
    store = createEmptyStore();
  });

  it('should call render feedback confirmation', () => {
    store = createStore();
    render(
      <Provider store={store}>
        <ChatFeedbackConfirmation />
      </Provider>,
    );
  });

  it('should render buttons & text', () => {
    render(
      <Provider store={store}>
        <ChatFeedback />
      </Provider>,
    );
    screen.getByText('1');
    screen.getByText('10');

    screen.getByText('feedback.upperText');
    screen.getByText('feedback.lowerText');
  });

  it('should call ChatService.sendChatNpmRating when rating is given', () => {
    store = createStore();
    ChatService.sendNpmRating = jest.fn(() => Promise.resolve());
    render(
      <Provider store={store}>
        <ChatFeedback />
      </Provider>,
    );
    fireEvent.click(screen.getByText('1'));
    expect(ChatService.sendNpmRating).toHaveBeenCalled();
  });

  it('should call ChatService.sendFeedbackMessage when session is Ended and text is typed', () => {
    store = createStore();
    ChatService.sendFeedbackMessage = jest.fn(() => Promise.resolve());
    render(
      <Provider store={store}>
        <Chat />
      </Provider>,
    );
    fireEvent.click(screen.getByText('7'));
    fireEvent.change(screen.getByPlaceholderText('keypad.input.placeholder'), { target: { value: 'ABC' } });
    fireEvent.click(screen.getByText('chat.feedback.button.label'));
    expect(ChatService.sendFeedbackMessage).toHaveBeenCalled();
  });
});
