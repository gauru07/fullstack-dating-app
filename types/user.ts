// types/user.ts
export interface UserPreferences {
  gender_preference?: string[];
  // Add other preference fields as needed
}

export interface UserLocation {
  coordinates?: [number, number];
  // Add other location fields as needed
}

export interface BackendUser {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  age: number;
  gender: string;
  photoUrl: string;
  about?: string;
  skills?: string[];
  preference?: UserPreferences;
  location?: UserLocation;
  education?: string;
  work?: string;
  religion?: string;
  languages?: string[];
  relationshipType?: string;
  smoking?: string;
  drinking?: string;
  prompts?: string[];
}

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  birthdate: string;
  bio: string;
  avatar_url: string;
  preferences: UserPreferences;
  location_lat?: number;
  location_lng?: number;
  last_active: string;
  is_verified: boolean;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to convert BackendUser to UserProfile
export function backendToUserProfile(backendUser: BackendUser): UserProfile {
  // Map backend gender to the expected values
  const genderMap: Record<string, "male" | "female" | "other"> = {
    male: "male",
    female: "female",
    // Add any other mappings you might need
  };
  
  const mappedGender = genderMap[backendUser.gender.toLowerCase()] || "other";

  return {
    id: backendUser._id,
    full_name: `${backendUser.firstName} ${backendUser.lastName}`,
    username: backendUser.emailId.split('@')[0],
    email: backendUser.emailId,
    gender: mappedGender,
    birthdate: new Date(new Date().getFullYear() - backendUser.age, 0, 1).toISOString(),
    bio: backendUser.about || "",
    avatar_url: backendUser.photoUrl || "/default-avatar.png",
    preferences: backendUser.preference || {},
    location_lat: backendUser.location?.coordinates?.[1],
    location_lng: backendUser.location?.coordinates?.[0],
    last_active: new Date().toISOString(),
    is_verified: true,
    is_online: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}