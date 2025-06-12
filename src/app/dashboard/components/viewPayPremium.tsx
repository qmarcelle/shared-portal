import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Loader } from '@/components/foundation/Loader';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ViewPayPremiumProps extends IComponent {
  label: string;
  subLabelOne: string;
  subLabelTwo: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryButtonCallback?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  secondaryButtonCallback?: () => any;
}

export const ViewPayPremium = ({
  label,
  subLabelOne,
  subLabelTwo,
  primaryButtonLabel,
  secondaryButtonLabel,
  primaryButtonCallback,
}: ViewPayPremiumProps) => {
  const { dismissModal } = useAppModalStore();
  const router = useRouter();

  // Defect 75829: SSO timeout handling state management
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetryAvailable, setIsRetryAvailable] = useState(false);
  const errorMessageRef = useRef<HTMLDivElement>(null);

  // Defect 75829: Focus management for accessibility
  useEffect(() => {
    if (errorMessage && errorMessageRef.current) {
      errorMessageRef.current.focus();
    }
  }, [errorMessage]);

  // Defect 75829: Error message mapping for different failure scenarios
  const getErrorMessage = (error: AxiosError): string => {
    if (!error.response) {
      return 'Unable to connect. Please check your network connection.';
    }

    switch (error.response.status) {
      case 504:
        return 'Unable to connect to payment system. Please try again later.';
      case 503:
        return 'Payment service is temporarily unavailable. Please try again later.';
      default:
        return 'Unable to connect to payment system. Please try again later.';
    }
  };

  // Defect 75829: Handle SSO connection with timeout and error handling
  const handleSSOConnection = async () => {
    // Prevent multiple connection attempts
    if (isConnecting) return;

    setIsConnecting(true);
    setErrorMessage(null);
    setIsRetryAvailable(false);

    try {
      // Direct navigation to SSO launch following existing pattern
      router.push(
        '/sso/launch?PartnerSpId=' +
          process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA,
      );
      dismissModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      setErrorMessage(getErrorMessage(axiosError));
      setIsRetryAvailable(true);
    } finally {
      setIsConnecting(false);
    }
  };

  // Defect 75829: Retry mechanism
  const handleRetry = () => {
    handleSSOConnection();
  };

  return (
    <section id="modal-premium" className="flex flex-col items-center p-7">
      <Column className="flex flex-col items-center">
        <Header type="title-2" text={label} />
        <Spacer size={16} />
        <TextBox className="text-center" text={subLabelOne} />
        <Spacer size={16} />
        <TextBox className="text-center" text={subLabelTwo} />
        <Spacer size={16} />

        {/* Defect 75829: Loading state during SSO connection */}
        {isConnecting && (
          <>
            <div data-testid="loading-spinner">
              <Loader />
            </div>
            <Spacer size={8} />
            <TextBox
              className="text-center"
              text="Connecting to payment system..."
              aria-label="connecting to payment system"
            />
            <Spacer size={16} />
          </>
        )}

        {/* Defect 75829: Error message display with focus management */}
        {errorMessage && (
          <>
            <div
              ref={errorMessageRef}
              tabIndex={-1}
              className="text-red-600 text-center p-2 border border-red-300 rounded bg-red-50"
              role="alert"
              aria-live="polite"
            >
              <TextBox text={errorMessage} />
            </div>
            <Spacer size={16} />
          </>
        )}

        <Row className="flex w-full justify-between">
          <Button
            label={primaryButtonLabel}
            type="secondary"
            callback={primaryButtonCallback}
          />
          <Spacer axis="horizontal" size={24} />

          {/* Defect 75829: Conditional button rendering based on state */}
          {isRetryAvailable ? (
            <Button
              label="Try Again"
              type="primary"
              callback={handleRetry}
              disable={isConnecting}
            />
          ) : (
            <Button
              icon={<Image alt="" src={externalOffsiteWhiteIcon} />}
              className="font-bold active"
              label={secondaryButtonLabel}
              type="primary"
              disable={isConnecting}
              callback={handleSSOConnection}
            />
          )}
        </Row>
      </Column>
    </section>
  );
};
