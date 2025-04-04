/**
 * Service for managing Genesys Chat configuration
 */
export class GenesysConfigService {
  private static instance: GenesysConfigService;
  private userData: Record<string, string>;
  private jwtToken: string;
  private initialized = false;

  private constructor() {
    this.userData = {};
    this.jwtToken = '';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): GenesysConfigService {
    if (!GenesysConfigService.instance) {
      GenesysConfigService.instance = new GenesysConfigService();
    }
    return GenesysConfigService.instance;
  }

  /**
   * Initialize the service with user data
   */
  public initialize(userData: Record<string, string>, jwtToken: string): void {
    this.userData = userData;
    this.jwtToken = jwtToken;
    this.initialized = true;

    // For debugging
    this.log('initialized with:', { userData, jwtToken });
  }

  /**
   * Get user data
   */
  public getUserData(): Record<string, string> {
    if (!this.initialized) {
      throw new Error('GenesysConfigService not initialized');
    }
    return this.userData;
  }

  /**
   * Get JWT token
   */
  public getJwtToken(): string {
    if (!this.initialized) {
      throw new Error('GenesysConfigService not initialized');
    }
    return this.jwtToken;
  }

  /**
   * Check if service is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset the service
   */
  public reset(): void {
    this.userData = {};
    this.jwtToken = '';
    this.initialized = false;
  }

  /**
   * Logging helper
   */
  private log(message: string, data?: any): void {
    console.log(`GenesysConfigService ${message}`, data);
  }
}
