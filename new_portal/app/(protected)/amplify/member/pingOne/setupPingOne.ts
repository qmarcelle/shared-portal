function onPingOneSignalsReady(callback: () => void) {
  if (window._pingOneSignalsReady) {
    callback();
  } else {
    document.addEventListener('PingOneSignalsReadyEvent', callback);
  }
}

/*** Initializes the PingOne Systems to use the SDK further.*/
export const initPingOne = () => {
  if (typeof window !== 'undefined' && window._pingOneSignals) {
    onPingOneSignalsReady(() => {
      window._pingOneSignals
        .initSilent({
          envId: process.env.NEXT_PUBLIC_ENV_ID ?? 'DEV',
          universalDeviceIdentification: true,
        })
        .then(() => {
          console.log('PingOne Signals initialized successfully');
        })
        .catch((e: unknown) => {
          console.error('PingOne SDK Init failed', e);
        });
    });
  }
};

/** Gets the Risk Score data computed by the PingOne SDK.*/
export const getPingOneData = async () => {
  try {
    if (typeof window !== 'undefined' && window._pingOneSignals) {
      const data = await window._pingOneSignals.getData();
      return data;
    } else {
      throw new Error('PingOne SDK is not available');
    }
  } catch (err) {
    console.error('PingOne getData Error!', err);
  }
};