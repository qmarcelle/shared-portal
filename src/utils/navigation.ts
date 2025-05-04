import { redirect } from 'next/navigation';

/**
 * Navigate to a new route programmatically outside of React components
 * @param path The path to navigate to
 */
export const navigateTo = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  } else {
    redirect(path);
  }
};

/**
 * Reload the current page
 */
export const reloadPage = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

/**
 * Get the current URL
 * @returns The current URL or empty string if not in browser
 */
export const getCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
};

/**
 * Get the current pathname
 * @returns The current pathname or empty string if not in browser
 */
export const getCurrentPathname = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '';
};

/**
 * Get URL search params
 * @returns URLSearchParams object or null if not in browser
 */
export const getSearchParams = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return null;
};
