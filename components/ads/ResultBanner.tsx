"use client";

import { useEffect, useRef, useState } from "react";

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
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const [hasDesktopAd, setHasDesktopAd] = useState(false);
  const [hasMobileAd, setHasMobileAd] = useState(false);

  // Desktop ad HTML
  const desktopAdHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div id="ad-container"></div>
      <script type="text/javascript">
        atOptions = {
          'key': '${DESKTOP_CONFIG.key}',
          'format': 'iframe',
          'height': ${DESKTOP_CONFIG.height},
          'width': ${DESKTOP_CONFIG.width},
          'params': {}
        };
      </script>
      <script 
        type="text/javascript" 
        src="//www.highperformanceformat.com/${DESKTOP_CONFIG.key}/invoke.js">
      </script>
      <script>
        // 检测广告是否加载
        setTimeout(() => {
          const container = document.getElementById('ad-container');
          const hasContent = document.body.querySelector('iframe') !== null || 
                           (container && container.children.length > 0);
          window.parent.postMessage({ 
            type: 'desktopAdLoaded', 
            hasContent 
          }, '*');
        }, 2000);
      </script>
    </body>
    </html>
  `;

  // Mobile ad HTML
  const mobileAdHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div id="ad-container"></div>
      <script type="text/javascript">
        atOptions = {
          'key': '${MOBILE_CONFIG.key}',
          'format': 'iframe',
          'height': ${MOBILE_CONFIG.height},
          'width': ${MOBILE_CONFIG.width},
          'params': {}
        };
      </script>
      <script 
        type="text/javascript" 
        src="//www.highperformanceformat.com/${MOBILE_CONFIG.key}/invoke.js">
      </script>
      <script>
        // 检测广告是否加载
        setTimeout(() => {
          const container = document.getElementById('ad-container');
          const hasContent = document.body.querySelector('iframe') !== null || 
                           (container && container.children.length > 0);
          window.parent.postMessage({ 
            type: 'mobileAdLoaded', 
            hasContent 
          }, '*');
        }, 2000);
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    // 监听来自 iframe 的消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "desktopAdLoaded") {
        setHasDesktopAd(event.data.hasContent);
      } else if (event.data.type === "mobileAdLoaded") {
        setHasMobileAd(event.data.hasContent);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 如果两个广告都没有加载，不渲染任何内容
  if (!hasDesktopAd && !hasMobileAd) {
    return (
      <div style={{ display: "none" }}>
        <iframe
          ref={desktopIframeRef}
          srcDoc={desktopAdHTML}
          style={{ display: "none" }}
          title="Result Banner Ad Desktop"
        />
        <iframe
          ref={mobileIframeRef}
          srcDoc={mobileAdHTML}
          style={{ display: "none" }}
          title="Result Banner Ad Mobile"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop ad */}
      {hasDesktopAd && (
        <div className="hidden md:flex items-center justify-center">
          <iframe
            ref={desktopIframeRef}
            srcDoc={desktopAdHTML}
            style={{
              width: `${DESKTOP_CONFIG.width}px`,
              height: `${DESKTOP_CONFIG.height}px`,
              border: "none",
              overflow: "hidden",
            }}
            title="Result Banner Ad Desktop"
          />
        </div>
      )}

      {/* Mobile ad */}
      {hasMobileAd && (
        <div className="flex md:hidden items-center justify-center">
          <iframe
            ref={mobileIframeRef}
            srcDoc={mobileAdHTML}
            style={{
              width: `${MOBILE_CONFIG.width}px`,
              height: `${MOBILE_CONFIG.height}px`,
              border: "none",
              overflow: "hidden",
            }}
            title="Result Banner Ad Mobile"
          />
        </div>
      )}
    </div>
  );
}
