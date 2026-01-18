import React from "react";
import {
  MdDeleteOutline,
  MdCheckCircleOutline,
  MdPendingActions,
  MdLocationOn,
  MdPerson,
} from "react-icons/md";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-900/30 text-amber-400",
    completed: "bg-green-900/30 text-green-400",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
        styles[status] || styles.pending
      }`}
    >
      {status || "pending"}
    </span>
  );
};

const ActionButton = ({ icon, label, onClick, color, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-colors rounded-lg hover:bg-zinc-800 ${color} disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {icon} <span>{label}</span>
  </button>
);

const RequestManager = ({ requests = [], onStatusUpdate, onDelete }) => {
  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-bold text-white">
          My Posted Help Requests
        </h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {requests?.length > 0 ? (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-6 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-zinc-100">{req.title}</h4>
                    <StatusBadge status={req.status || "pending"} />
                  </div>
                  <p className="text-sm text-zinc-400 flex items-center gap-1">
                    <MdLocationOn size={14} /> {req.location || "No location"} •{" "}
                    {req.category}
                  </p>
                  {req.helperName && (
                    <p className="text-sm text-emerald-400 flex items-center gap-1">
                      <MdPerson size={14} /> Helper: {req.helperName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton
                    icon={<MdPendingActions size={18} />}
                    label="Pending"
                    onClick={() => onStatusUpdate(req.id, "pending")}
                    color="hover:text-amber-500"
                    disabled={req.status === "pending"}
                  />
                  <ActionButton
                    icon={<MdCheckCircleOutline size={18} />}
                    label="Complete"
                    onClick={() => {
                      if (req.helperId) {
                        onStatusUpdate(req.id, "completed");
                      } else {
                        alert(
                          "No helper assigned yet. Wait for someone to offer help first."
                        );
                      }
                    }}
                    color="hover:text-green-500"
                    disabled={req.status === "completed" || !req.helperId}
                  />
                  <div className="w-px h-6 bg-zinc-700 mx-1" />
                  <ActionButton
                    icon={<MdDeleteOutline size={18} />}
                    label="Delete"
                    onClick={() => onDelete(req.id)}
                    color="hover:text-red-500"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-zinc-500">
            You haven't posted any help requests yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestManager;