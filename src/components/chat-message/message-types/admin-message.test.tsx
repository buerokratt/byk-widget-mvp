import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import AdminMessage from './admin-message';
import chatsReducer from '../../../slices/chat-slice';
import { mockMessage } from '../../../test-initial-states';
import ChatService from '../../../services/chat-service';

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
    },
  });
}

describe('Admin message component', () => {
  it('should render message text', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <AdminMessage message={mockMessage} />
      </Provider>,
    );
    const contentRegex = new RegExp(mockMessage.content, 'i');
    const messageElement = screen.getByText(contentRegex);
    expect(messageElement).toBeInTheDocument();
  });

  it('should render feedback buttons', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <AdminMessage message={mockMessage} />
      </Provider>,
    );
    expect(screen.getByAltText('thumbs up icon')).toBeInTheDocument();
    expect(screen.getByAltText('thumbs down icon')).toBeInTheDocument();
  });

  it('should send service request after inputing feedback', () => {
    ChatService.sendMessageWithRating = jest.fn(() => Promise.resolve({ _id: 'id' }));
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <AdminMessage message={mockMessage} />
      </Provider>,
    );
    fireEvent.click(screen.getByAltText('thumbs up icon'));
    expect(ChatService.sendMessageWithRating).toHaveBeenCalled();
  });
});
