import { LOCAL_STORAGE_TARA_LOGIN_REDIRECT } from "../constants";

export function redirectToTim() {
  saveCurrentBrowserPath();
  window.location.assign(window._env_.TIM_AUTHENTICATION_URL);
}

export function redirectIfComeBackFromTim() {
  const redirectPath = getRedirectPath();
  if (!!redirectPath) {
    removeRedirectPath();
    window.location.href = window.location.origin + redirectPath;
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
