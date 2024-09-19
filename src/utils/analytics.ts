import { useLoginStore } from '@/app/login/stores/loginStore';
import { getUserIdDetails } from '../actions/userSessionDetails';
import { logger } from './logger';

export const googleAnalytics = async (
  click_text?: string,
  click_url?: string,
  element_category?: string,
  action?: string,
  event?: string,
  content_type?: string,
) => {
  try {
    (window?.dataLayer || []).push({
      click_text: click_text,
      click_url: click_url,
      element_category: element_category,
      action: action,
      event: event,
      content_type: content_type,
      user_id: await getUserId(),
    });
  } catch (error) {
    logger.error('googleAnalytics', error);
  }
};

export const getUserId = async () => {
  let userId = '';
  try {
    userId = await getUserIdDetails();
  } catch (error) {
    userId = useLoginStore.getState().username;
  }
  return userId;
};
