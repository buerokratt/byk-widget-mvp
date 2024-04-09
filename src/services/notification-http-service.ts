import axios from 'axios';

const notificationHttp = axios.create({
  baseURL: window._env_.NOTIFICATION_NODE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const sendNotificationBackgroundRequest = (url: string, data: any) => {
  const fullUrl = `${window._env_.NOTIFICATION_NODE_URL}${url}`;
  navigator.sendBeacon(fullUrl, JSON.stringify(data));
}

export default notificationHttp;
export { sendNotificationBackgroundRequest };
