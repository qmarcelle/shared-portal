/**
 * Genesys Cloud Configuration
 *
 * This file contains the configuration for the Genesys Cloud chat integration.
 * The values are taken from CHAT_INTEGRATION.md.
 */

// TypeScript declaration for Node.js process environment variables
declare const process: {
  env: {
    NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID?: string;
    NEXT_PUBLIC_GENESYS_CLOUD_PROD_DEPLOYMENT_ID?: string;
    NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT?: string;
    NEXT_PUBLIC_GENESYS_CLOUD_BOOTSTRAP_URL?: string;
  };
};

/**
 * Interface for Genesys Cloud configuration object
 */
export interface GenesysCloudConfig {
  deploymentId: string;
  environment: string;
  bootstrapUrl: string;
}

/**
 * Interface for the default configuration with both deployment IDs
 */
interface DefaultGenesysCloudConfig extends GenesysCloudConfig {
  prodDeploymentId: string;
}

/**
 * Default Genesys Cloud Configuration
 * This configuration is used when no environment variables are available.
 */
export const DEFAULT_GENESYS_CLOUD_CONFIG: DefaultGenesysCloudConfig = {
  // First deployment key (Possibly Development/Test)
  deploymentId: '52dd824c-f565-47a6-a6d5-f30d81c97491',
  // Production deployment key
  prodDeploymentId: '6200855c-734b-4ebd-b169-790103ec1bbb',
  // Environment
  environment: 'prod-usw2',
  // URL to the Genesys Bootstrap script
  bootstrapUrl: 'https://apps.usw2.pure.cloud/genesys-bootstrap/genesys.min.js',
};

/**
 * Resolves the deployment ID based on production flag and environment variables
 * @param isProd - Whether to use production deployment ID
 * @returns The appropriate deployment ID
 */
function resolveDeploymentId(isProd: boolean): string {
  if (isProd) {
    return (
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_PROD_DEPLOYMENT_ID ||
      DEFAULT_GENESYS_CLOUD_CONFIG.prodDeploymentId
    );
  }
  return (
    process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
    DEFAULT_GENESYS_CLOUD_CONFIG.deploymentId
  );
}

/**
 * Resolves the environment from environment variables or fallback
 * @returns The Genesys Cloud environment string
 */
function resolveEnvironment(): string {
  return (
    process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT ||
    DEFAULT_GENESYS_CLOUD_CONFIG.environment
  );
}

/**
 * Resolves the bootstrap URL from environment variables or fallback
 * @returns The Genesys Cloud bootstrap URL
 */
function resolveBootstrapUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GENESYS_CLOUD_BOOTSTRAP_URL ||
    DEFAULT_GENESYS_CLOUD_CONFIG.bootstrapUrl
  );
}

/**
 * Get the Genesys Cloud configuration based on the current environment
 * @param isProd - Whether to use production configuration (default: false)
 * @returns Complete Genesys Cloud configuration object
 */
export function getGenesysCloudConfig(isProd = false): GenesysCloudConfig {
  return {
    deploymentId: resolveDeploymentId(isProd),
    environment: resolveEnvironment(),
    bootstrapUrl: resolveBootstrapUrl(),
  };
}

/**
 * Generates the Genesys Cloud initialization script template
 * @param config - The Genesys Cloud configuration object
 * @returns The complete JavaScript initialization script
 */
function createGenesysScript(config: GenesysCloudConfig): string {
  return `
    (function (g, e, n, es, ys) {
      g['_genesysJs'] = e;
      g[e] = g[e] || function () {
        (g[e].q = g[e].q || []).push(arguments)
      };
      g[e].t = 1 * new Date();
      g[e].c = es;
      ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
    })(window, 'Genesys', '${config.bootstrapUrl}', {
      environment: '${config.environment}',
      deploymentId: '${config.deploymentId}'
    });
  `;
}

/**
 * Generates the Genesys Cloud script that should be injected into the page
 * @param isProd - Whether to use production configuration (default: false)
 * @returns The complete JavaScript script for injection
 */
export function generateGenesysCloudScript(isProd = false): string {
  const config = getGenesysCloudConfig(isProd);
  return createGenesysScript(config);
}
