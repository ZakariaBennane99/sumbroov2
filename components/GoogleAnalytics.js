// components/GoogleAnalytics.js

import Script from 'next/script';

function GoogleAnalytics() {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-RF3BMLXJ5M" strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RF3BMLXJ5M');
        `}
      </Script>
    </>
  );
}

export default GoogleAnalytics;
