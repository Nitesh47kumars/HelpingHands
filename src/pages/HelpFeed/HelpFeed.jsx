import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import {UserOwnHelpCard} from "./UserOwnHelpCard"
import {HelpCard} from "./HelpCard"

const HelpFeed = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const requestsRef = ref(db, "helpRequests");
    
    return onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setRequests(list.reverse()); // Show newest first
      }
    });
  }, []);

  return (
    <div className="mx-auto">
      <UserOwnHelpCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map(req => <HelpCard key={req.id} request={req} />)}
      </div>
    </div>
  );
};

export {HelpFeed}