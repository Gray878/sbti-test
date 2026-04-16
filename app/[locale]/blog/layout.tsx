import AdsterraSocialBar from "@/components/ads/AdsterraSocialBar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AdsterraSocialBar />
    </>
  );
}
