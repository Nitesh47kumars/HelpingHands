import { useNavigate } from "react-router-dom";
import { getDatabase, ref, update, push, serverTimestamp, get } from "firebase/database";
import { useFirebase } from "../../context/firebaseContext";
import {
  MdLocationOn,
  MdMessage,
  MdAttachMoney,
  MdCheckCircle,
} from "react-icons/md";

const db = getDatabase();

const HelpCard = ({ request }) => {
  const navigate = useNavigate();
  const { user } = useFirebase();

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";

    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
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

  const getRoomId = (uid1, uid2) =>
    uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

  const handleOfferHelp = async () => {
    if (!user) return;

    try {
      const requestRef = ref(db, `helpRequests/${request.id}`);
      const snapshot = await get(requestRef);
      const currentData = snapshot.val();

      const helpers = currentData?.helpers || [];
      
      const alreadyOffered = helpers.some(h => h.helperId === user.uid);
      
      if (alreadyOffered) {
        navigate("/chats", {
          state: {
            recipient: { uid: request.userId, fullName: request.userName },
          },
        });
        return;
      }

      const newHelper = {
        helperId: user.uid,
        helperName: user.email?.split("@")[0] || "Helper",
        offeredAt: Date.now(),
        status: "pending"
      };

      helpers.push(newHelper);

      await update(requestRef, {
        helpers: helpers,
        lastHelperAt: Date.now()
      });

      const roomId = getRoomId(user.uid, request.userId);
      const chatRef = ref(db, `chats/${roomId}`);
      
      const predefinedMessage = `Hi! I saw your help request "${request.title}" and I'm interested in helping you out. Let me know if you'd like to discuss the details! 😊`;
      
      await push(chatRef, {
        text: predefinedMessage,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        cardData: {
          title: request.title,
          location: request.location,
          category: request.category,
          requirements: request.requirements || [],
          minPrice: request.minPrice,
          maxPrice: request.maxPrice,
        },
      });

      // Navigate to chat
      navigate("/chats", {
        state: {
          recipient: { uid: request.userId, fullName: request.userName },
        },
      });
    } catch (error) {
      console.error("Error offering help:", error);
      alert("Failed to offer help. Please try again.");
    }
  };

  const userHasOffered = request.helpers?.some(h => h.helperId === user?.uid);
  const acceptedHelper = request.helpers?.find(h => h.status === "accepted");
  const isAccepted = acceptedHelper?.helperId === user?.uid;

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group flex flex-col h-full shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
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
        {request.helpers && request.helpers.length > 0 && (
          <>
            <span>•</span>
            <span className="text-blue-400 font-medium">
              {request.helpers.length} {request.helpers.length === 1 ? "offer" : "offers"}
            </span>
          </>
        )}
      </div>

      <div className="p-4 rounded-xl border border-white/5 grow mb-2 text-sm text-zinc-300 leading-relaxed line-clamp-4">
        {request.description}
      </div>

      <div className="space-y-3 mb-3">
        {request.requirements && request.requirements.length > 0 && (
          <div className="p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">
              <MdCheckCircle className="text-emerald-400" size={14} />
              Requirements
            </div>
            <div className="flex flex-wrap gap-2">
              {request.requirements.map((req, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-white/5 px-3 py-2 rounded-lg text-xs text-zinc-300 flex items-start gap-2"
                >
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span className="flex-1">{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 uppercase font-bold ml-1">
            Budget
          </span>
          <div className="flex items-center text-emerald-400 font-bold">
            <MdAttachMoney size={18} className="-ml-1" />
            <span className="text-lg">{`${request.minPrice} - ${request.maxPrice}`}</span>
          </div>
        </div>

        <button
          onClick={handleOfferHelp}
          disabled={acceptedHelper && !isAccepted}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdMessage size={14} />
          {acceptedHelper && !isAccepted
            ? "Helper Selected"
            : isAccepted
            ? "You're Helping!"
            : userHasOffered
            ? "Message Sent"
            : "Offer Help"}
        </button>
      </div>
    </div>
  );
};

export { HelpCard };