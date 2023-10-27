import { setupServer } from 'msw/node';
import { matchRequestUrl } from 'msw';
import handlers from './handlers';

export const server = setupServer(...handlers);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const waitForRequest = (method: string, url: string): Promise<any> => {
  let requestId = '';

  const ruuterUrl = window._env_.RUUTER_API_URL;

  return new Promise((resolve, reject) => {
    server.events.on('request:start', (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase();
      const matchesUrl = matchRequestUrl(req.url, `${ruuterUrl}${url}`).matches;

      if (matchesMethod && matchesUrl) {
        requestId = req.id;
      }
    });
    server.events.on('request:match', (req) => {
      if (req.id === requestId) {
        resolve(req);
      }
    });
    server.events.on('request:unhandled', (req) => {
      if (req.id === requestId) {
        reject(new Error(`The ${req.method} ${req.url.href} request was unhandled.`));
      }
    });
  });
};
