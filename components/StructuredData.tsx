import Script from "next/script";

interface FAQItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  type: "FAQ";
  data: FAQItem[];
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  if (type === "FAQ") {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    return (
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    );
  }

  return null;
}
