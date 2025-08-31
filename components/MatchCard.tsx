// components/MatchCard.tsx
import { UserProfile } from "@/types/user";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MatchCard({ user }: { user: UserProfile }) {
  // Calculate age from birthdate
  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getDisplayName = () => {
    return user.full_name || 'Anonymous';
  };

  const getUsername = () => {
    return user.username || 'user';
  };

  const getBio = () => {
    return user.bio || "No bio available";
  };

  return (
    <motion.div 
      className="relative w-full max-w-sm mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-swipe aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-gray-800">
        <div className="relative w-full h-full group">
          {/* Main Image */}
          <Image
            src={user.avatar_url || "/default-avatar.png"}
            alt={getDisplayName()}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/default-avatar.png";
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-white text-sm font-medium border border-white/30">
              {user.is_online ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              ) : (
                <span>Recently Active</span>
              )}
            </div>
          </div>

          {/* Verified Badge */}
          {user.is_verified && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500 rounded-full p-2 shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {/* Name and Age */}
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">
                    {getDisplayName()}, {calculateAge(user.birthdate)}
                  </h2>
                  <p className="text-lg opacity-90 mb-2 font-medium">
                    @{getUsername()}
                  </p>
                </div>
                
                {/* Gender Badge */}
                <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-sm font-medium border border-white/30">
                  {user.gender}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <p className="text-base leading-relaxed line-clamp-3 drop-shadow-md">
                  {getBio()}
                </p>
                
                {/* Location if available */}
                {user.location_lat && user.location_lng && (
                  <div className="flex items-center space-x-1 text-sm opacity-80">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Nearby</span>
                  </div>
                )}
              </div>

              {/* Tags/Interests */}
              <div className="flex flex-wrap gap-2 pt-2">
                {user.preferences && Object.keys(user.preferences).length > 0 && (
                  <span className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-xs font-medium border border-white/30">
                    Looking for {user.gender === 'male' ? 'women' : user.gender === 'female' ? 'men' : 'people'}
                  </span>
                )}
                <span className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-xs font-medium border border-white/30">
                  {user.is_verified ? 'Verified' : 'New'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Card Shadow Effect */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-11/12 h-4 bg-black/20 rounded-full blur-xl"></div>
    </motion.div>
  );
}