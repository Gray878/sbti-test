"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function AdsterraSocialBar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    // 检测广告是否真的加载了内容
    const checkAdContent = () => {
      const container = document.getElementById("adsterra-social-bar-container");
      if (container && container.children.length > 0) {
        setHasContent(true);
      }
    };

    // 脚本加载后延迟检查
    if (isLoaded) {
      const timer = setTimeout(checkAdContent, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // 如果没有内容，不渲染任何东西
  if (isLoaded && !hasContent) {
    return null;
  }

  return (
    <>
      {/* 只有在可能有内容时才显示容器 */}
      <div
        id="adsterra-social-bar-container"
        style={{ display: hasContent ? "block" : "none" }}
      />
      <Script
        src="https://pl29160796.profitablecpmratenetwork.com/b0/c9/8e/b0c98e1984a6b4e05dfa27504f5bbe84.js"
        strategy="afterInteractive"
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          // 加载失败，不显示容器
          setIsLoaded(true);
        }}
      />
    </>
  );
}
