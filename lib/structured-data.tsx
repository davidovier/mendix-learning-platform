// lib/structured-data.ts

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

export interface FAQItem {
  question: string;
  answer: string;
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mendix Prep",
    description:
      "Free practice exams and study materials for Mendix Intermediate Developer Certification",
    url: SITE_URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with limited features",
    },
  };
}

export function courseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Mendix Intermediate Certification Prep",
    description:
      "Comprehensive preparation course covering all exam topics for Mendix Intermediate Developer Certification",
    provider: {
      "@type": "Organization",
      name: "Mendix Prep",
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT30H",
    },
  };
}

export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
