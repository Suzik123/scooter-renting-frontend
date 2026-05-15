import 'react-i18next';

import type common from './locales/en/common.json';
import type auth from './locales/en/auth.json';
import type dashboard from './locales/en/dashboard.json';
import type map from './locales/en/map.json';
import type wallet from './locales/en/wallet.json';
import type history from './locales/en/history.json';
import type profile from './locales/en/profile.json';
import type ride from './locales/en/ride.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      dashboard: typeof dashboard;
      map: typeof map;
      wallet: typeof wallet;
      history: typeof history;
      profile: typeof profile;
      ride: typeof ride;
    };
  }
}
