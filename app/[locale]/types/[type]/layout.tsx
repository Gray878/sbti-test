import AdsterraSocialBar from "@/components/ads/AdsterraSocialBar";

export default function SbtiTypeLayout({
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
