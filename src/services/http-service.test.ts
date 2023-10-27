import { rest } from 'msw';
import { server } from '../mocks/server';
import http from './http-service';
import { RuuterResponse } from '../model/ruuter-response-model';

describe('HttpService', () => {
  it('should handle empty 200 OK response as error', async () => {
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/200-ok-no-body`, (req, res, ctx) => res(ctx.status(200))));
    await expect(http.post('/200-ok-no-body')).rejects.toThrow('200 OK with no response body!');
  });

  it('should handle 200 OK with error message as error', async () => {
    const errorMessage = 'time to start debugging!';
    const ruuterResponse: RuuterResponse = { data: null, error: errorMessage };
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/error`, (req, res, ctx) => res(ctx.status(200), ctx.body(JSON.stringify(ruuterResponse)))));
    await expect(http.post('/error')).rejects.toThrow(errorMessage);
  });

  it('should unwrap ruuter response', async () => {
    const content = 'string response';
    const ruuterResponse: RuuterResponse = { data: { some_conf: content }, error: null };
    server.use(rest.post(`${window._env_.RUUTER_API_URL}/ok`, (req, res, ctx) => res(ctx.status(200), ctx.body(JSON.stringify(ruuterResponse)))));
    await expect(http.post('/ok')).resolves.toBe(content);
  });
});
