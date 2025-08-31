import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import Navbar from "@/components/Navbar";
import SetCurrentUser from "@/components/SetCurrentUser";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamMatch - Find Your Perfect Match",
  description:
    "Connect with like-minded people through live streaming, meaningful conversations, and authentic connections on StreamMatch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <SetCurrentUser />
        </AuthProvider>
      </body>
    </html>
  );
}
