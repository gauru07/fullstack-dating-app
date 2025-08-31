"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const [form, setForm] = useState({
    emailId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    window.location.href = "/matches";
    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(form.emailId, form.password);
      window.location.href = "/matches";
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-3xl">💘</span>
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">
              StreamMatch
            </h1>
            <p className="text-gray-300 text-lg">Welcome back! 💕</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6 text-center backdrop-blur-sm"
              >
                <span className="text-lg mr-2">⚠️</span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="block text-white font-semibold mb-3 text-lg">
                  <span className="mr-2">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailId"
                  required
                  value={form.emailId}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="block text-white font-semibold mb-3 text-lg">
                  <span className="mr-2">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Signing In...
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      Sign In
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="flex items-center my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-4 text-gray-300 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <p className="text-gray-300 mb-4">
                Don&apos;t have an account?{' '}
                <span className="text-pink-300 font-semibold">Join us!</span>
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth"
                  className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="mr-2">✨</span>
                  Create Account
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="mr-2">←</span>
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}