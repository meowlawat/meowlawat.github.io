import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/navigation/Footer";
import { site } from "@/data/site";
import "./globals.css";

const SITE_URL = "https://hardikahlawat.me";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const title = "Hardik Ahlawat — Cybersecurity Researcher & ML Engineer";
const description =
  "Cybersecurity researcher and machine learning engineer working on trusted systems, network security, vulnerability research, and applied AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Hardik Ahlawat",
    "cybersecurity researcher",
    "machine learning engineer",
    "trusted execution environments",
    "Intel SGX",
    "network intrusion detection",
    "vulnerability research",
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title,
    description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: SITE_URL,
  jobTitle: site.role,
  email: site.email,
  sameAs: [site.github, site.linkedin, site.orcid],
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionConfig reducedMotion="user">
          <Navigation />
          <main className="flex-1 overflow-x-clip">{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
