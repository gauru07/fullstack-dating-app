// app/matches/page.tsx
"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import MatchButtons from "@/components/MatchButtons";
import { getAllProfiles, likeUser } from "@/lib/actions/matches";
import { UserProfile } from "@/types/user";

export default function MatchesPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const allProfiles = await getAllProfiles();
      setProfiles(allProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (profiles.length === 0) return;

    const currentProfile = profiles[currentIndex];
    try {
      const result = await likeUser(currentProfile.id);
      
      if (result.isMatch && result.matchedUser) {
        // Handle match - show notification or navigate to matches
        console.log("It's a match!", result.matchedUser);
      }

      // Move to next profile
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reload when we run out of profiles
        loadProfiles();
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };

  const handlePass = () => {
    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reload when we run out of profiles
      loadProfiles();
      setCurrentIndex(0);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (profiles.length === 0) {
    return <div className="flex justify-center items-center h-screen">No profiles found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Discover Matches
        </h1>
        
        <div className="flex flex-col items-center">
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            {currentIndex + 1} of {profiles.length} profiles
          </div>
          
          <div className="w-full max-w-sm mb-8">
            <MatchCard user={profiles[currentIndex]} />
          </div>
          
          <MatchButtons onLike={handleLike} onPass={handlePass} />
        </div>
      </div>
    </div>
  );
}