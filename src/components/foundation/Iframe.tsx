import { useEffect, useRef } from 'react';

interface IframeProps {
  src?: string;
  title: string;
  id: string;
  width?: string;
  allowFullScreen?: boolean;
  srcdoc?: string;
}
const Iframe = ({ src, title, id, width = '100%', srcdoc }: IframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const calculateHeight = () => {
    if (iframeRef.current) {
      const iframeContentWindow = iframeRef.current.contentWindow;

      const contentHeight = iframeContentWindow?.document.body.scrollHeight;

      iframeRef.current.style.height = `${contentHeight ? contentHeight + 25 : 0}px`;
    }
  };
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = calculateHeight;
    }
  }, []);
  return (
    <iframe
      ref={iframeRef}
      id={id}
      srcDoc={srcdoc}
      src={src}
      title={title}
      width={width}
    />
  );
};

export default Iframe;
