import { ChatConfig } from '../models/chat';

/**
 * Service for managing co-browse functionality
 */
export class CobrowseService {
  private config: ChatConfig;
  private isInitialized = false;
  
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
      window.CobrowseIO = window.CobrowseIO || {};
      window.CobrowseIO.license = this.config.coBrowseLicence;
      window.CobrowseIO.customData = {
        user_id: this.config.userID,
        user_name: this.config.memberFirstname
      };
      window.CobrowseIO.capabilities = ['cursor', 'keypress', 'laser', 'pointer', 'scroll', 'select'];
      
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
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const code = await window.CobrowseIO.createSessionCode();
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
      await window.CobrowseIO.stop();
    } catch (error) {
      console.error('Error ending CobrowseIO session:', error);
      throw error;
    }
  }
  
  /**
   * Configures consent dialogs for co-browse
   */
  private configureCobrowseConsent(): void {
    if (!window.CobrowseIO) {
      return;
    }
    
    // Configure confirmation dialogs
    window.CobrowseIO.confirmSession = function() {
      return new Promise(function(resolve) {
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
        
        confirmEl.querySelector('.cobrowse-allow')?.addEventListener('click', function() {
          resolve(true);
          document.body.removeChild(confirmEl);
        });
        
        confirmEl.querySelector('.cobrowse-deny')?.addEventListener('click', function() {
          resolve(false);
          document.body.removeChild(confirmEl);
        });
      });
    };
    
    window.CobrowseIO.confirmRemoteControl = function() {
      return new Promise(function(resolve) {
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
        
        confirmEl.querySelector('.cobrowse-allow')?.addEventListener('click', function() {
          resolve(true);
          document.body.removeChild(confirmEl);
        });
        
        confirmEl.querySelector('.cobrowse-deny')?.addEventListener('click', function() {
          resolve(false);
          document.body.removeChild(confirmEl);
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
  }
} 