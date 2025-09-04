"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/lib/config';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    age: '',
    gender: '',
    profilePic: '',
    bio: '',
    relationshipType: '',
    location: '',
    education: '',
    jobTitle: '',
    company: '',
    religion: '',
    drinking: '',
    smoking: '',
    prompts: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and symbol");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          emailId: form.emailId,
          password: form.password,
          age: Number(form.age),
          gender: form.gender,
          photoUrl: form.profilePic,
          about: form.bio,
          relationshipType: form.relationshipType,
          location: form.location,
          education: form.education,
          jobTitle: form.jobTitle,
          company: form.company,
          religion: form.religion,
          drinking: form.drinking,
          smoking: form.smoking,
          prompts: form.prompts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Signup failed');
      }

      if (data.message === 'User registered successfully') {
        alert("Signup successful! You can now login.");
        router.push("/login");
      } else {
        throw new Error('Signup failed');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          {/* Header Section */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-4xl">✨</span>
            </motion.div>
            <h1 className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">
              Join StreamMatch
            </h1>
            <p className="text-gray-300 text-xl">Start your journey to find meaningful connections! 💕</p>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6 text-center backdrop-blur-sm"
              >
                <span className="text-lg mr-2">⚠️</span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">👤</span>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">👤</span>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your last name"
                  />
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">📧</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    required
                    value={form.emailId}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">🔒</span>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Create a strong password"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Must contain: 8+ characters, uppercase, lowercase, number, and symbol
                  </p>
                </div>
              </motion.div>

              {/* Personal Information */}
              <motion.div
                className="grid md:grid-cols-3 gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">🎂</span>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={form.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Your age"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">⚧</span>
                    Gender
                  </label>
                  <select
                    name="gender"
                    required
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">💕</span>
                    Looking for
                  </label>
                  <select
                    name="relationshipType"
                    required
                    value={form.relationshipType}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">Select type</option>
                    <option value="serious">Serious Relationship</option>
                    <option value="casual">Casual Dating</option>
                    <option value="friendship">Friendship</option>
                    <option value="marriage">Marriage</option>
                  </select>
                </div>
              </motion.div>

              {/* Location and Education */}
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">📍</span>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">🎓</span>
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Your education level"
                  />
                </div>
              </motion.div>

              {/* Work Information */}
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">💼</span>
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Your job title"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <span className="mr-2">🏢</span>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Your company"
                  />
                </div>
              </motion.div>

              {/* Bio Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <label className="block text-white font-semibold mb-3 text-lg">
                  <span className="mr-2">📝</span>
                  About You
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                  placeholder="Tell us about yourself..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Account...
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">✨</span>
                      Create My Account
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Sign In Link */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
            >
              <p className="text-gray-300 mb-4">
                Already have an account?{' '}
                <span className="text-pink-300 font-semibold">Welcome back!</span>
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="mr-2">🔐</span>
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="mr-2">←</span>
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}