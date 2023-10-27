import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import commonEn from './translations/en/common.json';
import commonEt from './translations/et/common.json';

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'et',
    supportedLngs: ['et', 'en'],
    resources: {
      en: {
        common: commonEn,
      },
      et: {
        common: commonEt,
      },
    },
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path'],
      lookupFromPathIndex: 0,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
