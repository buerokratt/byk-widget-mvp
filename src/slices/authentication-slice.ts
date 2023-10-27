import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthenticationService from '../services/authentication-service';
import { ChatState, endChat } from './chat-slice';
import { UserInfo } from '../model/user-info-model';

export interface AuthenticationState {
  isAuthenticated: boolean;
  authenticationFailed: boolean;
  userInfo: UserInfo;
  fetchingUserInfo: boolean;
  loggedInWithTaraJwt: boolean;
}

const initialState: AuthenticationState = {
  fetchingUserInfo: true,
  loggedInWithTaraJwt: false,
  isAuthenticated: false,
  authenticationFailed: false,
  userInfo: {
    jwtExpirationTimestamp: '',
    firstName: '',
    lastName: '',
    personalCode: '',
  },
};

export const loginWithTaraJwt = createAsyncThunk('auth/loginWithTaraJwt', async (_args, thunkApi) => {
  const {
    chat: { chatId },
  } = thunkApi.getState() as { chat: ChatState };
  if (chatId) return AuthenticationService.loginWithTaraJwt(chatId);
  return Promise.reject();
});

export const getUserinfo = createAsyncThunk('auth/getUserinfo', () => AuthenticationService.customJwtUserinfo());

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setIsNotAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserinfo.pending, (state) => {
      state.fetchingUserInfo = true;
    });
    builder.addCase(getUserinfo.fulfilled, (state, action) => {
      state.fetchingUserInfo = false;

      if (!action.payload) {
        state.isAuthenticated = false;
        state.userInfo = initialState.userInfo;
        return;
      }

      state.userInfo.jwtExpirationTimestamp = action.payload.jwtExpirationTimestamp;
      state.userInfo.personalCode = action.payload.personalCode;
      state.userInfo.firstName = action.payload.firstName;
      state.userInfo.lastName = action.payload.lastName;
      state.isAuthenticated = !!action.payload.personalCode;
    });
    builder.addCase(getUserinfo.rejected, (state) => {
      state.fetchingUserInfo = false;
    });
    builder.addCase(loginWithTaraJwt.pending, (state) => {
      state.loggedInWithTaraJwt = false;
    });
    builder.addCase(loginWithTaraJwt.fulfilled, (state) => {
      state.loggedInWithTaraJwt = true;
    });
    builder.addCase(endChat.fulfilled, (state) => {
      state.isAuthenticated = false;
    });
  },
});

export const { setIsAuthenticated, setIsNotAuthenticated } = authenticationSlice.actions;

export default authenticationSlice.reducer;
