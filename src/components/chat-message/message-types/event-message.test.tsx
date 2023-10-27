import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import chatsReducer from '../../../slices/chat-slice';
import EventMessage from './event-message';

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
    },
  });
}

describe('Event message component', () => {
  it('should render given message', () => {
    emptyStore = createEmptyStore();
    const content = <div>Hello world!</div>;
    render(
      <Provider store={emptyStore}>
        <EventMessage content={content} />
      </Provider>,
    );
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });
});
