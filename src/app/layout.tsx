import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TG5WJTV7";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "G-GWXLDMY1ZB";

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
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
        {/* Google Analytics 4 (direct — also fired via GTM) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-script" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
        `}</Script>
      </head>
      <body className="min-h-screen antialiased">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
