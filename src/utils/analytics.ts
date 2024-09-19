export const googleAnalytics = (
  click_text?: string,
  click_url?: string,
  element_category?: string,
  action?: string,
  event?: string,
) => {
  window.dataLayer.push({
    click_text: click_text,
    click_url: click_url,
    element_category: element_category,
    action: action,
    event: event,
  });
};
