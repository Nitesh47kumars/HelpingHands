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
  if (loading || !user) return; // wait until auth state is ready

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

  if (!user) return <div className="p-6">Not logged in</div>;
  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          <img
            src={profile.avatarURL || "/vite.svg"}
            alt="Avatar"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.fullName}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{profile.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">{profile.dob}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{profile.address}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
