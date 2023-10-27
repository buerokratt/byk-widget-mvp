import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import chatReducer from '../../slices/chat-slice';
import { render } from '../../utils/test-utils';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
import ChatHeader from './chat-header';
import authenticationReducer from '../../slices/authentication-slice';
import widgetReducer from '../../slices/widget-slice';
import ChatService from '../../services/chat-service';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

const emptyFunction = () => {
  jest.fn();
};
let store: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      authentication: authenticationReducer,
      widget: widgetReducer,
    },
  });
}

describe('Header', () => {
  beforeEach(() => {
    store = createEmptyStore();
  });

  it('renders two buttons', () => {
    render(
      <Provider store={store}>
        <ChatHeader isDetailSelected={false} detailHandler={() => emptyFunction} />
      </Provider>,
    );
    expect(screen.getAllByRole('button').length).toBe(3);
  });

  it('sends end chat request when closing chat', async () => {
    ChatService.endChat = jest.fn(() => Promise.resolve());

    render(
      <Provider store={store}>
        <ChatHeader isDetailSelected={false} detailHandler={() => emptyFunction} />
        <ConfirmationModal />
      </Provider>,
    );

    const closeButton = screen.getByTitle('header.button.close.label');
    fireEvent.click(closeButton);
    const confirmationButton = screen.getByTitle('header.button.confirmation.yes');
    fireEvent.click(confirmationButton);
    expect(ChatService.endChat).toHaveBeenCalled();
  });
});
