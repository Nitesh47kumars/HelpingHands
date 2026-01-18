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
      className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex gap-2"
    >
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Type a message to ${placeholderName}...`}
        className="flex-1 bg-zinc-800 text-white px-4 py-2.5 rounded-xl border border-zinc-700 outline-none focus:ring-2 ring-blue-500/50 transition-all"
      />
      <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform active:scale-90">
        <MdSend size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
