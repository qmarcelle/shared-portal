'use client'
import { ReactNode, useEffect, useRef, useState } from 'react';
import { ErrorInfoCard } from '../composite/ErrorInfoCard';

interface IframeProps {
  src?: string;
  title: string;
  id: string;
  width?: string;
  allowFullScreen?: boolean;
  srcdoc?: string;
  errorComponent?: ReactNode;
  className?: string;
}

const Iframe = ({
  src,
  title,
  id,
  width = '100%',
  srcdoc,
  errorComponent,
  className = '',
}: IframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateHeight = () => {
    try {
      if (iframeRef.current) {
        // const iframeContentWindow = iframeRef.current.contentWindow;
        // const contentHeight = iframeContentWindow?.document.body.scrollHeight;
        // iframeRef.current.style.height = `${contentHeight ? contentHeight + 25 : 0}px`;
      }
    } catch (error) {
      console.error('Error calculating iframe height:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
      setHasError(true);
    }
  };

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = calculateHeight;
      iframeRef.current.onerror = () => setHasError(true);
    }

    const handleMessage = (event: MessageEvent) => {
      console.log(`Received Message: ${event.data.message}`);
      if (!src) return;

      const iframeOrigin = new URL(src).origin;
      if (event.origin !== iframeOrigin) {
        // Ignore messages from unknown origins
        return;
      }

      if (event.data && event.data.type === 'error') {
        setHasError(true);
        setErrorMessage(
          event.data.message || 'An error occurred in the iframe.',
        );
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [src]);

  if (hasError) {
    console.error('Error loading iframe:', errorMessage);
    return (
      <div>
        {errorComponent || (
          <ErrorInfoCard
            className="mt-4 w-[73%]"
            errorText="There were issues loading the page. Please try again later."
          />
        )}
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      id={id}
      srcDoc={srcdoc}
      src={src}
      title={title}
      width={width}
      className={className}
    />
  );
};

export default Iframe;
