import React from "react";
import { MdEmojiEvents, MdAssignment } from "react-icons/md";

const StatBox = ({ label, value, icon, gradient }) => (
  <div
    className={`px-6 py-4 rounded-xl min-w-32 ${
      gradient ? gradient : "bg-zinc-800"
    }`}
  >
    <p className="text-3xl font-bold text-white mb-2 text-center">{value}</p>
    <div className="flex items-center justify-center gap-2">
      {icon && <div className="text-xl">{icon}</div>}
      <p className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
        {label}
      </p>
    </div>
  </div>
);
const Header = ({ profile, requestCount }) => {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={
              profile?.avatarURL ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30 p-1 bg-zinc-800"
          />
          <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-yellow-500 to-orange-500 rounded-full p-2 border-4 border-zinc-900">
            <MdEmojiEvents className="text-white" size={20} />
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">
            {profile?.fullName}
          </h2>
          <p className="text-zinc-400 font-medium text-sm">{profile?.email}</p>
          <p className="text-xs text-zinc-500 mt-1">
            Member since {new Date(profile?.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-4">
          <StatBox
            label="Requests"
            value={requestCount}
            icon={<MdAssignment className="text-blue-400" />}
            gradient="bg-linear-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/20"
          />

          <StatBox
            label="Karma"
            value={profile?.karma || 0}
            icon={<MdEmojiEvents className="text-yellow-400" />}
            gradient="bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-amber-900/30 border border-yellow-500/30"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
