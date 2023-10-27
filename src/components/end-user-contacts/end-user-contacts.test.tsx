import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import EndUserContacts from './end-user-contacts';
import ChatService from '../../services/chat-service';
import { initialChatState } from '../../test-initial-states';

let store: EnhancedStore;

describe('end user contact form', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        chat: chatReducer,
        widget: widgetReducer,
      },
      preloadedState: {
        chat: { ...initialChatState, chatId: '1' },
      },
    });
  });

  it('should render', () => {
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
  });

  it('should send http when only email is given', () => {
    const placeholderEmail = 'nimi@email.ee';
    ChatService.sendNewMessage = jest.fn(() => Promise.resolve({ _id: 'id' }));
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText(placeholderEmail), { target: { value: placeholderEmail } });
    fireEvent.click(screen.getByText('kinnita'));
    expect(ChatService.sendNewMessage).toHaveBeenCalled();
  });

  it('should send http when only phone nr is given', () => {
    ChatService.sendNewMessage = jest.fn(() => Promise.resolve({ _id: 'id' }));
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText('+372 123 456'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('kinnita'));
    expect(ChatService.sendNewMessage).toHaveBeenCalled();
  });

  it('should give error when invalid input is given', () => {
    ChatService.sendNewMessage = jest.fn(() => Promise.resolve({ _id: 'id' }));
    render(
      <Provider store={store}>
        <EndUserContacts />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText('+372 123 456'), { target: { value: '123456789123456789123456789' } });
    fireEvent.click(screen.getByText('kinnita'));
    expect(ChatService.sendNewMessage).not.toHaveBeenCalled();
  });
});
