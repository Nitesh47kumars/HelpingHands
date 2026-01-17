import React, { useState } from 'react';
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { useFirebase } from "../../context/firebaseContext";
import { MdOutlineAddCircle, MdOutlineCategory, MdMyLocation } from 'react-icons/md';

const db = getDatabase();

const UserOwnHelpCard = () => {
  const { user } = useFirebase();
  const [formData, setFormData] = useState({ title: "", category: "Other", location: "", description: "" });
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!formData.title || !user) return alert("Please add a title");

    setIsPosting(true);
    try {
      const requestsRef = ref(db, "helpRequests");
      await push(requestsRef, {
        ...formData,
        userId: user.uid,
        userName: user.email.split('@')[0], // Use fullName if available in your user profile state
        createdAt: serverTimestamp(),
      });
      setFormData({ title: "", category: "Other", location: "", description: "" });
      alert("Request posted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handlePost} className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
          <MdOutlineAddCircle size={28} />
        </div>
        <div>
          <h2 className="text-lg font-bold dark:text-white">Need a Hand?</h2>
          <p className="text-sm text-zinc-500">Post a request and your community will reach out.</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <input 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="What do you need help with?"
          className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 ring-blue-500 dark:text-white outline-none"
        />
        <textarea 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe your situation..."
          className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 ring-blue-500 dark:text-white outline-none min-h-25"
        />
        <div className="flex gap-2">
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-zinc-500 outline-none"
          >
            <option value="Technical">Technical</option>
            <option value="Education">Education</option>
            <option value="Physical">Physical</option>
            <option value="Other">Other</option>
          </select>
          <input 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Location"
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 outline-none dark:text-white"
          />
        </div>
        <button 
          disabled={isPosting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
        >
          {isPosting ? "Posting..." : "Post Request"}
        </button>
      </div>
    </form>
  );
};

export {UserOwnHelpCard}