import { ChatConfig, CobrowseSession } from '../../models/chat';

// Define a more comprehensive CobrowseIO interface to fix type errors
interface CobrowseIOInterface {
  license: string;
  customData: Record<string, string>;
  capabilities: string[];
  deviceType?: string;
  redactedViews?: string[];
  currentSession?: any;
  on?: (event: string, handler: () => void) => void;
  off?: (event: string, handler: () => void) => void;
  confirmSession: () => Promise<boolean>;
  confirmRemoteControl: () => Promise<boolean>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  createSessionCode: () => Promise<string>;
}

/**
 * Service for managing co-browse functionality
 */
export class CobrowseService {
  private config: ChatConfig;
  private isInitialized = false;
  private activeSession: CobrowseSession | null = null;
  private eventListeners: Array<() => void> = [];

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
      // Load CobrowseIO script from the configured URL or use default
      const cobrowseScriptUrl =
        this.config.cobrowseURL || 'https://js.cobrowse.io/CobrowseIO.js';
      await this.loadScript(cobrowseScriptUrl);

      // Initialize CobrowseIO safely
      if (!window.CobrowseIO) {
        window.CobrowseIO = {} as CobrowseIOInterface;
      }

      // Set required properties
      window.CobrowseIO.license = this.config.coBrowseLicence || '';
      window.CobrowseIO.customData = {
        user_id: this.config.memberId || '',
        user_name: this.config.memberFirstname || '',
        group_id: this.config.groupId || '',
        plan_id: this.config.planId || '',
        Source: 'member-portal',
        Origin: 'web',
      };

      // Configure capabilities based on the original Java implementation
      window.CobrowseIO.capabilities = [
        'cursor',
        'keypress',
        'laser',
        'pointer',
        'scroll',
        'select',
      ];

      // Configure device specific settings from Java implementation
      window.CobrowseIO.deviceType = 'desktop';
      window.CobrowseIO.redactedViews = [
        '.password-field',
        '.secure-input',
        'input[type=password]',
        '.contains-sensitive-data',
      ];

      // Configure consent dialogs
      this.configureCobrowseConsent();

      // Register event listeners for session state changes
      this.registerEventListeners();

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
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const code = await window.CobrowseIO.createSessionCode();

      // Track the session creation
      this.activeSession = {
        id: code,
        active: true,
        url: `${this.config.cobrowseSource || 'https://cobrowse.io'}/session/${code}`,
      };

      // Attempt to log session creation to analytics if available
      if (typeof window.logCobrowseEvent === 'function') {
        window.logCobrowseEvent('session_created', { sessionCode: code });
      }

      return code;
    } catch (error) {
      console.error('Error creating CobrowseIO session:', error);
      throw error;
    }
  }

  /**
   * Ends the current co-browse session
   */
  async endSession(): Promise<void> {
    if (!this.isInitialized || !window.CobrowseIO) {
      return;
    }

    try {
      // Clean up the active session
      if (this.activeSession) {
        this.activeSession.active = false;

        // Attempt to log session end to analytics if available
        if (typeof window.logCobrowseEvent === 'function') {
          window.logCobrowseEvent('session_ended', {
            sessionId: this.activeSession.id,
          });
        }

        this.activeSession = null;
      }

      // Stop the cobrowse session
      await window.CobrowseIO.stop();

      // Unregister event listeners to prevent memory leaks
      this.unregisterEventListeners();
    } catch (error) {
      console.error('Error ending CobrowseIO session:', error);
      throw error;
    }
  }

  /**
   * Get current session information
   * @returns Active session or null if no session
   */
  getActiveSession(): CobrowseSession | null {
    return this.activeSession;
  }

  /**
   * Register event listeners for session state changes
   */
  private registerEventListeners(): void {
    if (!window.CobrowseIO || typeof window === 'undefined') {
      return;
    }

    const handleSessionUpdated = () => {
      const session = window.CobrowseIO.currentSession;
      if (session) {
        // Update active session state
        this.activeSession = {
          id: session.id,
          active: true,
          url: `${this.config.cobrowseSource || 'https://cobrowse.io'}/session/${session.id}`,
        };

        // Attempt to log to analytics if available
        if (typeof window.logCobrowseEvent === 'function') {
          window.logCobrowseEvent('session_updated', { sessionId: session.id });
        }
      }
    };

    const handleSessionEnded = () => {
      if (this.activeSession) {
        this.activeSession.active = false;

        // Attempt to log to analytics if available
        if (typeof window.logCobrowseEvent === 'function') {
          window.logCobrowseEvent('session_ended', {
            sessionId: this.activeSession.id,
          });
        }

        this.activeSession = null;
      }
    };

    // Add event listeners
    if (window.CobrowseIO.on) {
      window.CobrowseIO.on('session.updated', handleSessionUpdated);
      window.CobrowseIO.on('session.ended', handleSessionEnded);

      // Store event listeners for cleanup
      this.eventListeners.push(() => {
        if (window.CobrowseIO.off) {
          window.CobrowseIO.off('session.updated', handleSessionUpdated);
          window.CobrowseIO.off('session.ended', handleSessionEnded);
        }
      });
    }
  }

  /**
   * Unregister event listeners to prevent memory leaks
   */
  private unregisterEventListeners(): void {
    this.eventListeners.forEach((removeListener) => removeListener());
    this.eventListeners = [];
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

        confirmEl
          .querySelector('.cobrowse-allow')
          ?.addEventListener('click', function () {
            resolve(true);
            document.body.removeChild(confirmEl);

            // Log consent in analytics if available
            if (typeof window.logCobrowseEvent === 'function') {
              window.logCobrowseEvent('consent_given', { type: 'view' });
            }
          });

        confirmEl
          .querySelector('.cobrowse-deny')
          ?.addEventListener('click', function () {
            resolve(false);
            document.body.removeChild(confirmEl);

            // Log consent denial in analytics if available
            if (typeof window.logCobrowseEvent === 'function') {
              window.logCobrowseEvent('consent_denied', { type: 'view' });
            }
          });
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

        confirmEl
          .querySelector('.cobrowse-allow')
          ?.addEventListener('click', function () {
            resolve(true);
            document.body.removeChild(confirmEl);

            // Log consent in analytics if available
            if (typeof window.logCobrowseEvent === 'function') {
              window.logCobrowseEvent('consent_given', { type: 'control' });
            }
          });

        confirmEl
          .querySelector('.cobrowse-deny')
          ?.addEventListener('click', function () {
            resolve(false);
            document.body.removeChild(confirmEl);

            // Log consent denial in analytics if available
            if (typeof window.logCobrowseEvent === 'function') {
              window.logCobrowseEvent('consent_denied', { type: 'control' });
            }
          });
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
}

// Add this to global window type
declare global {
  interface Window {
    CobrowseIO: any;
    logCobrowseEvent?: (eventName: string, data: any) => void;
  }
}
