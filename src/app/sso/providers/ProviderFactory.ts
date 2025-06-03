import { LoggedInMember } from '@/models/app/loggedin_member';
import { BaseSSOParameters, SSOProvider } from '../models/types';
import { SSO_IMPL_MAP, SSO_TEXT_MAP } from '../ssoConstants';

// Import all provider implementations
import Blue365Provider from './implementations/Blue365Provider';
import ChipRewardsProvider from './implementations/ChipRewardsProvider';
import CVSCaremarkProvider from './implementations/CVSCaremarkProvider';
import ElectronicPaymentBOAProvider from './implementations/ElectronicPaymentBOAProvider';
import EmboldProvider from './implementations/EmboldProvider';
import EyemedProvider from './implementations/EyemedProvider';
import HealthEquityProvider from './implementations/HealthEquityProvider';
import HSABankProvider from './implementations/HSABankProvider';
import InstamedProvider from './implementations/InstamedProvider';
import M3PProvider from './implementations/M3PProvider';
import OnLifeProvider from './implementations/OnLifeProvider';
import PinnacleBankProvider from './implementations/PinnacleBankProvider';
import PremiseHealthProvider from './implementations/PremiseHealthProvider';
import ProviderDirectoryProvider from './implementations/ProviderDirectoryProvider';
import TeladocProvider from './implementations/TeladocProvider';
import VitalsPRPProvider from './implementations/VitalsPRPProvider';

// Map of provider instances
const providers: Record<string, SSOProvider> = {
  TeladocImpl: new TeladocProvider(),
  EyemedImpl: new EyemedProvider(),
  ProviderDirectoryImpl: new ProviderDirectoryProvider(),
  Blue365Impl: new Blue365Provider(),
  ChipRewardsImpl: new ChipRewardsProvider(),
  CVSCaremarkImpl: new CVSCaremarkProvider(),
  ElectronicPaymentBOAImpl: new ElectronicPaymentBOAProvider(),
  EmboldImpl: new EmboldProvider(),
  HealthEquityImpl: new HealthEquityProvider(),
  HSABankImpl: new HSABankProvider(),
  InstamedImpl: new InstamedProvider(),
  M3PImpl: new M3PProvider(),
  OnLifeImpl: new OnLifeProvider(),
  PinnacleBankImpl: new PinnacleBankProvider(),
  PremiseHealthImpl: new PremiseHealthProvider(),
  VitalsPRPImpl: new VitalsPRPProvider(),
};

/**
 * Factory for creating SSO provider instances
 */
export class ProviderFactory {
  /**
   * Get an SSO provider instance by partner ID
   */
  static getProvider(partnerId: string): SSOProvider {
    const providerType = SSO_IMPL_MAP.get(partnerId);

    if (!providerType) {
      throw new Error(`Unknown SSO provider ID: ${partnerId}`);
    }

    const provider = providers[providerType];

    if (!provider) {
      throw new Error(`Provider implementation not found for: ${providerType}`);
    }

    return provider;
  }

  /**
   * Generate SSO parameters using the provider implementation
   */
  static async generateSSOParameters(
    partnerId: string,
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<Map<string, string>> {
    const provider = ProviderFactory.getProvider(partnerId);
    const params = await provider.generateParameters(member, searchParams);
    return ProviderFactory.convertToMap(params);
  }

  /**
   * Convert parameter object to a Map<string, string> for backward compatibility
   */
  private static convertToMap(params: BaseSSOParameters): Map<string, string> {
    const map = new Map<string, string>();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        map.set(key, value.toString());
      }
    });

    return map;
  }

  /**
   * Get the display name for a partner ID
   */
  static getProviderName(partnerId: string): string {
    return SSO_TEXT_MAP.get(partnerId) || partnerId;
  }

  /**
   * Check if a provider supports drop-off SSO
   */
  static supportsDropOff(partnerId: string): boolean {
    const provider = ProviderFactory.getProvider(partnerId);
    return provider.supportsDropOff();
  }

  /**
   * Register a new provider implementation
   */
  static registerProvider(implName: string, provider: SSOProvider): void {
    providers[implName] = provider;
  }
}
