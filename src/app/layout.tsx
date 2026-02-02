import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Contactbar from "@/components/Contactbar";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import ReduxProvider from "@/utils/lib/redux/ReduxProvider";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // add weights you need
});

export const metadata: Metadata = {
  title: {
    default: "Bhattarai Metal Works | Metal Fabrication & Construction Excellence in Nepal",
    template: "%s | Bhattarai Metal Works"
  },
  description: "Nepal's leading metal fabrication and construction experts. Specializing in structural engineering, designer metal furniture, industrial sheds, and custom interior solutions.",
  keywords: [
    "metal fabrication nepal",
    "construction company nepal",
    "metal furniture nepal",
    "steel structure nepal",
    "bbq machine nepal",
    "skilled workers nepal",
    "design studio nepal",
    "interior metalwork nepal",
    "industrial sheds nepal",
    "roofing services nepal"
  ],
  authors: [{ name: "Bhattarai Metal Works" }],
  creator: "Bhattarai Metal Works",
  publisher: "Bhattarai Metal Works",
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://bhattaraimetalworks.com",
    title: "Bhattarai Metal Works | Metal Fabrication & Construction Nepal",
    description: "Expert metal fabrication, construction services, and custom furniture. Crafting strength and design for homes and businesses across Nepal.",
    siteName: "Bhattarai Metal Works",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bhattarai Metal Works - Crafting Strength & Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhattarai Metal Works | Metal Fabrication & Construction",
    description: "Modern metal fabrication and construction solutions in Nepal.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} antialiased bg-[var(--background)]`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
