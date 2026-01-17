import React from "react";

const StatBox = ({ label, value }) => (
  <div className="px-4 py-2 bg-zinc-800 rounded-xl min-w-20">
    <p className="text-xl font-bold text-white">{value}</p>
    <p className="text-[10px] uppercase text-zinc-500 font-bold">{label}</p>
  </div>
);

const Header = ({ profile, requestCount }) => {
  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            profile?.avatarURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`
          }
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 p-1"
        />
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-white">{profile?.fullName}</h2>
          <p className="text-zinc-400 font-medium">{profile?.email}</p>
        </div>
        <div className="flex gap-4 text-center">
          <StatBox label="Requests" value={requestCount} />
          <StatBox label="Karma" value={profile?.karma || 0} />
        </div>
      </div>
    </div>
  );
};

export default Header;
