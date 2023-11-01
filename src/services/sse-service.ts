import { RuuterResponse } from '../model/ruuter-response-model';

const ruuterUrl = window._env_.RUUTER_API_URL;

const sse = <T>(url: string, onMessage: (data: T) => void): EventSource => {
  const eventSource = new EventSource(`${ruuterUrl}/sse${url}`, { withCredentials: true });

  eventSource.onmessage = (event: MessageEvent) => {
    const response = JSON.parse(event.data);

    if (response.statusCodeValue === 200) {
      const ruuterResponse = response.body as RuuterResponse;
      if (ruuterResponse?.data) 
        onMessage(Object.values(ruuterResponse.data)[0] as T);
    }
  }

  eventSource.onerror = () => {
    console.log('SSE error');
  }

  return eventSource;
}

export default sse;
