import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  );
}
