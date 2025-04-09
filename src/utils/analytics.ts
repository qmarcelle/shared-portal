import { useLoginStore } from '@/app/login/stores/loginStore';
import { AnalyticsData } from '@/models/app/analyticsData';
import { getUserIdDetails } from '../actions/userSessionDetails';
import { logger } from './logger';

export const GTM_ID = 'GTM-5GNS5V6';

export const ANALYTICS_KEYS = {
  CLICK_TEXT: 'click_text',
  CLICK_URL: 'click_url',
  ELEMENT_CATEGORY: 'element_category',
  ACTION: 'action',
  EVENT: 'event',
  CONTENT_TYPE: 'content_type',
  PAGE_SECTION: 'page_section',
  SELECTION_TYPE: 'selection_type',
  SITE_SECTION: 'site_section',
} as const;

export const googleAnalytics = async (data: AnalyticsData) => {
  try {
    (window?.dataLayer ?? []).push({
      [ANALYTICS_KEYS.CLICK_TEXT]: data.click_text,
      [ANALYTICS_KEYS.CLICK_URL]: data.click_url,
      [ANALYTICS_KEYS.ELEMENT_CATEGORY]: data.element_category,
      [ANALYTICS_KEYS.ACTION]: data.action,
      [ANALYTICS_KEYS.EVENT]: data.event,
      [ANALYTICS_KEYS.CONTENT_TYPE]: data.content_type,
      [ANALYTICS_KEYS.PAGE_SECTION]: data.page_section,
      [ANALYTICS_KEYS.SELECTION_TYPE]: data.selection_type,
      [ANALYTICS_KEYS.SITE_SECTION]: data.site_section,
    });
  } catch (error) {
    logger.error('googleAnalytics', error);
  }
};

export const getUserId = async () => {
  try {
    return await getUserIdDetails();
  } catch (error) {
    logger.warn(
      'Failed to get user ID from details, falling back to username',
      error,
    );
    return useLoginStore.getState().username;
  }
};
