import '@testing-library/jest-dom';
import { Settings } from 'luxon';
import { server } from './mocks/server';
import './i18n';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window._env_ = {
  RUUTER_API_URL: 'http://localhost:8080',
  TIM_AUTHENTICATION_URL: 'http://localhost:8085/oauth2/authorization/tara?callback_url=http://localhost:3000/auth/callback',
  TERMS_AND_CONDITIONS_LINK: 'https://www.kratid.ee/kasutustingimused',
  NOTIFICATION_NODE_URL: 'http://localhost:4040',
  ORGANIZATION_NAME: 'TEST',
  OFFICE_HOURS: {
    ENABLED: false,
    TIMEZONE: 'Europe/Tallinn',
    BEGIN: 9,
    END: 17,
    DAYS: [1, 2, 3, 4, 5],
  },
};

beforeAll(() => {
  Settings.now = () => new Date(2021, 12, 18, 12).valueOf();

  jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: jest.fn(),
    }),
    Trans: ({ children }: { children: React.ReactNode }) => children,
  }));

  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
