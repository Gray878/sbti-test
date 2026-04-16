import AdsterraSocialBar from "@/components/ads/AdsterraSocialBar";

export default function AboutLayout({
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
