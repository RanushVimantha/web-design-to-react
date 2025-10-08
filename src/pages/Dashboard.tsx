const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Welcome to your dashboard! This section is under development.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-xl bg-gray-900/50 border border-red-500/30 hover:border-red-500 transition-all duration-300">
            <h3 className="text-2xl font-bold text-red-500 mb-2">Recruitment</h3>
            <p className="text-gray-400">Manage applications</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/50 border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300">
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">Users</h3>
            <p className="text-gray-400">View registered users</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/50 border border-red-500/30 hover:border-red-500 transition-all duration-300">
            <h3 className="text-2xl font-bold text-red-500 mb-2">Teams</h3>
            <p className="text-gray-400">Manage teams</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
