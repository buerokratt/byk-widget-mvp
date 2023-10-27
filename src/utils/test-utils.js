/* eslint-disable */
import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import chatReducer from '../slices/chat-slice';
import widgetReducer from '../slices/widget-slice';

const render = (
  ui,
  { preloadedState, store = configureStore({ reducer: { chat: chatReducer, widget: widgetReducer }, preloadedState }), ...renderOptions } = {},
) => {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { render };
