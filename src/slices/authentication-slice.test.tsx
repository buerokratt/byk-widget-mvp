import reducer, { setIsAuthenticated, setIsNotAuthenticated, getUserinfo, loginWithTaraJwt } from './authentication-slice';
import { initialAuthState } from '../test-initial-states';
import { endChat } from './chat-slice';
import { UserInfo } from '../model/user-info-model';

jest.mock('../services/chat-service');

describe('Authentication Slice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialAuthState);
  });

  it('should set isAuthenticated to true', () => {
    const previousState = { ...initialAuthState, isAuthenticated: false };
    expect(reducer(previousState, setIsAuthenticated())).toEqual({
      ...initialAuthState,
      isAuthenticated: true,
    });
  });

  it('should set isAuthenticated to false', () => {
    const previousState = { ...initialAuthState, isAuthenticated: true };
    expect(reducer(previousState, setIsNotAuthenticated())).toEqual({
      ...initialAuthState,
      isAuthenticated: false,
    });
  });

  describe('extra reducers', () => {
    it('should set fetchingUserInfo true when getUserInfo is pending', () => {
      const action = { type: getUserinfo.pending.type };
      const state = reducer({ ...initialAuthState, fetchingUserInfo: false }, action);
      expect(state).toEqual({ ...initialAuthState, fetchingUserInfo: true });
    });

    it('should set user information when userInfo is fulfilled and payload exists', () => {
      const userInfo: UserInfo = {
        jwtExpirationTimestamp: '1',
        firstName: 'admin',
        lastName: 'nimda',
        personalCode: '2',
      };
      const action = {
        type: getUserinfo.fulfilled.type,
        payload: {
          jwtExpirationTimestamp: userInfo.jwtExpirationTimestamp,
          personalCode: userInfo.personalCode,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        },
      };
      const state = reducer({ ...initialAuthState, fetchingUserInfo: true, isAuthenticated: false }, action);
      expect(state).toEqual({ ...initialAuthState, fetchingUserInfo: false, isAuthenticated: true, userInfo });
    });

    it('should not set user information when userInfo is fulfilled and payload does not exist', () => {
      const action = { type: getUserinfo.fulfilled.type };
      const state = reducer({ ...initialAuthState, fetchingUserInfo: true, isAuthenticated: true }, action);
      expect(state).toEqual({ ...initialAuthState, fetchingUserInfo: false, isAuthenticated: false });
    });

    it('should set fetchingUserInfo false when getUserInfo is rejected', () => {
      const action = { type: getUserinfo.rejected.type };
      const state = reducer(initialAuthState, action);
      expect(state).toEqual({ ...initialAuthState, fetchingUserInfo: false });
    });

    it('should set loggedInWithTaraJwt false when loginWithTaraJwt is pending', () => {
      const action = { type: loginWithTaraJwt.pending.type };
      const state = reducer({ ...initialAuthState, loggedInWithTaraJwt: true }, action);
      expect(state).toEqual({ ...initialAuthState, loggedInWithTaraJwt: false });
    });

    it('should set loggedInWithTaraJwt true when loginWithTaraJwt is fulfilled', () => {
      const action = { type: loginWithTaraJwt.fulfilled.type };
      const state = reducer(initialAuthState, action);
      expect(state).toEqual({ ...initialAuthState, loggedInWithTaraJwt: true });
    });

    it('should set isAuthenticated false when endChat is fulfilled', () => {
      const action = { type: endChat.fulfilled.type };
      const state = reducer({ ...initialAuthState, isAuthenticated: true }, action);
      expect(state).toEqual({ ...initialAuthState, isAuthenticated: false });
    });
  });
});
