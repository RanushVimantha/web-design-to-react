const TournamentSchedule = () => {
  const tournaments = [
    {
      name: "Ascendium Open",
      game: "Valorant",
      date: "July 15, 2024",
      prizePool: "$10,000",
      status: "open"
    },
    {
      name: "League Championship",
      game: "League of Legends", 
      date: "August 5, 2024",
      prizePool: "$20,000",
      status: "open"
    },
    {
      name: "Dota 2 Invitational",
      game: "Dota 2",
      date: "September 1, 2024",
      prizePool: "$15,000",
      status: "upcoming"
    }
  ];

  return (
    <section className="py-24 px-10 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-center mb-16 font-orbitron">
          Battle <span className="text-shadow-red text-red-500">Schedule</span>
        </h2>
        
        <div className="overflow-hidden rounded-lg border border-white/10 backdrop-blur-sm bg-white/5">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-5 text-white text-sm font-bold uppercase tracking-widest">Tournament</th>
                <th className="px-6 py-5 text-white text-sm font-bold uppercase tracking-widest">Game</th>
                <th className="px-6 py-5 text-white text-sm font-bold uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-white text-sm font-bold uppercase tracking-widest">Prize Pool</th>
                <th className="px-6 py-5 text-white text-sm font-bold uppercase tracking-widest text-center">Registration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tournaments.map((tournament, index) => (
                <tr key={index} className="group hover:bg-red-500/10 transition-colors duration-300">
                  <td className="px-6 py-6 whitespace-nowrap text-white text-lg font-medium">
                    {tournament.name}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-gray-300 text-base">
                    {tournament.game}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-gray-300 text-base">
                    {tournament.date}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-cyan-400 text-base font-semibold">
                    {tournament.prizePool}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-center">
                    {tournament.status === 'open' ? (
                      <button className="font-bold text-red-400 border border-red-400 rounded-full px-4 py-1 text-sm transition-all duration-300 group-hover:bg-red-400 group-hover:text-black">
                        Register Now
                      </button>
                    ) : (
                      <span className="font-semibold text-yellow-400 text-sm">Upcoming</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TournamentSchedule;