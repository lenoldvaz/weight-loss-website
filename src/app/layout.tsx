import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://weight-loss.ca"
  ),
  title: {
    default: "weight-loss.ca — Canada's #1 Weight Loss Resource",
    template: "%s | weight-loss.ca",
  },
  description:
    "Evidence-based weight loss guidance for Canadians. Expert reviews of clinics, programs, diets, and products — with Canadian pricing, provincial programs, and Health Canada references.",
  keywords: [
    "weight loss Canada",
    "weight loss clinic Canada",
    "Canadian diet",
    "lose weight Canada",
    "weight management Canadian",
    "health Canada weight loss",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://weight-loss.ca",
    siteName: "weight-loss.ca",
    title: "weight-loss.ca — Canada's #1 Weight Loss Resource",
    description:
      "Evidence-based weight loss guidance for Canadians. Expert-reviewed clinics, programs, and products.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "weight-loss.ca — Canada's #1 Weight Loss Resource",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "weight-loss.ca — Canada's #1 Weight Loss Resource",
    description:
      "Evidence-based weight loss guidance for Canadians.",
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
  alternates: {
    canonical: "https://weight-loss.ca",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      className={`${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.country" content="Canada" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
