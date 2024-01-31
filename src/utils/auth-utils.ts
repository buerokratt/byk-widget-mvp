import { LOCAL_STORAGE_TARA_LOGIN_REDIRECT } from "../constants";
import widgetService from "../services/widget-service";

export function redirectToTim() {
  saveCurrentBrowserPath();
  window.location.assign(window._env_.TIM_AUTHENTICATION_URL);
}

export function redirectIfComeBackFromTim(callback: any) {
  const redirectPath = getRedirectPath();
  const hasJWTCookie = document.cookie.indexOf('JWTTOKEN') != -1;
  if (redirectPath && hasJWTCookie) {
    setTimeout(async () => {
      removeRedirectPath();
      await widgetService.authenticateUser();
      await callback?.();
      window.location.assign(redirectPath);
    }, 500);
  }
}

export function isRedirectPathEmpty() {
  return !isRedirectPathSet();
}

function saveCurrentBrowserPath() {
  localStorage.setItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT, window.location.href);
}

function getRedirectPath() {
  return localStorage.getItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT);
}

function isRedirectPathSet() {
  return !!getRedirectPath();
}

function removeRedirectPath() {
  localStorage.removeItem(LOCAL_STORAGE_TARA_LOGIN_REDIRECT);
}
