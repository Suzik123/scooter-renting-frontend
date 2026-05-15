import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enMap from './locales/en/map.json';
import enWallet from './locales/en/wallet.json';
import enHistory from './locales/en/history.json';
import enProfile from './locales/en/profile.json';
import enRide from './locales/en/ride.json';

import plCommon from './locales/pl/common.json';
import plAuth from './locales/pl/auth.json';
import plDashboard from './locales/pl/dashboard.json';
import plMap from './locales/pl/map.json';
import plWallet from './locales/pl/wallet.json';
import plHistory from './locales/pl/history.json';
import plProfile from './locales/pl/profile.json';
import plRide from './locales/pl/ride.json';

export const SUPPORTED_LNGS = ['en', 'pl'] as const;
export type SupportedLng = (typeof SUPPORTED_LNGS)[number];

export const NAMESPACES = [
  'common',
  'auth',
  'dashboard',
  'map',
  'wallet',
  'history',
  'profile',
  'ride',
] as const;

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    map: enMap,
    wallet: enWallet,
    history: enHistory,
    profile: enProfile,
    ride: enRide,
  },
  pl: {
    common: plCommon,
    auth: plAuth,
    dashboard: plDashboard,
    map: plMap,
    wallet: plWallet,
    history: plHistory,
    profile: plProfile,
    ride: plRide,
  },
} as const;

if (!i18n.isInitialized) {
  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: [...SUPPORTED_LNGS],
      ns: [...NAMESPACES],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'uniscoot-lang',
        caches: ['localStorage'],
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
