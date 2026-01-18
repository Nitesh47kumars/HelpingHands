import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { useFirebase } from "../../context/firebaseContext";
import Header from "./Header";
import RequestManager from "./RequestManager";
import Loading from "../../Components/Loading";
import { UserOwnHelpCard } from "../HelpFeed/UserOwnHelpCard";

const db = getDatabase();

const Dashboard = () => {
  const { user, loading: authLoading, awardKarma } = useFirebase();
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
    const request = myRequests.find((req) => req.id === id);

    await update(ref(db, `helpRequests/${id}`), { status: newStatus });

    if (newStatus === "completed" && request.helperId) {
      const minPrice = parseInt(request.minPrice) || 0;
      const maxPrice = parseInt(request.maxPrice) || 0;
      const avgPrice = (minPrice + maxPrice) / 2;
      
      const karmaPoints = Math.max(Math.floor(avgPrice / 10), 5);
      
      const success = await awardKarma(request.helperId, karmaPoints);
      
      if (success) {
        alert(
          `✅ Request completed! Awarded ${karmaPoints} karma points to ${request.helperName || "helper"}!`
        );
      }
    }
  };

  if (authLoading || dataLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 pb-10 bg-transparent min-h-screen">
      <Header profile={profile} requestCount={myRequests.length} />
      <UserOwnHelpCard />
      <RequestManager
        requests={myRequests}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;