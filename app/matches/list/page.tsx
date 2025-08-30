// app/matches/list/page.tsx
"use client";
import { getUserMatches } from "@/lib/actions/matches";
import { UserProfile } from "@/types/user";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MatchesListPage() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const userMatches = await getUserMatches();
      setMatches(userMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Your Matches
        </h1>
        
        {matches.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="text-lg mb-4">You dont have any matches yet.</p>
            <Link 
              href="/matches" 
              className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              Discover People
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={match.avatar_url}
                    alt={match.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {match.full_name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">@{match.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {match.bio}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link 
                      href={`/chat/${match.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Message
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}