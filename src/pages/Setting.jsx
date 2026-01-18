import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { MdOutlinePerson, MdOutlinePalette, MdLogout, MdCheck, MdEdit } from 'react-icons/md';

const db = getDatabase();

const Settings = () => {
  const { logout, user } = useFirebase();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({ fullName: "", phone: "", address: "", dob: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    return onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      }
    });
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, profile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your profile and account details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MdOutlinePerson className="text-blue-500" size={24} />
              <h2 className="font-bold text-lg dark:text-white">Profile Information</h2>
            </div>
            <button 
              onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isEditing 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
              }`}
            >
              {isEditing ? <><MdCheck /> {loading ? 'Saving...' : 'Save Changes'}</> : <><MdEdit /> Edit Profile</>}
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="Full Name" 
              value={profile.fullName} 
              isEditing={isEditing} 
              onChange={(val) => setProfile({...profile, fullName: val})} 
            />
            <InputGroup 
              label="Phone Number" 
              value={profile.phone} 
              isEditing={isEditing} 
              onChange={(val) => setProfile({...profile, phone: val})} 
            />
            <InputGroup 
              label="Date of Birth" 
              value={profile.dob} 
              isEditing={isEditing} 
              type="date"
              onChange={(val) => setProfile({...profile, dob: val})} 
            />
             <div className="md:col-span-2">
              <InputGroup 
                label="Residential Address" 
                value={profile.address} 
                isEditing={isEditing} 
                onChange={(val) => setProfile({...profile, address: val})} 
              />
            </div>
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-red-800 dark:text-red-400 font-bold">Logout Session</h3>
            <p className="text-red-600/70 dark:text-red-400/60 text-sm">Securely sign out of your HelpingHands account.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20"
          >
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, isEditing, onChange, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
    {isEditing ? (
      <input 
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white outline-none focus:ring-2 ring-blue-500"
      />
    ) : (
      <p className="text-zinc-800 dark:text-zinc-200 font-medium py-2.5">{value || "Not set"}</p>
    )}
  </div>
);

export default Settings;