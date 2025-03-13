import Script from 'next/script';

export const getMenuNavigationTermedPlan = () => {
  return (
    <div>
      {/* Other components */}
      <Script src="/widgets.min.js" strategy="beforeInteractive" />
    </div>
  );
};
