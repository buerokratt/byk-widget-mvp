import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { render } from '../../utils/test-utils';
import Chat from './chat';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import authenticationReducer from '../../slices/authentication-slice';
import { server } from '../../mocks/server';

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

describe('chat', () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: ({ method, url }) => {
        if (!url.pathname.startsWith('http://localhost:8080/')) {
          throw new Error(`Unhandled ${method} request to ${url}`);
        }
      },
    });
  });

  it('should render', () => {
    emptyStore = createEmptyStore();
    render(
      <Provider store={emptyStore}>
        <Chat />
      </Provider>,
    );
  });
});
