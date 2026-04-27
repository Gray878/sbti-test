"use client";

import { useEffect, useRef, useState } from "react";

interface NativeBannerProps {
  className?: string;
}

export default function NativeBanner({ className = "" }: NativeBannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(0); // 初始高度为 0
  const [hasAd, setHasAd] = useState(false); // 是否有广告内容

  const adHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; 
          padding: 0;
          background: transparent;
          overflow: hidden;
        }
        #container-a14bbb8c8065c94639c6829cdf911920 {
          min-height: 100px;
        }
        #container-a14bbb8c8065c94639c6829cdf911920:empty {
          display: none;
        }
      </style>
    </head>
    <body>
      <div id="container-a14bbb8c8065c94639c6829cdf911920"></div>
      <script 
        async 
        data-cfasync="false" 
        src="https://pl29160795.profitablecpmratenetwork.com/a14bbb8c8065c94639c6829cdf911920/invoke.js">
      </script>
      <script>
        // 监听广告容器变化
        const checkAdLoaded = () => {
          const container = document.getElementById('container-a14bbb8c8065c94639c6829cdf911920');
          if (container && container.children.length > 0) {
            const height = Math.max(container.scrollHeight, 100);
            window.parent.postMessage({ 
              type: 'adLoaded', 
              height,
              hasContent: true 
            }, '*');
            return true;
          }
          return false;
        };

        // 使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(() => {
          if (checkAdLoaded()) {
            observer.disconnect();
          }
        });
        
        const container = document.getElementById('container-a14bbb8c8065c94639c6829cdf911920');
        if (container) {
          observer.observe(container, { childList: true, subtree: true });
          
          // 延迟检查（超时后通知父窗口没有广告）
          setTimeout(() => {
            if (!checkAdLoaded()) {
              window.parent.postMessage({ 
                type: 'adLoaded', 
                hasContent: false 
              }, '*');
              observer.disconnect();
            }
          }, 3000);
        }
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    // 监听来自 iframe 的消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "adLoaded") {
        if (event.data.hasContent) {
          setHasAd(true);
          setIframeHeight(event.data.height || 250);
        } else {
          setHasAd(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 如果没有广告，不渲染任何内容
  if (!hasAd && iframeHeight === 0) {
    return (
      <div style={{ display: "none" }}>
        <iframe
          ref={iframeRef}
          srcDoc={adHTML}
          style={{ display: "none" }}
          title="Native Banner Ad"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        ref={iframeRef}
        srcDoc={adHTML}
        style={{
          width: "100%",
          height: `${iframeHeight}px`,
          border: "none",
          display: hasAd ? "block" : "none",
          overflow: "hidden",
        }}
        title="Native Banner Ad"
      />
    </div>
  );
}
