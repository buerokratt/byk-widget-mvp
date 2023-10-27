import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import authenticationReducer from '../../slices/authentication-slice';
import ConfirmationModal from './confirmation-modal';

let store: EnhancedStore;

describe('Confirmation modal component', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        chat: chatReducer,
        widget: widgetReducer,
        authentication: authenticationReducer,
      },
      preloadedState: {
        widget: {
          showConfirmationModal: true,
        },
      },
    });
  });

  it('renders modal', () => {
    render(
      <Provider store={store}>
        <ConfirmationModal />
      </Provider>,
    );

    expect(screen.getAllByRole('button').length).toBe(2);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Kas soovite vestluse sulgeda?')).toBeInTheDocument();
  });
});
