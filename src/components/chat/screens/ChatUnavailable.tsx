import React from 'react';

interface ChatUnavailableProps {
  reason: 'ineligible' | 'outside-hours' | 'error';
  opsPhone?: string;
  opsHours?: string;
  onClose: () => void;
}

/**
 * Component displayed when chat is unavailable,
 * showing different messages based on the reason
 */
const ChatUnavailable: React.FC<ChatUnavailableProps> = ({
  reason,
  opsPhone,
  opsHours,
  onClose,
}) => {
  const renderMessage = () => {
    switch (reason) {
      case 'ineligible':
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Chat Not Available</h3>
            <p className="mb-4">
              Chat is not available for your current plan. Please contact
              customer service by phone for assistance.
            </p>
          </>
        );
      case 'outside-hours':
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Outside Chat Hours</h3>
            <p className="mb-4">
              Chat is currently unavailable as our representatives are only
              available during business hours:
              <br />
              <span className="font-medium">{opsHours}</span>
            </p>
          </>
        );
      case 'error':
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Technical Difficulty</h3>
            <p className="mb-4">
              We&apos;re experiencing technical difficulties with our chat
              service. Please try again later or contact us by phone.
            </p>
          </>
        );
      default:
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">Chat Not Available</h3>
            <p className="mb-4">
              Chat is currently unavailable. Please try again later or contact
              customer service.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col p-6 overflow-y-auto">
      <div className="text-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-warning mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {renderMessage()}
      </div>

      {opsPhone && (
        <div className="bg-secondary-light p-4 rounded-md mb-6 text-center">
          <p className="font-medium mb-1">Contact Customer Service</p>
          <a
            href={`tel:${opsPhone.replace(/\D/g, '')}`}
            className="text-lg font-bold text-primary"
          >
            {opsPhone}
          </a>
          {opsHours && <p className="text-sm mt-1">{opsHours}</p>}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="py-2 px-6 bg-primary text-white rounded-md"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChatUnavailable;
