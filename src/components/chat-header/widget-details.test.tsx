import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import WidgetDetails from './widget-details';
import chatReducer from '../../slices/chat-slice';
import widgetReducer from '../../slices/widget-slice';
import authenticationReducer from '../../slices/authentication-slice';

let emptyStore: EnhancedStore;
const setHrefSpy = jest.fn((href) => href);

function createEmptyStore() {
  return configureStore({
    reducer: {
      chat: chatReducer,
      widget: widgetReducer,
      authentication: authenticationReducer,
    },
  });
}

describe('Widget details component', () => {
  beforeEach(() => {
    emptyStore = createEmptyStore();
  });

  it('should render details', () => {
    render(
      <Provider store={emptyStore}>
        <WidgetDetails />
      </Provider>,
    );
  });

  it('should redirect to conditions page', () => {
    window.open = jest.fn();

    render(
      <Provider store={emptyStore}>
        <WidgetDetails />
      </Provider>,
    );

    expect(setHrefSpy).not.toHaveBeenCalled();
    screen.getByRole('button', {
      name: /tutvu teenuse tingimustega/i,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /tutvu teenuse tingimustega/i,
      }),
    );

    expect(window.open).toHaveBeenCalledWith(window._env_.TERMS_AND_CONDITIONS_LINK, '_blank');
  });
});
