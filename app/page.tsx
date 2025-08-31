"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { emoji: "💕", delay: 0, x: 10, y: 20 },
    { emoji: "✨", delay: 0.5, x: -15, y: -10 },
    { emoji: "🎯", delay: 1, x: 20, y: -15 },
    { emoji: "💬", delay: 1.5, x: -10, y: 25 },
    { emoji: "🔥", delay: 2, x: 15, y: -20 },
    { emoji: "💫", delay: 2.5, x: -20, y: 15 },
  ];

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-20"
            initial={{ 
              x: `${element.x}vw`, 
              y: `${element.y}vh`,
              rotate: 0 
            }}
            animate={{ 
              x: `${element.x + 5}vw`, 
              y: `${element.y - 5}vh`,
              rotate: 360 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: "reverse",
              delay: element.delay 
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 1 }}
        >
          {/* Hero Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6 shadow-2xl">
                <span className="text-4xl">💘</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-7xl md:text-8xl font-black text-white mb-6 bg-gradient-to-r from-pink-300 via-red-300 to-purple-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              StreamMatch
            </motion.h1>

            <motion.p 
              className="text-2xl md:text-3xl text-gray-200 mb-12 font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Where <span className="text-pink-300 font-semibold">meaningful connections</span> meet<br />
              <span className="text-purple-300 font-semibold">modern technology</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25"
                >
                  <span className="mr-2">🚀</span>
                  Start Your Journey
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="mr-2">🔐</span>
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              {
                icon: "🎯",
                title: "Smart Matching",
                description: "AI-powered algorithm finds your perfect match based on interests, values, and compatibility",
                color: "from-pink-500 to-red-500"
              },
              {
                icon: "💬",
                title: "Real-time Chat",
                description: "Seamless messaging with video calls and voice messages for deeper connections",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                description: "Advanced privacy controls and verification system to ensure authentic connections",
                color: "from-red-500 to-purple-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <motion.div 
                    className="text-6xl mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>



          {/* Final CTA */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Match? 🎯
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of people who have discovered meaningful connections and lasting relationships on StreamMatch
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 text-white font-bold text-xl rounded-full hover:from-pink-600 hover:via-red-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25"
              >
                <span className="mr-3">💘</span>
                Create Your Profile Now
                <span className="ml-3">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Developer Credit */}
      <motion.footer 
        className="relative z-10 text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div className="text-gray-400 text-sm">
          <p className="mb-2">Made with ❤️ by</p>
          <motion.div
            className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-pink-300 font-bold text-lg">Gaurav Satpute</span>
            <span className="ml-2 text-purple-300">Developer</span>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
