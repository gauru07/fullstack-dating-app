"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
              StreamMatch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Find your perfect streaming partner and connect through meaningful conversations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-4 px-8 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💕</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find people who share your interests and values
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real Conversations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chat and connect with your matches instantly
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentic Connections
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build meaningful relationships that last
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to find your match?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of people who have found meaningful connections on StreamMatch
            </p>
            <Link
              href="/auth"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
