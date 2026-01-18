import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdMessage, MdOutlineAssignment, MdAttachMoney } from 'react-icons/md';

const HelpCard = ({ request }) => {
  const navigate = useNavigate();

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (isNaN(seconds)) return "Just now";
  
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ago";
    return "Just now";
  };

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group flex flex-col h-full shadow-xl relative overflow-hidden">
      
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight pr-4">
          {request.title}
        </h3>
        <span className="shrink-0 text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md border border-white/5">
          {formatTimeAgo(request.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-5">
        <span className="text-zinc-300 font-medium">{request.userName}</span>
        <span>•</span>
        <div className="flex items-center gap-1">
          <MdLocationOn className="text-blue-500" />
          {request.location}
        </div>
      </div>

      <div className="grow mb-6 text-sm text-zinc-300 leading-relaxed line-clamp-4">
        {request.description}
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-zinc-800/30 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
            <MdOutlineAssignment className="text-blue-400" size={14} />
            Requirements
          </div>
          <p className="text-xs text-zinc-300">
            {request.category}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 uppercase font-bold ml-1">Budget</span>
          <div className="flex items-center text-emerald-400 font-bold">
            <MdAttachMoney size={18} className="-ml-1" />
            <span className="text-lg">{`${request.minPrice} - ${request.maxPrice}`}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate("/private", { state: { recipient: { uid: request.userId, fullName: request.userName } } })}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/40"
        >
          <MdMessage size={14} />
          Offer Help
        </button>
      </div>
    </div>
  );
};

export { HelpCard };