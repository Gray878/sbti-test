"use client";

interface NativeBannerProps {
  className?: string;
}

export default function NativeBanner({ className = "" }: NativeBannerProps) {
  // Native Banner ad code
  const adHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden;
          background: transparent;
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
    </body>
    </html>
  `;

  return (
    <div className={className}>
      <iframe
        srcDoc={adHTML}
        style={{
          width: "100%",
          minHeight: "250px",
          border: "none",
          overflow: "hidden",
        }}
        scrolling="no"
        frameBorder="0"
        title="Native Banner Ad"
      />
    </div>
  );
}
