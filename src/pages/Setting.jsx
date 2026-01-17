
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };


        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20"
          >
            Sign Out
          </button>
        </div>