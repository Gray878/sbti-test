"use client";

import Script from "next/script";

function normalizeAdsensePublisherId(value?: string) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/^ca-pub-/i, "");

  return normalized || null;
}

const GoogleAdsense = () => {
  const publisherId = normalizeAdsensePublisherId(
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID
  );

  return (
    <>
      {publisherId ? (
        <>
          <Script
            async
            id="google-adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default GoogleAdsense;
