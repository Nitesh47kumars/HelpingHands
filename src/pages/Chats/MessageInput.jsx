import React, { useState } from "react";
import { MdSend } from "react-icons/md";

const MessageInput = ({ onSend, placeholderName }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-4 bg-zinc-900/80 border-t border-zinc-800 flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Message ${placeholderName}...`}
        className="flex-1 bg-zinc-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-zinc-700 outline-none focus:ring-2 ring-blue-500/50 transition-all text-sm placeholder:text-zinc-500 placeholder:text-xs sm:placeholder:text-sm"
      />
      <button 
        type="submit"
        className="p-2.5 sm:p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform active:scale-90 shrink-0"
      >
        <MdSend size={18} className="sm:w-5 sm:h-5" />
      </button>
    </form>
  );
};

export default MessageInput;