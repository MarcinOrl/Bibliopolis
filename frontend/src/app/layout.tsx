'use client';

import localFont from "next/font/local";
import { FaShoppingCart } from 'react-icons/fa';
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
          <div className="w-full">
            <header className="p-4 flex justify-between items-center w-full mx-auto secondary-color shadow-md">
              {/* Logotyp po lewej */}
              <Link href="/">
                <span className="text-3xl font-bold accent-text cursor-pointer hover:text-indigo-600 transition-colors">
                  Bibliopolis
                </span>
              </Link>

              {/* Linki w środku */}
              <div className="flex items-center justify-center gap-6 w-full mx-auto flex-grow">
                <Link
                  href="/"
                  className="accent-text hover:text-indigo-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/books"
                  className="accent-text hover:text-indigo-600 transition-colors"
                >
                  Store
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/orders"
                    className="accent-text hover:text-indigo-600 transition-colors"
                  >
                    Orders
                  </Link>
                )}
                <Link
                  href="/slider"
                  className="accent-text hover:text-indigo-600 transition-colors"
                >
                  Slider
                </Link>
              </div>

              {/* Ikona koszyka i opcje logowania/zalogowanego */}
              <div className="flex items-center gap-4">
                <Link
                  href="/cart"
                  className="accent-text hover:text-indigo-600 transition-colors"
                >
                  <FaShoppingCart size={24} />
                </Link>
                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="border border-blue-500 text-blue-500 px-5 py-2 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    Login
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-100 transition-all"
                    >
                      Logout
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
