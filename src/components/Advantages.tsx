import trainingFacility from '@/assets/training-facility.jpg';
import globalStage from '@/assets/global-stage.jpg';
import careerGrowth from '@/assets/career-growth.jpg';

const Advantages = () => {
  const advantages = [
    {
      title: "Pro-Tier Training",
      description: "Hone your skills with elite coaching, data-driven analysis, and state-of-the-art facilities.",
      image: trainingFacility,
      hoverColor: "red"
    },
    {
      title: "Global Stage",
      description: "Compete in premier international tournaments and make your mark on the world of esports.",
      image: globalStage,
      hoverColor: "cyan"
    },
    {
      title: "Career Growth",
      description: "We invest in our players' futures, providing brand-building and professional development support.",
      image: careerGrowth,
      hoverColor: "red"
    }
  ];

  return (
    <section className="py-24 px-10 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-red-900/30 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-cyan-900/30 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-6 text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight font-orbitron">
            The <span className="text-shadow-red text-red-500">Ascendium</span> Advantage
          </h2>
          <p className="text-white/70 text-xl font-normal leading-normal max-w-3xl mx-auto">
            We are more than a team. We are a crucible for talent, a community of champions, and a force in the esports world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className={`group relative flex flex-col gap-6 rounded-lg glass-card p-8 transition-all duration-300 hover:border-${advantage.hoverColor}-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${advantage.hoverColor}-500/10`}
            >
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-${advantage.hoverColor}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} />
              <div className="relative z-10">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md mb-6 clip-path-polygon"
                  style={{ backgroundImage: `url(${advantage.image})` }}
                />
                <h3 className="text-white text-2xl font-bold leading-normal mb-2 font-orbitron">
                  {advantage.title}
                </h3>
                <p className="text-gray-400 text-base font-normal leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;