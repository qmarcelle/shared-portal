import React, { useState } from 'react';

interface CobrowseConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Component for getting user consent before initiating co-browsing/screen sharing
 */
const CobrowseConsent: React.FC<CobrowseConsentProps> = ({
  onAccept,
  onDecline,
}) => {
  const [hasReadConsent, setHasReadConsent] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Screen Sharing Request</h3>
          <button
            onClick={onDecline}
            className="text-secondary"
            aria-label="Close"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            A customer service representative has requested to view your screen
            to better assist you. During screen sharing:
          </p>

          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              The representative will be able to see what&apos;s displayed on
              your screen
            </li>
            <li>
              They cannot control your computer or see anything outside your
              browser window
            </li>
            <li>You can end the screen sharing session at any time</li>
            <li>No personal files or other applications will be accessible</li>
            <li>The session is limited to this browser tab only</li>
          </ul>

          <p className="text-sm text-secondary-dark mt-4">
            For security reasons, you may want to close or minimize any other
            open tabs or windows before accepting.
          </p>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="consentCheckbox"
            checked={hasReadConsent}
            onChange={() => setHasReadConsent(!hasReadConsent)}
            className="mr-2"
          />
          <label htmlFor="consentCheckbox" className="text-sm">
            I understand and consent to screen sharing
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onDecline}
            className="py-2 px-4 border border-tertiary-4 text-secondary rounded-md"
            type="button"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="py-2 px-4 bg-primary text-white rounded-md disabled:bg-tertiary-3"
            disabled={!hasReadConsent}
            type="button"
          >
            Accept Screen Sharing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CobrowseConsent;
