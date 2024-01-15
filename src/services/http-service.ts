import axios from 'axios';
import { Agent } from 'http';
import { RuuterResponse } from '../model/ruuter-response-model';

const http = axios.create({
  baseURL: window._env_.RUUTER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  httpAgent: new Agent({ 
    keepAlive: true 
  }),
});

http.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (!response.data) {
      return Promise.reject(new Error('200 OK with no response body!'));
    }
    const ruuterResponse = response.data as RuuterResponse;
    if (ruuterResponse.error) {
      return Promise.reject(new Error(ruuterResponse.error));
    }
    if (ruuterResponse.data) {
      return Object.values(ruuterResponse.data)[0];
    }
  }
  return response;
});

export default http;
