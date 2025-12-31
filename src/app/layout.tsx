import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Contactbar from "@/components/Contactbar";
import { Poppins } from "next/font/google";

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
  title: "Bhattarai Metal works",
  description: "Metal fabrication,construction,supply and funiture in nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} antialiased    `}
      >
        
       
   

        <Navbar/>
        
        {children} 
      </body>
    </html>
  );
}
