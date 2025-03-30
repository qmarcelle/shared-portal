import React, { useState } from 'react';
import { ChatOption, ClientType, PlanInfo } from '../../../models/chat';

interface ChatFormProps {
  onSubmit: (serviceType: string, inquiryType: string) => void;
  onCancel: () => void;
  currentPlan: PlanInfo | null;
  isIDCardEligible: boolean;
  isDentalEligible: boolean;
  isCobraEligible: boolean;
}

/**
 * Form component that collects initial information before starting a chat session.
 * Different service and inquiry types are shown based on the member's plan.
 */
const ChatForm: React.FC<ChatFormProps> = ({
  onSubmit,
  onCancel,
  currentPlan,
  isIDCardEligible,
  isDentalEligible,
  isCobraEligible,
}) => {
  const [serviceType, setServiceType] = useState<string>('');
  const [inquiryType, setInquiryType] = useState<string>('');
  const [inquiryOptions, setInquiryOptions] = useState<ChatOption[]>([]);
  const [errors, setErrors] = useState({
    serviceType: false,
    inquiryType: false,
  });

  // Get client type from current plan
  const clientType =
    (currentPlan?.lineOfBusiness as ClientType) || ClientType.Default;

  // Generate service options based on client type
  const getServiceOptions = (): ChatOption[] => {
    // Basic options available to all
    const options: ChatOption[] = [
      { text: 'General Inquiry', value: 'GENERAL' },
    ];

    // Add ID card option if eligible
    if (isIDCardEligible) {
      options.push({ text: 'Order ID Card', value: 'ID_CARD' });
    }

    return options;
  };

  // Handle service type change
  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setServiceType(value);
    setInquiryType('');

    if (value) {
      setErrors((prev) => ({ ...prev, serviceType: false }));
      setInquiryOptions(getInquiryOptions(value));
    }
  };

  // Handle inquiry type change
  const handleInquiryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInquiryType(value);

    if (value) {
      setErrors((prev) => ({ ...prev, inquiryType: false }));
    }
  };

  // Get inquiry options based on selected service type and client type
  const getInquiryOptions = (selectedServiceType: string): ChatOption[] => {
    // If ID card service is selected
    if (selectedServiceType === 'ID_CARD') {
      return [{ text: 'Request ID Card', value: 'REQUEST_ID_CARD' }];
    }

    // For general inquiries, options depend on client type
    switch (clientType) {
      case ClientType.BlueCare:
      case ClientType.BlueCarePlus:
      case ClientType.CoverTN:
      case ClientType.CoverKids:
        return [
          { text: 'Eligibility', value: 'ELIGIBILITY' },
          { text: 'Benefits', value: 'BENEFITS' },
          { text: 'Claims Financial', value: 'CLAIMS_FINANCIAL' },
          { text: 'Member Update Information', value: 'MEMBER_UPDATE' },
          { text: 'Pharmacy', value: 'PHARMACY' },
        ];

      case ClientType.SeniorCare:
        return [
          { text: 'Coverage Questions', value: 'COVERAGE' },
          { text: 'Claims Questions', value: 'CLAIMS' },
          { text: 'Prescription Questions', value: 'PRESCRIPTION' },
          { text: 'Other', value: 'OTHER' },
        ];

      case ClientType.Individual:
        const individualOptions: ChatOption[] = [
          { text: 'Benefits and Coverage', value: 'BENEFITS' },
          { text: 'New or Existing Claims', value: 'CLAIMS' },
          { text: 'Premium Billing', value: 'BILLING' },
          { text: 'Deductibles', value: 'DEDUCTIBLES' },
          { text: 'Pharmacy and Prescriptions', value: 'PHARMACY' },
          { text: 'Find Care', value: 'FIND_CARE' },
          { text: 'Other', value: 'OTHER' },
        ];

        if (isDentalEligible) {
          individualOptions.push({ text: 'Dental', value: 'DENTAL' });
        }

        return individualOptions;

      case ClientType.BlueElite:
        const blueEliteOptions: ChatOption[] = [
          { text: 'Address Update', value: 'ADDRESS_UPDATE' },
          { text: 'Bank Draft', value: 'BANK_DRAFT' },
          { text: 'Premium Billing', value: 'BILLING' },
          { text: 'Report Date of Death', value: 'REPORT_DEATH' },
          { text: 'All Other', value: 'OTHER' },
        ];

        if (isDentalEligible) {
          blueEliteOptions.push({ text: 'Dental', value: 'DENTAL' });
        }

        return blueEliteOptions;

      // Default (Commercial)
      default:
        const defaultOptions: ChatOption[] = [
          { text: 'Benefits and Coverage', value: 'BENEFITS' },
          { text: 'New or Existing Claims', value: 'CLAIMS' },
          { text: 'Deductibles', value: 'DEDUCTIBLES' },
          { text: 'Pharmacy and Prescriptions', value: 'PHARMACY' },
          { text: 'Find Care', value: 'FIND_CARE' },
          { text: 'Other', value: 'OTHER' },
        ];

        if (isDentalEligible) {
          defaultOptions.push({ text: 'Dental', value: 'DENTAL' });
        }

        if (isCobraEligible) {
          defaultOptions.push({ text: 'COBRA', value: 'COBRA' });
        }

        return defaultOptions;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      serviceType: !serviceType,
      inquiryType: !inquiryType,
    };

    setErrors(newErrors);

    if (!newErrors.serviceType && !newErrors.inquiryType) {
      onSubmit(serviceType, inquiryType);
    }
  };

  return (
    <div className="flex flex-col p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">
        Before we connect you with a representative, please tell us how we can
        help.
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="serviceType" className="text-sm font-medium mb-1">
            What type of service do you need help with?
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={handleServiceTypeChange}
            className={`border rounded-md p-2 ${errors.serviceType ? 'border-error' : 'border-tertiary-4'}`}
            aria-invalid={errors.serviceType}
          >
            <option value="">Select a service</option>
            {getServiceOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
          {errors.serviceType && (
            <p className="text-error text-sm mt-1">
              Please select a service type
            </p>
          )}
        </div>

        {serviceType && (
          <div className="flex flex-col">
            <label htmlFor="inquiryType" className="text-sm font-medium mb-1">
              What specific inquiry do you have?
            </label>
            <select
              id="inquiryType"
              value={inquiryType}
              onChange={handleInquiryTypeChange}
              className={`border rounded-md p-2 ${errors.inquiryType ? 'border-error' : 'border-tertiary-4'}`}
              aria-invalid={errors.inquiryType}
            >
              <option value="">Select an inquiry type</option>
              {inquiryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            {errors.inquiryType && (
              <p className="text-error text-sm mt-1">
                Please select an inquiry type
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-tertiary-4 text-secondary rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-primary text-white rounded-md disabled:bg-tertiary-3"
            disabled={!serviceType || !inquiryType}
          >
            Start Chat
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatForm;
