export {};

declare global {
  interface Window {
    gmsServicesConfig?: {
      GMSChatURL: () => string;
    };
  }
}
