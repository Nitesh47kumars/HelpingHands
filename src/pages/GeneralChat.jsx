import React, { useState, useEffect, useRef } from "react";
import { useFirebase } from "../context/firebaseContext";
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  serverTimestamp, 
  onDisconnect, 
  set 
} from "firebase/database";
import { MdSend } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

const db = getDatabase();

const GeneralChat = () => {
  const { user } = useFirebase();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const scrollRef = useRef();

  // 1. Handle Presence (Online Status)
  useEffect(() => {
    if (!user) return;

    const myStatusRef = ref(db, `status/${user.uid}`);
    const onlineUsersRef = ref(db, "status");

    // Set user as online and handle disconnect
    set(myStatusRef, { online: true, lastChanged: serverTimestamp() });
    onDisconnect(myStatusRef).remove();

    // Listen for total online users
    const unsubscribeStatus = onValue(onlineUsersRef, (snapshot) => {
      setOnlineCount(snapshot.numChildren());
    });

    return () => unsubscribeStatus();
  }, [user]);

  // 2. Fetch Messages
  useEffect(() => {
    const chatRef = ref(db, "generalChat");
    const unsubscribeMessages = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messageList);
      }
    });

    return () => unsubscribeMessages();
  }, []);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const chatRef = ref(db, "generalChat");
    await push(chatRef, {
      text: newMessage,
      senderId: user.uid,
      senderName: user.email.split('@')[0], // Simplified name
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">General Discussion</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
            <FaCircle className="text-green-500 animate-pulse" size={8} />
            <span>{onlineCount} people online</span>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                isMe 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-none"
              }`}>
                {!isMe && <p className="text-[10px] font-bold opacity-70 mb-1">{msg.senderName}</p>}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500 transition-all"
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <MdSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default GeneralChat;