import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import ClientMessage from './admin-message';
import chatsReducer from '../../../slices/chat-slice';
import { mockMessage } from '../../../test-initial-states';

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
    },
  });
}

describe('Client message component', () => {
  it('should render message text', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <ClientMessage message={mockMessage} />
      </Provider>,
    );
    const contentRegex = new RegExp(mockMessage.content, 'i');
    const messageElement = screen.getByText(contentRegex);
    expect(messageElement).toBeInTheDocument();
  });
});
