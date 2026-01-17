import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { useFirebase } from "../../context/firebaseContext";
import Header from "./Header";
import RequestManager from "./RequestManager";

const db = getDatabase();

const Dashboard = () => {
  const { user, loading: authLoading } = useFirebase();
  const [profile, setProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const userRef = ref(db, `users/${user.uid}`);
    const unsubscribeProfile = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      }
      setDataLoading(false);
    });

    const requestsRef = ref(db, "helpRequests");
    const unsubscribeRequests = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((req) => req.userId === user.uid);
        setMyRequests(list.reverse());
      } else {
        setMyRequests([]);
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribeRequests();
    };
  }, [user, authLoading]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this help request?")) {
      await remove(ref(db, `helpRequests/${id}`));
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await update(ref(db, `helpRequests/${id}`), { status: newStatus });
  };

  if (authLoading || dataLoading) {
    return (
      <div className="p-8 text-zinc-400 animate-pulse bg-zinc-950 min-h-screen">
        Loading Dashboard Data...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 bg-transparent min-h-screen">
      <Header profile={profile} requestCount={myRequests.length} />
      <RequestManager
        requests={myRequests}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
