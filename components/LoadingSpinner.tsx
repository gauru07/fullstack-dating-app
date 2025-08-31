"use client";
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center z-50">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main loading circle */}
        <motion.div
          className="w-20 h-20 border-4 border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner gradient circle */}
        <motion.div
          className="absolute inset-2 border-4 border-transparent border-t-pink-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center heart */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-2xl">💘</span>
        </motion.div>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        className="absolute bottom-1/4 text-white text-lg font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Loading StreamMatch...
      </motion.div>
    </div>
  );
}
