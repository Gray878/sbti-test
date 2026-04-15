"use client";

import { useState } from "react";

interface ResultBannerProps {
  className?: string;
}

// Desktop: 728x90, Mobile: 320x50
const DESKTOP_CONFIG = {
  key: "154acfd9dae3893fb569a3b399ccfb0c",
  width: 728,
  height: 90,
};

const MOBILE_CONFIG = {
  key: "c1b4b9125dac532bd0249893e0c5bcad",
  width: 320,
  height: 50,
};

export default function ResultBanner({ className = "" }: ResultBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Desktop ad HTML
  const desktopAdHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key': '${DESKTOP_CONFIG.key}',
          'format': 'iframe',
          'height': ${DESKTOP_CONFIG.height},
          'width': ${DESKTOP_CONFIG.width},
          'params': {}
        };
      </script>
      <script type="text/javascript" src="//www.highperformanceformat.com/${DESKTOP_CONFIG.key}/invoke.js"></script>
    </body>
    </html>
  `;

  // Mobile ad HTML
  const mobileAdHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key': '${MOBILE_CONFIG.key}',
          'format': 'iframe',
          'height': ${MOBILE_CONFIG.height},
          'width': ${MOBILE_CONFIG.width},
          'params': {}
        };
      </script>
      <script type="text/javascript" src="//www.highperformanceformat.com/${MOBILE_CONFIG.key}/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div className={className}>
      {/* Desktop ad */}
      <div className="hidden md:flex items-center justify-center">
        <iframe
          srcDoc={desktopAdHTML}
          style={{
            width: `${DESKTOP_CONFIG.width}px`,
            height: `${DESKTOP_CONFIG.height}px`,
            border: "none",
            overflow: "hidden",
          }}
          scrolling="no"
          frameBorder="0"
          title="Result Banner Ad Desktop"
        />
      </div>

      {/* Mobile ad */}
      <div className="flex md:hidden items-center justify-center">
        <iframe
          srcDoc={mobileAdHTML}
          style={{
            width: `${MOBILE_CONFIG.width}px`,
            height: `${MOBILE_CONFIG.height}px`,
            border: "none",
            overflow: "hidden",
          }}
          scrolling="no"
          frameBorder="0"
          title="Result Banner Ad Mobile"
        />
      </div>
    </div>
  );
}
