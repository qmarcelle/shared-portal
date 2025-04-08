import { ChatConfig } from '../types';

// Define the CobrowseIO interface for the window object
interface CobrowseIO {
  license: string;
  customData: {
    user_id: string;
    user_name: string;
  };
  capabilities: string[];
  confirmSession: () => Promise<boolean>;
  confirmRemoteControl: () => Promise<boolean>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  createSessionCode: () => Promise<string>;
}

// Add to global window type
declare global {
  interface Window {
    CobrowseIO?: CobrowseIO;
    logCobrowseEvent?: (eventName: string, data: unknown) => void;
  }
}

/**
 * Service for managing co-browse functionality
 */
export class CobrowseService {
  private config: ChatConfig;
  private isInitialized = false;
  private activeSession: { id: string; active: boolean; url: string } | null =
    null;

  constructor(config: ChatConfig) {
    this.config = config;
  }

  /**
   * Initializes the CobrowseIO library
   */
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Load CobrowseIO script
      await this.loadScript('https://js.cobrowse.io/CobrowseIO.js');

      // Initialize CobrowseIO
      if (!window.CobrowseIO) {
        console.error('CobrowseIO not available after loading script');
        return;
      }

      window.CobrowseIO.license = this.config.coBrowseLicence || '';
      window.CobrowseIO.customData = {
        user_id: this.config.memberId || '',
        user_name: this.config.memberFirstname || '',
      };
      window.CobrowseIO.capabilities = [
        'cursor',
        'keypress',
        'laser',
        'pointer',
        'scroll',
        'select',
      ];

      // Configure consent dialogs
      this.configureCobrowseConsent();

      // Start CobrowseIO
      await window.CobrowseIO.start();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing CobrowseIO:', error);
      throw error;
    }
  }

  /**
   * Creates a new co-browse session
   * @returns Session code to share with agent
   */
  async createSession(): Promise<string> {
    if (!window.CobrowseIO) throw new Error('CobrowseIO not initialized');
    const code = await window.CobrowseIO.createSessionCode();
    this.activeSession = {
      id: code,
      active: true,
      url: `${this.config.cobrowseSource}/session/${code}`,
    };
    window.logCobrowseEvent?.('session_created', { sessionCode: code });
    return code;
  }

  /**
   * Ends the current co-browse session
   */
  async endSession(): Promise<void> {
    if (!window.CobrowseIO) return;
    const sessionId = this.activeSession?.id;
    await window.CobrowseIO.stop();
    this.activeSession = null;
    window.logCobrowseEvent?.('session_ended', { sessionId });
  }

  /**
   * Configures consent dialogs for co-browse
   */
  private configureCobrowseConsent(): void {
    if (!window.CobrowseIO) {
      return;
    }

    // Configure confirmation dialogs
    window.CobrowseIO.confirmSession = function () {
      return new Promise(function (resolve) {
        // Use custom UI instead of native confirm
        const confirmEl = document.createElement('div');
        confirmEl.className = 'cobrowse-consent-dialog';
        confirmEl.innerHTML = `
          <div class="cobrowse-card">
            <div style="text-align:left; margin-bottom:10px">
              <b>We'd like to share your screen</b>
            </div>
            <div>
              Sharing your screen with us only lets us see your BCBST.com account in your browser. 
              We can't see anything else on your screen. Is that OK?
            </div>
            <div style="float:left; margin-top:10px">
              <button class="cobrowse-deny">No</button>
              <button class="cobrowse-allow">Yes</button>
            </div>
          </div>
        `;

        document.body.appendChild(confirmEl);

        const allowButton = confirmEl.querySelector('.cobrowse-allow');
        if (allowButton) {
          allowButton.addEventListener('click', function () {
            resolve(true);
            document.body.removeChild(confirmEl);
          });
        }

        const denyButton = confirmEl.querySelector('.cobrowse-deny');
        if (denyButton) {
          denyButton.addEventListener('click', function () {
            resolve(false);
            document.body.removeChild(confirmEl);
          });
        }
      });
    };

    window.CobrowseIO.confirmRemoteControl = function () {
      return new Promise(function (resolve) {
        // Use custom UI instead of native confirm
        const confirmEl = document.createElement('div');
        confirmEl.className = 'cobrowse-consent-dialog';
        confirmEl.innerHTML = `
          <div class="cobrowse-card">
            <div style="text-align:left; margin-bottom:10px">
              <b>We'd like to share control of your screen</b>
            </div>
            <div>
              We can see your BCBST.com screen. If you agree to share control with us, 
              we can help you further. Is that OK?
            </div>
            <div style="float:left; margin-top:10px">
              <button class="cobrowse-deny">No</button>
              <button class="cobrowse-allow">Yes</button>
            </div>
          </div>
        `;

        document.body.appendChild(confirmEl);

        const allowButton = confirmEl.querySelector('.cobrowse-allow');
        if (allowButton) {
          allowButton.addEventListener('click', function () {
            resolve(true);
            document.body.removeChild(confirmEl);
          });
        }

        const denyButton = confirmEl.querySelector('.cobrowse-deny');
        if (denyButton) {
          denyButton.addEventListener('click', function () {
            resolve(false);
            document.body.removeChild(confirmEl);
          });
        }
      });
    };
  }

  /**
   * Loads a script dynamically
   * @param src Script URL
   * @returns Promise that resolves when script is loaded
   */
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  getActiveSession() {
    return this.activeSession;
  }
}
