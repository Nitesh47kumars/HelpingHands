import React, { useState } from "react";
import {
  MdDeleteOutline,
  MdCheckCircleOutline,
  MdLocationOn,
  MdPerson,
  MdCheck,
  MdClose,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-900/30 text-amber-400",
    "in-progress": "bg-blue-900/30 text-blue-400",
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

const HelperItem = ({ helper, onAccept, onDecline, isAccepted }) => (
  <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
    <div className="flex items-center gap-2">
      <MdPerson size={16} className="text-blue-400" />
      <span className="text-sm text-zinc-300 font-medium">
        {helper.helperName}
      </span>
      {isAccepted && (
        <span className="text-xs font-bold text-green-400 flex items-center gap-1">
          <MdCheck size={12} />
          Accepted
        </span>
      )}
    </div>

    {helper.status === "pending" && (
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-all"
        >
          <MdCheck size={14} />
          Accept
        </button>
        <button
          onClick={onDecline}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all"
        >
          <MdClose size={14} />
          Decline
        </button>
      </div>
    )}
  </div>
);

const RequestManager = ({
  requests = [],
  onStatusUpdate,
  onDelete,
  onAcceptHelper,
  onDeclineHelper,
}) => {
  const [expandedRequests, setExpandedRequests] = useState({});

  const toggleExpanded = (requestId) => {
    setExpandedRequests((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-bold text-white">
          My Posted Help Requests
        </h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {requests?.length > 0 ? (
          requests.map((req) => {
            const helpers = req.helpers || [];
            const acceptedHelper = helpers.find((h) => h.status === "accepted");
            const pendingHelpers = helpers.filter(
              (h) => h.status === "pending"
            );
            const isExpanded = expandedRequests[req.id];

            return (
              <div
                key={req.id}
                className="p-6 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-zinc-100">{req.title}</h4>
                      <StatusBadge status={req.status || "pending"} />
                      {helpers.length > 0 && (
                        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                          {helpers.length}{" "}
                          {helpers.length === 1 ? "offer" : "offers"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 flex items-center gap-1">
                      <MdLocationOn size={14} /> {req.location || "No location"}
                      {req.requirements && ` • ${req.requirements}`}
                    </p>

                    {helpers.length > 0 && (
                      <div className="mt-3">
                        {acceptedHelper && (
                          <div className="mb-2">
                            <HelperItem
                              helper={acceptedHelper}
                              isAccepted={true}
                            />
                          </div>
                        )}

                        {pendingHelpers.length > 0 && (
                          <div>
                            <button
                              onClick={() => toggleExpanded(req.id)}
                              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-300 transition-colors mb-2"
                            >
                              <span>
                                {pendingHelpers.length} pending{" "}
                                {pendingHelpers.length === 1
                                  ? "offer"
                                  : "offers"}
                              </span>
                              {isExpanded ? (
                                <MdExpandLess size={16} />
                              ) : (
                                <MdExpandMore size={16} />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="space-y-2">
                                {pendingHelpers.map((helper, index) => (
                                  <HelperItem
                                    key={index}
                                    helper={helper}
                                    onAccept={() =>
                                      onAcceptHelper(req.id, helper.helperId)
                                    }
                                    onDecline={() =>
                                      onDeclineHelper(req.id, helper.helperId)
                                    }
                                    isAccepted={false}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <ActionButton
                      icon={<MdCheckCircleOutline size={18} />}
                      label="Complete"
                      onClick={() => {
                        if (acceptedHelper) {
                          onStatusUpdate(req.id, "completed");
                        } else {
                          alert(
                            "Please accept a helper first before completing."
                          );
                        }
                      }}
                      color="hover:text-green-500"
                      disabled={
                        req.status === "completed" || !acceptedHelper
                      }
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
            );
          })
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