import { genesysConfig } from '@/config/genesysConfig';

interface EligibilityResponse {
  isEligible: boolean;
  reason?: string;
  plans?: Array<{
    id: string;
    name: string;
  }>;
}

interface PhoneAttributes {
  phoneNumber: string;
  isVerified: boolean;
  lastVerified: string;
}

interface MemberPreferences {
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
}

interface EmailResponse {
  success: boolean;
}

interface CXBusConfig {
  debug: boolean;
}

interface WebChatConfig {
  form?: Record<string, unknown>;
  formJSON?: {
    wrapper: string;
    inputs: Array<{
      id: string;
      name: string;
      maxlength: string;
      placeholder: string;
      label: string;
    }>;
  };
}

declare global {
  interface Window {
    genesys: {
      onChatReady: () => void;
      onChatError: (error: Error) => void;
      onChatMessage: (message: string) => void;
      onChatStateChange: (state: string) => void;
      chat: {
        sendMessage: (message: string) => void;
      };
    };
    CXBus?: {
      configure: (config: CXBusConfig) => void;
      command: (command: string, config: WebChatConfig) => void;
    };
  }
}

class ChatService {
  private scriptLoaded = false;
  private chatInitialized = false;

  constructor() {
    // Initialize Genesys callback handlers
    if (typeof window !== 'undefined') {
      window.genesys = {
        onChatReady: this.handleChatReady.bind(this),
        onChatError: this.handleChatError.bind(this),
        onChatMessage: this.handleChatMessage.bind(this),
        onChatStateChange: this.handleChatStateChange.bind(this),
        chat: {
          sendMessage: this.handleChatMessage.bind(this),
        },
      };
    }
  }

  private handleChatReady() {
    console.log('Chat is ready');
    this.chatInitialized = true;
  }

  private handleChatError(error: Error) {
    console.error('Chat error:', error);
  }

  private handleChatMessage(message: string) {
    console.log('Chat message:', message);
  }

  private handleChatStateChange(state: string) {
    console.log('Chat state changed:', state);
  }

  async loadGenesysScript(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://apps.${genesysConfig.baseConfig.region}.pure.cloud/widgets/9.0/cxbus.min.js`;
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Genesys script'));
      document.body.appendChild(script);
    });
  }

  async checkEligibility(): Promise<EligibilityResponse> {
    try {
      const response = await fetch('/api/chat/eligibility');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking chat eligibility:', error);
      return { isEligible: false, reason: 'Failed to check eligibility' };
    }
  }

  async initializeWidget(testMode: boolean = false): Promise<void> {
    if (!this.scriptLoaded) {
      await this.loadGenesysScript();
    }

    const config = testMode ? this.getTestConfig() : await this.getLiveConfig();

    if (window.CXBus) {
      window.CXBus.configure({ debug: process.env.NODE_ENV === 'development' });
      window.CXBus.command('WebChat.configure', config);
    }
  }

  private getTestConfig() {
    return {
      form: genesysConfig.testMode.formData,
      formJSON: {
        wrapper: '<table></table>',
        inputs: [
          {
            id: 'cx_webchat_form_firstname',
            name: 'firstname',
            maxlength: '100',
            placeholder: 'Required',
            label: 'First Name',
          },
          {
            id: 'cx_webchat_form_lastname',
            name: 'lastname',
            maxlength: '100',
            placeholder: 'Required',
            label: 'Last Name',
          },
        ],
      },
    };
  }

  private async getLiveConfig() {
    try {
      const response = await fetch('/api/chat/config');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat configuration:', error);
      throw error;
    }
  }

  async sendEmail(email: string): Promise<EmailResponse> {
    try {
      const response = await fetch('/api/chat/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async getPhoneAttributes(): Promise<PhoneAttributes> {
    try {
      const response = await fetch('/api/chat/phone-attributes');
      if (!response.ok) {
        throw new Error('Failed to get phone attributes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting phone attributes:', error);
      throw error;
    }
  }

  async getMemberPreferences(): Promise<MemberPreferences> {
    try {
      const response = await fetch('/api/chat/member-preferences');
      if (!response.ok) {
        throw new Error('Failed to get member preferences');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting member preferences:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
