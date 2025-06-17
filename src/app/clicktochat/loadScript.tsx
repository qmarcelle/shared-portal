// loadScriptOrStyle.ts
type AssetType = 'script' | 'style';

export const loadScriptOrStyle = (
  url: string,
  type: AssetType,
  id: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    // Add cache-busting query param
    const cacheBustedUrl = `${url}${url.includes('?') ? '&' : '?'}cb=v9`; //currently version 1. Change version for preventing caching issues.

    let element: HTMLScriptElement | HTMLLinkElement | null = null;

    if (type === 'script') {
      element = document.createElement('script');
      element.src = cacheBustedUrl;
      element.async = false;
      element.id = id;
      element.onload = () => resolve();
      element.onerror = () =>
        reject(new Error(`Failed to load script: ${url}`));
      document.body.appendChild(element);
    } else if (type === 'style') {
      element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = cacheBustedUrl;
      element.id = id;
      element.onload = () => resolve();
      element.onerror = () => reject(new Error(`Failed to load style: ${url}`));
      document.head.appendChild(element);
    }
  });
};
