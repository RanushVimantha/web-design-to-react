import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center" 
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: 'blur(4px) brightness(0.7)'
          }}
        />
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-aurora bg-gradient-to-br from-red-500/50 via-transparent to-cyan-400/50" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4 animate-levitate">
        <h1 className="text-white text-7xl md:text-9xl font-black uppercase tracking-wider font-orbitron text-shadow-red">
          Ascendium
        </h1>
        <p className="text-white/80 text-xl font-normal leading-normal max-w-3xl md:text-2xl tracking-wide">
          Forging Legends in the Digital Arena. Join the Ascent.
        </p>
        <div className="flex flex-wrap gap-6 justify-center mt-6">
          <button className="btn-gaming-red flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center rounded-md h-16 px-8 text-lg font-bold leading-normal tracking-widest uppercase">
            <span>Join Us</span>
          </button>
          <button className="btn-gaming-cyan flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center rounded-md h-16 px-8 text-lg font-bold leading-normal tracking-widest uppercase">
            <span>View Teams</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;