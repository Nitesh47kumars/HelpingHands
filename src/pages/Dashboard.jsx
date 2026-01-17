import { useEffect, useState } from "react";
import { useFirebase } from "../context/firebaseContext";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const db = getDatabase();

const Dashboard = () => {
  const { user, logout, loading } = useFirebase();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (loading || !user) return; 

    const userRef = ref(db, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) setProfile(snapshot.val());
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Loading & Error States with Dark Mode support
  if (!user) return <div className="p-6 text-zinc-500 dark:text-zinc-400">Not logged in</div>;
  if (!profile) return (
    <div className="p-6 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      Loading profile...
    </div>
  );

  return (
    <div className="bg-transparent transition-colors duration-300">
      <div className="mx-auto min-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 dark:border-zinc-800">
          <div className="relative">
            <img
              src={profile.avatarURL || "/vite.svg"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md"
            />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full"></div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
            <p className="text-gray-500 dark:text-zinc-400 font-medium">{profile.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
              Verified Profile
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-bold">Phone Number</p>
            <p className="text-base font-medium text-gray-800 dark:text-zinc-200">{profile.phone || "Not provided"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-bold">Date of Birth</p>
            <p className="text-base font-medium text-gray-800 dark:text-zinc-200">{profile.dob || "Not provided"}</p>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-bold">Residential Address</p>
            <p className="text-base font-medium text-gray-800 dark:text-zinc-200 leading-relaxed">
              {profile.address || "No address on file"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;