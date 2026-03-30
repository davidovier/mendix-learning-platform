import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Mendix Prep - Intermediate Certification Study Guide",
    template: "%s | Mendix Prep",
  },
  description:
    "Free practice exams, study materials, and progress tracking for the Mendix Intermediate Developer Certification. Master domain models, microflows, security, XPath, and more.",
  keywords: [
    "Mendix certification",
    "Mendix intermediate",
    "Mendix exam",
    "Mendix practice test",
    "Mendix study guide",
    "low-code certification",
    "Mendix developer",
    "Mendix training",
  ],
  authors: [{ name: "Mendix Prep" }],
  creator: "Mendix Prep",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mendix Prep",
    title: "Mendix Prep - Intermediate Certification Study Guide",
    description:
      "Free practice exams and study materials for the Mendix Intermediate Developer Certification.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mendix Prep - Certification Study Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mendix Prep - Intermediate Certification Study Guide",
    description:
      "Free practice exams and study materials for the Mendix Intermediate Developer Certification.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <TooltipProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
