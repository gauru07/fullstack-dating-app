"use client";

import { useState, useEffect } from 'react';
import { BackendUser, UserProfile, backendToUserProfile } from '@/types/user';
import { API_BASE_URL } from '@/lib/config';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface RequestData {
  requestId?: string;
  user?: BackendUser;
  status?: string;
  createdAt?: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Array<{requestId: string, profile: UserProfile}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/user/request/received`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      console.log("Raw requests data:", data);

      if (!data.data || !Array.isArray(data.data)) {
        console.log("No requests data or data is not an array");
        setRequests([]);
        return;
      }

      const requestProfiles = data.data.map((item: unknown, index: number) => {
        try {
          let userData: BackendUser;
          let requestId: string;
          
          const typedItem = item as { requestId?: string; user?: BackendUser; _id?: string };
          
          if (typedItem.requestId && typedItem.user) { // Check for new structure
            userData = typedItem.user;
            requestId = typedItem.requestId;
          } else { // Assume old structure
            userData = item as BackendUser;
            requestId = (item as BackendUser)._id; // Use user ID as request ID for now
          }

          if (!userData || !userData._id) {
            console.error(`Request ${index} has no valid user data`);
            return null;
          }

          const profile = backendToUserProfile(userData);
          return { requestId: requestId, profile: profile };
        } catch (error) {
          console.error(`Error processing request ${index}:`, error);
          return null;
        }
      }).filter(Boolean);

      console.log("Processed requests:", requestProfiles);
      setRequests(requestProfiles);
    } catch (error) {
      console.error("Error loading requests:", error);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/review/accepted/${requestId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the accepted request from the list
        setRequests(prev => prev.filter(req => req.requestId !== requestId));
      } else {
        console.error('Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/review/rejected/${requestId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the rejected request from the list
        setRequests(prev => prev.filter(req => req.requestId !== requestId));
      } else {
        console.error('Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Loading requests...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadRequests}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Connection Requests</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Review and respond to people who liked your profile</p>
          
          {/* Refresh Button */}
          <button
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Requests'}
          </button>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          <Link
            href="/matches"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <span>Discover More</span>
          </Link>
          <Link
            href="/matches/list"
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>View Matches</span>
          </Link>
        </motion.div>
        
        {requests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No pending requests</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              When someone likes your profile, you&apos;ll see their request here.
            </p>
            <Link 
              href="/matches" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              Start Discovering
            </Link>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center text-gray-600 dark:text-gray-300 mb-6"
            >
              {requests.length} pending request{requests.length !== 1 ? 's' : ''}
            </motion.div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {requests.map(({ requestId, profile }, index) => (
                  <motion.div
                    key={requestId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Image
                            src={profile.avatar_url || "/default-avatar.png"}
                            alt={profile.full_name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover ring-2 ring-pink-200 dark:ring-pink-800"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/default-avatar.png";
                            }}
                          />
                          {profile.is_online && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {profile.full_name}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            @{profile.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {profile.bio || "No bio available"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-6">
                        <button
                          onClick={() => handleAccept(requestId)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => handleReject(requestId)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
