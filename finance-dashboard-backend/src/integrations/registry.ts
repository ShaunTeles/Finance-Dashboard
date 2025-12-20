import { BaseConnector, ConnectorCredentials } from './base-connector';
import { TrueLayerConnector } from './truelayer/TrueLayerConnector';

/**
 * Registry for API connectors
 * Add new providers here
 */
export class ConnectorRegistry {
  private static connectors: Map<string, new (credentials: ConnectorCredentials) => BaseConnector> = new Map([
    ['truelayer', TrueLayerConnector],
    // Add more connectors here:
    // ['plaid', PlaidConnector],
    // ['yodlee', YodleeConnector],
  ]);

  /**
   * Create a connector instance for a provider
   */
  static create(provider: string, credentials: ConnectorCredentials): BaseConnector {
    const ConnectorClass = this.connectors.get(provider.toLowerCase());

    if (!ConnectorClass) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return new ConnectorClass(credentials);
  }

  /**
   * Get list of supported providers
   */
  static getProviders(): string[] {
    return Array.from(this.connectors.keys());
  }

  /**
   * Check if a provider is supported
   */
  static isSupported(provider: string): boolean {
    return this.connectors.has(provider.toLowerCase());
  }

  /**
   * Register a new connector
   */
  static register(provider: string, ConnectorClass: new (credentials: ConnectorCredentials) => BaseConnector): void {
    this.connectors.set(provider.toLowerCase(), ConnectorClass);
  }
}

