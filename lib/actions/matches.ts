"use server";

import { BackendUser, UserProfile, backendToUserProfile } from "@/types/user";

export async function getAllProfiles(): Promise<UserProfile[]> {
  try {
    const response = await fetch('http://localhost:3001/user/feed', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((user: BackendUser) => backendToUserProfile(user));
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
}

export async function likeUser(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:3001/request/send/interested/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response.ok;
  } catch (error) {
    console.error('Error liking user:', error);
    return false;
  }
}

export async function getUserMatches(): Promise<UserProfile[]> {
  try {
    const response = await fetch('http://localhost:3001/user/connections', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user matches');
    }

    const { data } = await response.json();
    
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((user: BackendUser) => backendToUserProfile(user));
  } catch (error) {
    console.error('Error fetching user matches:', error);
    throw new Error('Failed to fetch user matches');
  }
}
