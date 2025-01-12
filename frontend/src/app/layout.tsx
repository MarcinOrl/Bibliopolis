'use client';

import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { UserProvider } from '../utils/UserContext'; // Importowanie UserProvider
import ThemeManager from "../utils/ThemeManager";

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <ThemeManager />
          {/* Nagłówek */}
          <div className="w-full bg-gray-800">
            <header className="p-4 flex justify-between items-center w-full mx-auto">
              {/* Logotyp */}
              <Link href="/">
                <span className="text-3xl font-bold cursor-pointer">
                  Sklep z książkami
                </span>
              </Link>
              {/* Przyciski */}
              <div className="flex items-center gap-4">
                <Link href="/books" className="bg-blue-500 px-4 py-2 rounded text-white">
                  Książki
                </Link>
                <Link href="/cart" className="bg-blue-500 px-4 py-2 rounded text-white">
                  Koszyk
                </Link>
                <Link href="/slider" className="bg-yellow-500 px-4 py-2 rounded text-white">
                  Slider
                </Link>
                {!isLoggedIn ? (
                  <Link href="/login" className="bg-blue-500 px-4 py-2 rounded text-white">
                    Zaloguj się
                  </Link>
                ) : (
                  <>
                    <Link href="/orders" className="bg-blue-500 px-4 py-2 rounded text-white">
                      Zamówienia
                    </Link>
                    <Link href="/profile" className="bg-green-500 px-4 py-2 rounded text-white">
                      Twoje konto
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 px-4 py-2 rounded"
                    >
                      Wyloguj się
                    </button>
                  </>
                )}
              </div>
            </header>
          </div>

          {/* Główna część strony */}
          <main className="p-4">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
