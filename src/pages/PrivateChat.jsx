import React, { useState, useEffect, useRef } from "react";
import { useFirebase } from "../context/firebaseContext";
import { getDatabase, ref, push, onValue, serverTimestamp } from "firebase/database";
import { MdSend } from "react-icons/md";
import { FaUserCircle , FaUserFriends} from "react-icons/fa";

const db = getDatabase();

const PrivateChat = () => {
  const { user } = useFirebase();
  const [users, setUsers] = useState([]); // List of all users to chat with
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // 1. Fetch all users from the database to show in the sidebar
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const otherUsers = Object.values(data).filter(u => u.uid !== user.uid);
        setUsers(otherUsers);
      }
    });
  }, [user]);

  // 2. Generate a unique Room ID for two users (Alphabetical Order)
  const getRoomId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  // 3. Listen for messages when a user is selected
  useEffect(() => {
    if (!selectedUser) return;

    const roomId = getRoomId(user.uid, selectedUser.uid);
    const chatRef = ref(db, `privateChats/${roomId}`);
    
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedUser, user.uid]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const roomId = getRoomId(user.uid, selectedUser.uid);
    const chatRef = ref(db, `privateChats/${roomId}`);

    await push(chatRef, {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-[85vh] mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      
      {/* Users List Sidebar */}
      <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-white">
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <button
              key={u.uid}
              onClick={() => setSelectedUser(u)}
              className={`w-full flex items-center gap-3 p-4 transition-colors ${
                selectedUser?.uid === u.uid ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <FaUserCircle size={40} className="text-zinc-400" />
              <div className="text-left">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">{u.fullName}</p>
                <p className="text-xs text-zinc-500 truncate w-32">Click to chat</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <FaUserCircle size={30} className="text-zinc-400" />
              <span className="font-bold text-zinc-800 dark:text-white">{selectedUser.fullName}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                    msg.senderId === user.uid 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedUser.fullName}...`}
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white px-4 py-2 rounded-xl outline-none"
              />
              <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform active:scale-90">
                <MdSend size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <FaUserFriends size={50} className="mb-4 opacity-20" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateChat;