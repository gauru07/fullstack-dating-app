"use client";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { signOut, user, loading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  // Check if current path matches navigation item
  const isActive = (path: string) => {
    if (path === "/matches" && pathname === "/matches") return true;
    if (path === "/matches/list" && pathname === "/matches/list") return true;
    if (path === "/matches/requests" && pathname === "/matches/requests") return true;
    if (path === "/chat" && pathname.startsWith("/chat")) return true;
    if (path === "/profile" && pathname.startsWith("/profile")) return true;
    return false;
  };

  const navItems = [
    { href: "/matches", label: "Discover", icon: "🔍" },
    { href: "/matches/list", label: "Matches", icon: "💕" },
    { href: "/matches/requests", label: "Requests", icon: "📨" },
    { href: "/chat", label: "Messages", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-red-600 dark:from-white dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
              StreamMatch
            </span>
          </Link>

          {/* Desktop Navigation - Always Visible */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                  isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-pink-500 to-red-500 shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            ) : user ? (
              <>
                {/* User Avatar */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-pink-200 dark:ring-pink-800">
                      <img
                        src={user.photoUrl || "/default-avatar.png"}
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                    {user.firstName}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                  </svg>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-pink-500 to-red-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
