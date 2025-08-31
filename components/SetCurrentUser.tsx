"use client";

import { useAuth } from '@/contexts/auth-context';

export default function SetCurrentUser() {
  const { setCurrentUser } = useAuth();

  const setBansitaUser = () => {
    const user = {
      _id: "bansita123",
      firstName: "Bansita",
      lastName: "Saho",
      emailId: "bansita123@gmail.com",
      age: 24,
      gender: "Female",
      location: "Orisa",
      relationshipType: "casual",
      photoUrl: "",
      about: "",
      education: "",
      religion: "",
      drinking: "",
      smoking: "",
      prompts: ""
    };
    setCurrentUser(user);
    alert("User set to Bansita Saho! Check the navbar now.");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={setBansitaUser}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Set Current User (Debug)
      </button>
    </div>
  );
}
