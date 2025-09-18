import { ArrowRight } from 'lucide-react';

const Partners = () => {
  // Mock partner logos - in a real app these would be actual partner images
  const partners = [
    { name: "Partner 1", logo: "https://via.placeholder.com/150x80/333/fff?text=PARTNER+1" },
    { name: "Partner 2", logo: "https://via.placeholder.com/150x80/333/fff?text=PARTNER+2" },
    { name: "Partner 3", logo: "https://via.placeholder.com/150x80/333/fff?text=PARTNER+3" },
    { name: "Partner 4", logo: "https://via.placeholder.com/150x80/333/fff?text=PARTNER+4" },
    { name: "Partner 5", logo: "https://via.placeholder.com/150x80/333/fff?text=PARTNER+5" }
  ];

  return (
    <section className="py-24 px-10 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2/3 w-[50vw] h-[50vw] bg-red-500/10 rounded-full blur-3xl -z-10 animate-aurora" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2/3 w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-aurora" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-6 text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight font-orbitron">
            Partners & <span className="text-shadow-cyan text-cyan-400">Sponsors</span>
          </h2>
          <p className="text-white/70 text-xl font-normal leading-normal max-w-3xl mx-auto">
            Fueling our ascent with the best in the industry. We are proud to be allied with leaders who share our vision.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="partner-logo-container relative flex items-center justify-center h-40 glass-bg rounded-lg p-6 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <img 
                alt={`${partner.name} Logo`}
                className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                src={partner.logo}
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="btn-gaming-cyan flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center rounded-md h-16 px-8 text-lg font-bold leading-normal tracking-widest uppercase mx-auto">
            <span className="flex items-center gap-2">
              View All Partners <ArrowRight />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partners;