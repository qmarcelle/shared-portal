import { OAuth } from './models/enterprise/oAuth';

declare global {
  // eslint-disable-next-line no-var
  var accessToken: OAuth;
  interface Window {
    _pingOneSignals: PingOneSignals;
    _pingOneSignalsReady: boolean;
  }
}

export type {};
