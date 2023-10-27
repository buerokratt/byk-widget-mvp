import React from 'react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ChatKeyPad from './chat-keypad';
import { waitForRequest } from '../../mocks/server';
import { RUUTER_ENDPOINTS } from '../../constants';
import chatReducer from '../../slices/chat-slice';
import KeypadErrorMessage from './keypad-error-message';

let store: EnhancedStore;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

function createTestStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
  });
}

describe('Keypad', () => {
  beforeEach(() => {
    store = createTestStore();
  });

  it('clears input after pressing enter', () => {
    render(<ChatKeyPad />);
    const input = screen.getByRole('button') as HTMLInputElement;
    userEvent.type(input, 'Hello!{enter}');
    expect(input.value).toBeFalsy();
  });

  it('sends new message request when chatId is present', async () => {
    const preloadedState = { chat: { chatId: '1', messages: [], messageQueue: [] } };
    const message = 'I need help!';
    render(<ChatKeyPad />, { preloadedState });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const pendingSendNewMessage = waitForRequest('POST', RUUTER_ENDPOINTS.POST_MESSAGE);
    userEvent.type(input, `${message}{enter}`);
    const request = await pendingSendNewMessage;
    expect(request.body.content).toBe(message);
  });

  it('keypad error message returns empty string no children', () => {
    const testMessage = '';
    const { container } = render(
      <Provider store={store}>
        <KeypadErrorMessage>{testMessage}</KeypadErrorMessage>
      </Provider>,
    );
    expect(container.childNodes.length).toEqual(0);
  });

  it('keypad error message value when given children', () => {
    const testMessage = 'Error message';
    render(
      <Provider store={store}>
        <KeypadErrorMessage>{testMessage}</KeypadErrorMessage>
      </Provider>,
    );
    screen.getByText(testMessage);
  });
});
