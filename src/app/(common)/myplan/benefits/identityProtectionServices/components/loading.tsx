/**
 * Loading component for benefits/identityProtectionServices/components
 * Displays while the page content is loading
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-pulse text-center">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}