'use server';


export async function logServerEnvironment() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    PORTAL_SERVICES_URL: process.env.PORTAL_SERVICES_URL,
    MEMBERSERVICE_CONTEXT_ROOT: process.env.MEMBERSERVICE_CONTEXT_ROOT,
    ES_API_URL: process.env.ES_API_URL,
    ES_PORTAL_SVCS_API_URL: process.env.ES_PORTAL_SVCS_API_URL,
  };
  
  console.log('SERVER ENV CONFIG:', envVars);
  return envVars;
}