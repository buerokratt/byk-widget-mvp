import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import chatReducer from '../slices/chat-slice';
import widgetReducer from '../slices/widget-slice';
import authenticationReducer from '../slices/authentication-slice';
import sessionStorageMiddleware from './middlewares/session-storage-middleware';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    widget: widgetReducer,
    authentication: authenticationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(sessionStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
