import { RuuterResponse } from '../model/ruuter-response-model';

const notificationNodeUrl = window._env_.NOTIFICATION_NODE_URL;

const sse = <T>(url: string, onMessage: (data: T) => void): EventSource => {
  const eventSource = new EventSource(`${notificationNodeUrl}/sse/notifications${url}`, { withCredentials: true });

  eventSource.onmessage = (event: MessageEvent) => {
    const response = JSON.parse(event.data);

    if (response.statusCodeValue === 200) {
      const ruuterResponse = response.body as RuuterResponse;
      if (ruuterResponse?.data)
        onMessage(Object.values(ruuterResponse.data)[0] as T);
    }
  };

  eventSource.onopen = () => {
    console.log('SSE connection opened, url:', url);
  };

  eventSource.onerror = () => {
    console.error('SSE error, url:', url);
  };

  return eventSource;
}

export default sse;
