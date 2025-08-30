"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // In your frontend, ensure you're using the correct field names
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
    profilePic: "",
    photos: [],
    bio: "",
    sexualOrientation: "",
    interestedIn: "",
    relationshipType: "unsure", // Set default value
    height: "",
    location: "",
    education: "",
    jobTitle: "",
    company: "",
    religion: "",
    ethnicity: "",
    languagesSpoken: [],
    drinking: "", // Empty string instead of undefined
    smoking: "", // Empty string instead of undefined
    prompts: "", // String instead of object
    });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const supabase = createClient();
    
    // First, create the user account with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (authData.user) {
      // Then, create the user profile in the database
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            full_name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            age: Number(form.age),
            gender: form.gender,
            bio: form.bio,
            sexual_orientation: form.sexualOrientation,
            interested_in: form.interestedIn,
            relationship_type: form.relationshipType,
            height: form.height,
            location: form.location,
            education: form.education,
            job_title: form.jobTitle,
            company: form.company,
            religion: form.religion,
            ethnicity: form.ethnicity,
            languages_spoken: form.languagesSpoken,
            drinking: form.drinking,
            smoking: form.smoking,
            prompts: form.prompts,
            avatar_url: form.profilePic,
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw error here as the user account was created successfully
      }

      alert("Signup successful! Please check your email to verify your account.");
      router.push("/login");
    }
  } catch (err: unknown) {
    console.error("Signup error:", err);
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left side - Gradient background with branding */}
      <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8 flex flex-col justify-between text-white">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">StreamMatch</h1>
          <p className="text-purple-100">Find your perfect streaming partner</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p>Find people who love the same shows</p>
          </div>
          
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p>Connect based on shared interests</p>
          </div>
          
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p>Watch parties and discussions</p>
          </div>
        </div>
        
        <div className="mt-8 text-purple-200 text-sm">
          <p>© 2023 StreamMatch. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-3/5 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Your Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join our community of streaming enthusiasts</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 w-3 h-3 rounded-full mr-2"></span>
                Basic Information
              </h2>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    required
                    min="18"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 w-3 h-3 rounded-full mr-2"></span>
                Profile Details
              </h2>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Tell others about yourself and what you like to watch..."
                  />
                </div>
                
                <div>
                  <label htmlFor="sexualOrientation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sexual Orientation
                  </label>
                  <select
                    id="sexualOrientation"
                    name="sexualOrientation"
                    value={form.sexualOrientation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select orientation</option>
                    <option value="straight">Straight</option>
                    <option value="gay">Gay</option>
                    <option value="lesbian">Lesbian</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="asexual">Asexual</option>
                    <option value="demisexual">Demisexual</option>
                    <option value="pansexual">Pansexual</option>
                    <option value="queer">Queer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interested In
                  </label>
                  <select
                    id="interestedIn"
                    name="interestedIn"
                    value={form.interestedIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select preference</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="both">Both</option>
                    <option value="all">All</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Relationship Type
                  </label>
                  <select
                    id="relationshipType"
                    name="relationshipType"
                    value={form.relationshipType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select type</option>
                    <option value="friendship">Friendship</option>
                    <option value="dating">Dating</option>
                    <option value="casual">Casual</option>
                    <option value="long-term">Long-term</option>
                    <option value="open">Open relationship</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 w-3 h-3 rounded-full mr-2"></span>
                Additional Information
              </h2>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Education
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select education</option>
                    <option value="high-school">High School</option>
                    <option value="some-college">Some College</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor Degree</option>
                    <option value="master">Master Degree</option>
                    <option value="doctorate">Doctorate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center pt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}