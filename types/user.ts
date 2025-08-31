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
  age?: number;
  gender?: string;
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
  // Additional fields from BackendUser
  education?: string;
  work?: string;
  religion?: string;
  languages?: string[];
  relationshipType?: string;
  smoking?: string;
  drinking?: string;
  skills?: string[];
  prompts?: string[];
}

// Helper function to convert BackendUser to UserProfile
export function backendToUserProfile(backendUser: BackendUser): UserProfile {
  if (!backendUser || !backendUser._id) {
    throw new Error('Invalid user data');
  }

  // Map backend gender to the expected values with fallback
  const genderMap: Record<string, "male" | "female" | "other"> = {
    male: "male",
    female: "female",
  };
  
  const mappedGender = backendUser.gender 
    ? (genderMap[backendUser.gender.toLowerCase()] || "other")
    : "other";

  // Calculate age with fallback
  const age = backendUser.age || 25; // Default age if not provided

  return {
    id: backendUser._id,
    full_name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim(),
    username: backendUser.emailId ? backendUser.emailId.split('@')[0] : 'user',
    email: backendUser.emailId || '',
    gender: mappedGender,
    birthdate: new Date(new Date().getFullYear() - age, 0, 1).toISOString(),
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
    // Map additional fields
    education: backendUser.education,
    work: backendUser.work,
    religion: backendUser.religion,
    languages: backendUser.languages,
    relationshipType: backendUser.relationshipType,
    smoking: backendUser.smoking,
    drinking: backendUser.drinking,
    skills: backendUser.skills,
    prompts: backendUser.prompts,
  };
}