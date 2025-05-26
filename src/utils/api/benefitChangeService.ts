import axios from 'axios';
import https from 'https';
import { getAuthToken } from './getToken';

const benefitChangeServiceURL = `${process.env.BENEFIT_CHANGE_SERVICE_URL}/`;
export const USER_HEADER = 'X-userId';
export const EFFECTIVE_DATE: string = 'effectivedate';
export const CURRENCY_FORMAT: string = '#0.00';
export const NO: string = 'N';
export const YES: string = 'Y';
export const BENEFIT_SERVICE_NOT_AVAILABLE: string =
  'Benefit Service not available';
export const DELETE_RECORD: string = 'D';
export const ADD_RECORD: string = 'A';
export const DEPENDENT: string = 'D';
export const VISION_PLAN: string = 'V';
export const DENTAL_PLAN: string = 'D';
export const RESIDENCE_ADDRESS: string = 'R';
export const BILLING_ADDRESS: string = 'B';
export const MAILING_ADDRESS: string = 'M';
export const APP_STATUS_SUBMITTED: string = 'S';
export const RESOURCE_API: string = 'resource/';
export const COUNTY_SETTING: string = 'counties';
export const REGION_CODE: string = 'regioncode';
export const REGION_CODES: string = 'regioncodes';
export const APPLICATIONS: string = 'applications';
export const APPLICATIONS_FOR_BROKER: string = 'applicationsforbroker';
export const BENEFIT_SERVICE: string = 'BenefitService';
export const BROKER_RESOURCES_SERVICE: string = 'BrokerResourcesService';
export const AD_LOOKUP_SERVICE: string = 'ADLookupService';
export const UPDATE_APP: string = 'updatebenefit';
export const SAVE_APP: string = 'savebenefit';
export const GET_APPLICATION: string = 'getbenefit';
export const MEDICAL_PLANS: string = 'medicalplans';
export const DENTAL_VISION_PLANS: string = 'dentalvisionplans';
export const DELETE_BENEFIT: string = 'deletebenefit';
export const GET_PLANS: string = 'getplans';
export const ZIP_CODES: string = 'zipcodes';

export const benefitChangeService = axios.create({
  baseURL: benefitChangeServiceURL,
  proxy:
    process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
      ? false
      : undefined,
  headers: {
    'Content-type': 'application/json',
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

benefitChangeService.interceptors.request?.use(
  async (config) => {
    try {
      console.log(`Request URL: ${benefitChangeServiceURL}${config.url}`);

      //Get Bearer Token from PING and add it in headers for ES service request.
      const token = await getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.log(`GetAuthToken ${error}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
