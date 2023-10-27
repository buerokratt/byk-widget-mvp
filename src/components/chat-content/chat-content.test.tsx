import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import ChatContent from './chat-content';
import { render, screen } from '../../utils/test-utils';
import chatReducer from '../../slices/chat-slice';
import { initialChatState, mockMessages } from '../../test-initial-states';
import authenticationReducer from '../../slices/authentication-slice';

let store: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      authentication: authenticationReducer,
    },
    preloadedState: {
      chat: { ...initialChatState, messages: mockMessages },
    },
  });
}

describe('Chat Content', () => {
  it('should render chat content', () => {
    render(<ChatContent />);
  });

  it('should map messages', () => {
    store = createEmptyStore();
    render(
      <Provider store={store}>
        <ChatContent />
      </Provider>,
    );
    screen.getByText('hello world');
  });
});
