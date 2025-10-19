import type { Metadata } from "next";
import { Geist, Jua } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pin Pals",
  description: "A fun way to connect with friends using QR codes and pins!",
};

const jua = Jua({
  variable: "--font-jua",
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jua.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
