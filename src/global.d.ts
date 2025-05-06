import { OAuth } from './models/enterprise/oAuth';

declare global {
  // eslint-disable-next-line no-var
  var accessToken: OAuth;
  interface Window {
    Genesys?: any;
    _genesys?: any;
    CXBus?: any;
    MessengerWidget?: any;
    _pingOneSignals: PingOneSignals;
    _pingOneSignalsReady: boolean;
    dataLayer: Record<string, unknown>[];
  }
}

export type {};
