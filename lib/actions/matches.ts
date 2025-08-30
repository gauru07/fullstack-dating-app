// lib/actions/matches.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/user";

export async function getAllProfiles(): Promise<UserProfile[]> {
  try {
    const supabase = await createClient();
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch profiles:', error);
      throw new Error('Failed to fetch profiles');
    }

    // Transform the data to UserProfile format
    return users.map(user => ({
      id: user.id,
      name: user.full_name,
      age: user.age,
      bio: user.bio,
      photos: user.avatar_url ? [user.avatar_url] : [],
      gender: user.gender,
      location: user.location,
      jobTitle: user.job_title,
      company: user.company,
      education: user.education,
      sexualOrientation: user.sexual_orientation,
      interestedIn: user.interested_in,
      relationshipType: user.relationship_type,
      height: user.height,
      religion: user.religion,
      ethnicity: user.ethnicity,
      languagesSpoken: user.languages_spoken || [],
      drinking: user.drinking,
      smoking: user.smoking,
      prompts: user.prompts,
    }));
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Failed to fetch profiles');
  }
}

export async function likeUser(toUserId: string): Promise<{success: boolean; isMatch: boolean; matchedUser?: UserProfile}> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create a like record
    const { error: likeError } = await supabase
      .from('likes')
      .insert([
        {
          from_user_id: user.id,
          to_user_id: toUserId,
          status: 'interested'
        }
      ]);

    if (likeError) {
      throw new Error('Failed to like user');
    }

    // Check if it's a match (if the other user has also liked this user)
    const { data: receivedLikes, error: matchError } = await supabase
      .from('likes')
      .select('from_user_id')
      .eq('to_user_id', user.id)
      .eq('from_user_id', toUserId)
      .eq('status', 'interested');

    if (matchError) {
      console.error('Error checking for match:', matchError);
      return { success: true, isMatch: false };
    }

    const isMatch = receivedLikes && receivedLikes.length > 0;

    if (isMatch) {
      // Get the matched user's profile
      const { data: matchedUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', toUserId)
        .single();

      if (userError) {
        console.error('Error fetching matched user:', userError);
        return { success: true, isMatch: true };
      }

      return {
        success: true,
        isMatch: true,
        matchedUser: {
          id: matchedUser.id,
          name: matchedUser.full_name,
          age: matchedUser.age,
          bio: matchedUser.bio,
          photos: matchedUser.avatar_url ? [matchedUser.avatar_url] : [],
          gender: matchedUser.gender,
          location: matchedUser.location,
          jobTitle: matchedUser.job_title,
          company: matchedUser.company,
          education: matchedUser.education,
          sexualOrientation: matchedUser.sexual_orientation,
          interestedIn: matchedUser.interested_in,
          relationshipType: matchedUser.relationship_type,
          height: matchedUser.height,
          religion: matchedUser.religion,
          ethnicity: matchedUser.ethnicity,
          languagesSpoken: matchedUser.languages_spoken || [],
          drinking: matchedUser.drinking,
          smoking: matchedUser.smoking,
          prompts: matchedUser.prompts,
        },
      };
    }

    return { success: true, isMatch: false };
  } catch (error) {
    console.error('Error liking user:', error);
    throw new Error('Failed to like user');
  }
}

export async function getUserMatches(): Promise<UserProfile[]> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all matches for the current user
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        user1_id,
        user2_id,
        users!matches_user1_id_fkey(id, full_name, age, bio, avatar_url, gender, location, job_title, company, education, sexual_orientation, interested_in, relationship_type, height, religion, ethnicity, languages_spoken, drinking, smoking, prompts)
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (error) {
      throw new Error('Failed to fetch user matches');
    }

    // Transform the data to UserProfile format
    return matches.map(match => {
      const matchedUser = match.users;
      return {
        id: matchedUser.id,
        name: matchedUser.full_name,
        age: matchedUser.age,
        bio: matchedUser.bio,
        photos: matchedUser.avatar_url ? [matchedUser.avatar_url] : [],
        gender: matchedUser.gender,
        location: matchedUser.location,
        jobTitle: matchedUser.job_title,
        company: matchedUser.company,
        education: matchedUser.education,
        sexualOrientation: matchedUser.sexual_orientation,
        interestedIn: matchedUser.interested_in,
        relationshipType: matchedUser.relationship_type,
        height: matchedUser.height,
        religion: matchedUser.religion,
        ethnicity: matchedUser.ethnicity,
        languagesSpoken: matchedUser.languages_spoken || [],
        drinking: matchedUser.drinking,
        smoking: matchedUser.smoking,
        prompts: matchedUser.prompts,
      };
    });
  } catch (error) {
    console.error('Error fetching user matches:', error);
    throw new Error('Failed to fetch user matches');
  }
}