import RootLayoutData from "./layoutData";
import { Metadata } from "next";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Bibliopolis - Your Online Bookstore",
  description: "Explore a wide collection of books at Bibliopolis!",
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootLayoutData>{children}</RootLayoutData>
      </body>
    </html>);
}