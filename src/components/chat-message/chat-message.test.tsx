import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import Message from './chat-message';
import { AUTHOR_ROLES, CHAT_EVENTS } from '../../constants';
import chatReducer from '../../slices/chat-slice';
import authenticationReducer from '../../slices/authentication-slice';
import { mockMessage } from '../../test-initial-states';
import ChatService from '../../services/chat-service';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      authentication: authenticationReducer,
    },
  });
}

describe('Chat message component', () => {
  it('should render message text', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Message message={mockMessage} />
      </Provider>,
    );
    const contentRegex = new RegExp(mockMessage.content, 'i');
    const messageElement = screen.getByText(contentRegex);
    expect(messageElement).toBeInTheDocument();
  });

  it('should render client message', () => {
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, authorRole: AUTHOR_ROLES.END_USER }} />
      </Provider>,
    );

    expect(screen.getByText(mockMessage.content)).toBeTruthy();
  });

  it('should render event message', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, event: CHAT_EVENTS.TERMINATED }} />
      </Provider>,
    );
    expect(screen.getByText('notifications.chat-ended')).toBeTruthy();
  });

  it('should render ask permission event message', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, event: CHAT_EVENTS.ASK_PERMISSION }} />
      </Provider>,
    );
    screen.getByText('notifications.ask-permission');
    screen.getByRole('button', { name: 'chatMessage.accept' });
    screen.getByRole('button', { name: 'chatMessage.deny' });
  });

  it('should send http request after accept or deny button is clicked', async () => {
    emptyStore = createEmptyStore();
    ChatService.sendMessageWithNewEvent = jest.fn(() => Promise.resolve());
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, event: CHAT_EVENTS.ASK_PERMISSION }} />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'chatMessage.accept' }));
    expect(ChatService.sendMessageWithNewEvent).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'chatMessage.deny' }));
    expect(ChatService.sendMessageWithNewEvent).toHaveBeenCalledTimes(2);
  });

  it('should render ask permission accepted event message', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, event: CHAT_EVENTS.ASK_PERMISSION_ACCEPTED }} />
      </Provider>,
    );
    screen.getByText('notifications.ask-permission-accepted');
  });

  it('should render ask permission ignored event message', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, event: CHAT_EVENTS.ASK_PERMISSION_IGNORED }} />
      </Provider>,
    );
    screen.getByText('notifications.ask-permission-ignored');
  });

  it('should render clickable link in message', () => {
    emptyStore = createEmptyStore();
    const url = 'https://google.com';
    const content = `welcome to ${url}`;

    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, content, authorRole: AUTHOR_ROLES.END_USER }} />
        );
      </Provider>,
    );
    expect(screen.getByRole('link')?.getAttribute('href')).toBe(url);
  });

  it('should render authentication message and button', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Message message={{ ...mockMessage, event: CHAT_EVENTS.REQUESTED_AUTHENTICATION }} />
        );
      </Provider>,
    );
    screen.getByText('notifications.authenticate');
    screen.getByRole('button');
  });
});
