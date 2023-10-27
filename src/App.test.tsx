import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Settings } from 'luxon';
import { act } from 'react-dom/test-utils';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from './utils/test-utils';
import App from './App';
import chatReducer from './slices/chat-slice';
import widgetReducer from './slices/widget-slice';
import authenticationReducer from './slices/authentication-slice';
import { Chat } from './model/chat-model';
import ChatService from './services/chat-service';
import ChatComponent from './components/chat/chat';
import { server } from './mocks/server';

jest.mock('./services/sse-service', () => ({
  __esModule: true,
  default: () => ({
    onMessage: () => null,
  }),
}));

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      widget: widgetReducer,
      authentication: authenticationReducer,
    },
  });
}

describe('App component', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  beforeAll(() => {
    emptyStore = createEmptyStore();

    server.listen({
      onUnhandledRequest: ({ method, url }) => {
        if (!url.pathname.startsWith('http://localhost:8080/')) {
          throw new Error(`Unhandled ${method} request to ${url}`);
        }
      },
    });
  });

  it('renders App and Profile button', () => {
    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders Chat on button click', () => {
    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('Saada')).toBeTruthy();
  });

  it('hides widget when not in office hours', () => {
    Settings.now = () => new Date(2021, 12, 18, 2).valueOf();

    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('hides widget when no session exists and office hours end', () => {
    jest.useFakeTimers();
    Settings.now = () => new Date(2021, 12, 18, 12).valueOf();

    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.getAllByRole('button')).toBeTruthy();
    act(() => {
      Settings.now = () => new Date(2021, 12, 18, 17).valueOf();
      jest.advanceTimersByTime(60000);
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not hides widget when session exists and office hours end', () => {
    jest.useFakeTimers();
    Settings.now = () => new Date(2021, 12, 18, 12).valueOf();
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => '1');

    render(
      <Provider store={emptyStore}>
        <App />
      </Provider>,
    );

    expect(screen.getAllByRole('button')).toBeTruthy();
    act(() => {
      Settings.now = () => new Date(2021, 12, 18, 17).valueOf();
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getAllByRole('button')).toBeTruthy();
  });

  it('should init chat if chatId is missing', async () => {
    const initResponse: Chat = { customerSupportId: '1', id: 'string', status: 'OPEN' };
    ChatService.init = jest.fn(() => Promise.resolve(initResponse));
    const store = createEmptyStore();

    render(
      <Provider store={store}>
        <ChatComponent />
      </Provider>,
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /sisesta tekst/i,
      }),
      { target: { value: 'longCharMessage' } },
    );
    fireEvent.click(
      screen.getByRole('img', {
        name: /send icon/i,
      }),
    );
    expect(ChatService.init).toHaveBeenCalled();
  });
});
