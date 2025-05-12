export interface AnalyticsData {
  click_text: string;
  click_url: string | undefined;
  element_category: string;
  action: string | undefined;
  event: string | undefined;
  content_type: string | undefined;
}