import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { SESSION_STORAGE_TARA_LOGIN_REDIRECT } from '../constants';
import { getUserinfo, loginWithTaraJwt } from '../slices/authentication-slice';
import useAuthenticationSelector from './use-authentication-selector';

const useAuthentication = (): void => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, fetchingUserInfo, loggedInWithTaraJwt } = useAuthenticationSelector();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem(SESSION_STORAGE_TARA_LOGIN_REDIRECT);
    if (redirectPath && redirectPath !== '') {
      sessionStorage.removeItem(SESSION_STORAGE_TARA_LOGIN_REDIRECT);
      window.location.href = window.location.origin + redirectPath;
    }
    if (!isAuthenticated || loggedInWithTaraJwt) dispatch(getUserinfo());
  }, [isAuthenticated, loggedInWithTaraJwt, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && !fetchingUserInfo) dispatch(loginWithTaraJwt());
  }, [fetchingUserInfo, dispatch, isAuthenticated]);
};

export default useAuthentication;
