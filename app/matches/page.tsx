// app/matches/page.tsx
"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import MatchButtons from "@/components/MatchButtons";
import { BackendUser, UserProfile, backendToUserProfile } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function MatchesPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isPassing, setIsPassing] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/feed', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      console.log("Raw API response:", data);
      
      const userArray = Array.isArray(data) ? data : (data?.data || []);
      console.log("User array length:", userArray.length);
      console.log("User array:", userArray);
      
      const allProfiles: UserProfile[] = userArray.map((u: BackendUser) => {
        try {
          return backendToUserProfile(u);
        } catch (error) {
          console.error("Error converting user:", u, error);
          return null;
        }
      }).filter(Boolean) as UserProfile[];
      
      console.log("Final profiles length:", allProfiles.length);
      console.log("Final profiles:", allProfiles);
      
      setProfiles(allProfiles);
      setCurrentIndex(0);
    } catch (e) {
      console.error("Error loading profiles:", e);
      setError("Failed to load profiles");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const advance = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      loadProfiles();
    }
  };

  const handleLike = async () => {
    if (profiles.length === 0 || isLiking) return;
    
    setIsLiking(true);
    const currentProfile = profiles[currentIndex];
    
    try {
      console.log(`🔄 Sending like to user: ${currentProfile.id} (${currentProfile.full_name})`);
      
      const response = await fetch(`http://localhost:3001/request/send/interested/${currentProfile.id}`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log(`📡 Like response status: ${response.status}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ Like successful! Response:`, responseData);
        
        // Show success message
        alert(`Like sent to ${currentProfile.full_name}!`);
        
        // Simulate match (you can implement real match logic here)
        const isMatch = Math.random() > 0.7; // 30% chance of match for demo
        if (isMatch) {
          setMatchedUser(currentProfile);
          setShowMatch(true);
          setTimeout(() => {
            setShowMatch(false);
            setMatchedUser(null);
            advance();
          }, 3000);
        } else {
          advance();
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error(`❌ Like failed! Status: ${response.status}, Error:`, errorData);
        alert(`Failed to send like: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("❌ Error liking profile:", e);
      alert("Network error while sending like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handlePass = async () => {
    if (profiles.length === 0 || isPassing) return;
    
    setIsPassing(true);
    const currentProfile = profiles[currentIndex];
    
    try {
      console.log(`🔄 Sending pass for user: ${currentProfile.id} (${currentProfile.full_name})`);
      
      const response = await fetch(`http://localhost:3001/request/send/ignored/${currentProfile.id}`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log(`📡 Pass response status: ${response.status}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ Pass successful! Response:`, responseData);
        alert(`Passed on ${currentProfile.full_name}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error(`❌ Pass failed! Status: ${response.status}, Error:`, errorData);
        alert(`Failed to pass: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("❌ Error passing profile:", e);
      alert("Network error while passing. Please try again.");
    } finally {
      setIsPassing(false);
      advance();
    }
  };

  const getAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
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
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Finding amazing people for you...</p>
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
            onClick={loadProfiles}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No more profiles</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We&apos;re finding more amazing people for you to discover!</p>
          <button
            onClick={loadProfiles}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Refresh
          </button>
        </motion.div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Discover Matches</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Swipe through profiles and find your perfect match</p>
          
          {/* Refresh Button */}
          <button
            onClick={loadProfiles}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Profiles'}
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -300, rotateY: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-sm mb-8"
            >
              {/* Enhanced Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Profile Image */}
                <div className="relative h-96">
                  <Image
                    src={currentProfile.avatar_url || "/default-avatar.png"}
                    alt={currentProfile.full_name}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.png";
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Online Status */}
                  {currentProfile.is_online && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-green-500 rounded-full p-1 shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Verified Badge */}
                  {currentProfile.is_verified && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-500 rounded-full p-1.5 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Profile Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">
                        {currentProfile.full_name}, {getAge(currentProfile.birthdate)}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium">
                          {currentProfile.gender}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm opacity-90 mb-2">@{currentProfile.username}</p>
                    <p className="text-sm line-clamp-2 opacity-80">
                      {currentProfile.bio || "No bio available"}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Education */}
                    {currentProfile.education && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Education</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{currentProfile.education}</p>
                        </div>
                      </div>
                    )}

                    {/* Work */}
                    {currentProfile.work && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Work</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{currentProfile.work}</p>
                        </div>
                      </div>
                    )}

                    {/* Religion */}
                    {currentProfile.religion && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Religion</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{currentProfile.religion}</p>
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {currentProfile.languages && currentProfile.languages.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3V3a1 1 0 112 0v1h3V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM5 6h10v11H5V6z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Languages</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{currentProfile.languages.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {/* Skills/Interests */}
                    {currentProfile.skills && currentProfile.skills.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Skills & Interests</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{currentProfile.skills.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {/* Relationship Type */}
                    {currentProfile.relationshipType && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Looking for</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">{currentProfile.relationshipType}</p>
                        </div>
                      </div>
                    )}

                    {/* Lifestyle */}
                    {(currentProfile.smoking || currentProfile.drinking) && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Lifestyle</p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {[currentProfile.smoking, currentProfile.drinking].filter(Boolean).join(' • ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-6"
          >
            <button
              onClick={handlePass}
              disabled={isPassing || isLiking}
              className="group relative w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-full h-full flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-red-500 group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </button>

            <button
              onClick={handleLike}
              disabled={isLiking || isPassing}
              className="group relative w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-full h-full flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </button>
          </motion.div>

          {/* Loading States */}
          {(isLiking || isPassing) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLiking ? "Sending like..." : "Passing..."}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Match Notification */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md mx-auto shadow-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">It&apos;s a Match! 🎉</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You and {matchedUser.full_name} liked each other!
              </p>
              <button
                onClick={() => setShowMatch(false)}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-2 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}