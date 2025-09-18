import valorantTeam from '@/assets/valorant-team.jpg';
import lolTeam from '@/assets/lol-team.jpg';
import dota2Team from '@/assets/dota2-team.jpg';

const Rosters = () => {
  const rosters = [
    {
      game: "Valorant",
      description: "Precision, Strategy, and Unrelenting Domination.",
      image: valorantTeam
    },
    {
      game: "League of Legends",
      description: "Masters of the Rift, rewriting the meta.",
      image: lolTeam
    },
    {
      game: "Dota 2",
      description: "Unpredictable strategies, undeniable results.",
      image: dota2Team
    }
  ];

  return (
    <section className="py-24 px-10 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-center mb-16 font-orbitron">
          Our <span className="text-shadow-cyan text-cyan-400">Rosters</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rosters.map((roster, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg">
              <div 
                className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${roster.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="relative p-8 flex flex-col justify-end h-96">
                <h3 className="text-white text-3xl font-bold leading-tight transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 font-orbitron">
                  {roster.game}
                </h3>
                <p className="text-gray-400 text-base font-normal leading-normal mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {roster.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rosters;