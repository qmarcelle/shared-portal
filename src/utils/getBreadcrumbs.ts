interface Breadcrumb {
  label: string;
  path: string;
}

type RouteMetadata = {
  [key: string]: string;
};

// Common acronyms that should remain uppercase
const COMMON_ACRONYMS = new Set(['FAQ', 'HSA', 'FSA', 'ID', 'SSN']);

/**
 * Converts a camelCase or kebab-case string to Title Case
 * @param str The string to convert
 * @returns The string in Title Case
 */
const toTitleCase = (str: string): string => {
  // Handle kebab-case
  const withoutHyphens = str.replace(/-/g, ' ');

  // Handle camelCase with special care for acronyms
  const withSpaces = withoutHyphens
    .replace(/([A-Z][a-z]+|[A-Z]{2,}(?=[A-Z][a-z]|\d|\W|$))/g, ' $1')
    .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase words

  // Split into words and process each
  const words = withSpaces.trim().split(/\s+/);

  return words
    .map((word) => {
      // Check if word is exactly a known acronym
      const upperWord = word.toUpperCase();
      if (COMMON_ACRONYMS.has(upperWord)) {
        return upperWord;
      }

      // Handle compound words with acronyms (e.g., memberIDCard)
      // Only match exact acronyms with word boundaries
      for (const acronym of COMMON_ACRONYMS) {
        const regex = new RegExp(`\\b${acronym}\\b`, 'i');
        if (regex.test(word)) {
          return word.replace(regex, acronym);
        }
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Generates breadcrumb navigation items from a given path
 * @param path The current path
 * @param metadata Optional metadata for route labels
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbs = (
  path: string,
  metadata: RouteMetadata = {},
): Breadcrumb[] => {
  // Handle root path
  if (path === '/') {
    return [];
  }

  // Remove query parameters if present
  const cleanPath = path.split('?')[0];

  // Split path into segments
  const segments = cleanPath.split('/').filter(Boolean);

  // Build breadcrumbs array
  return segments.reduce<Breadcrumb[]>((breadcrumbs, segment, index) => {
    // Build the current path
    const currentPath = '/' + segments.slice(0, index + 1).join('/');

    // Check if we have a dynamic segment pattern in metadata
    const dynamicPattern = Object.keys(metadata).find((pattern) => {
      const regex = new RegExp(
        '^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$',
      );
      return regex.test(currentPath);
    });

    // Get the label from metadata or generate from segment
    const label = dynamicPattern
      ? metadata[dynamicPattern]
      : toTitleCase(segment);

    breadcrumbs.push({
      label,
      path: currentPath,
    });

    return breadcrumbs;
  }, []);
};
