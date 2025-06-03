/**
 * Genesys Cloud Configuration
 *
 * This file contains the configuration for the Genesys Cloud chat integration.
 * The values are taken from CHAT_INTEGRATION.md.
 */

/**
 * Default Genesys Cloud Configuration
 * This configuration is used when no environment variables are available.
 */
export const DEFAULT_GENESYS_CLOUD_CONFIG = {
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
 * Get the Genesys Cloud configuration based on the current environment
 */
export function getGenesysCloudConfig(isProd = false) {
  return {
    deploymentId: isProd
      ? process.env.NEXT_PUBLIC_GENESYS_CLOUD_PROD_DEPLOYMENT_ID ||
        DEFAULT_GENESYS_CLOUD_CONFIG.prodDeploymentId
      : process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
        DEFAULT_GENESYS_CLOUD_CONFIG.deploymentId,
    environment:
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT ||
      DEFAULT_GENESYS_CLOUD_CONFIG.environment,
    bootstrapUrl:
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_BOOTSTRAP_URL ||
      DEFAULT_GENESYS_CLOUD_CONFIG.bootstrapUrl,
  };
}

/**
 * Generates the Genesys Cloud script that should be injected into the page
 */
export function generateGenesysCloudScript(isProd = false): string {
  const config = getGenesysCloudConfig(isProd);

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
