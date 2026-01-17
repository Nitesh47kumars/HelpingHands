import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdMessage } from 'react-icons/md';

const HelpCard = ({ request }) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    // Navigate to private chat and pass the target user info
    navigate("/private", { state: { recipient: { uid: request.userId, fullName: request.userName } } });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {request.userName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-zinc-800 dark:text-zinc-100">{request.userName}</h4>
            <div className="flex items-center text-xs text-zinc-500 gap-1">
              <MdLocationOn /> {request.location}
            </div>
          </div>
        </div>
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold rounded-full">
          {request.category}
        </span>
      </div>
      <div className="mb-4">
        <h3 className="font-bold dark:text-white">{request.title}</h3>
        <p className="text-sm text-zinc-500 line-clamp-2">{request.description}</p>
      </div>
      <button 
        onClick={handleStartChat}
        className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-100 dark:bg-zinc-800 dark:text-white rounded-xl hover:bg-blue-600 hover:text-white transition-all"
      >
        <MdMessage /> Send Private Message
      </button>
    </div>
  );
};

export {HelpCard}