import { AnalyticsData } from '../models/analyticsData';

export const googleAnalytics = (analyticsData: AnalyticsData) => {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: analyticsData.event,
        click_text: analyticsData.click_text,
        click_url: analyticsData.click_url,
        element_category: analyticsData.element_category,
        action: analyticsData.action,
        content_type: analyticsData.content_type,
      });
    }
  } catch (error) {
    console.error('Analytics Error:', error);
  }
};