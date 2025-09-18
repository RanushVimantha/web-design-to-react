
const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center" 
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuADifCpm__CGim2fgvSGn2JTTWUlmQHRubjhNHMBRvBVINI-TxMMKaZ-5TQCSmdMHiSXfPC22IltNsTA1b3G7wJ2AfW_5D72hPr6eW2DdYC2EF4R9PSUzXLt6raE9Rv7qPymiB6UqGavf65gvUSfPc3YfJ564448pOeRbLkugm__l2o_50dusaFIhzVLD0k5uc9o24ALiaboYikaP1lv_tIc8ro6p2FRQjZBxuF2oXhQ8QGmKV0aGQaKJCYApP-qIwaQJo4IrraOlU")`,
            filter: 'blur(4px) brightness(0.7)'
          }}
        />
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-aurora bg-gradient-to-br from-red-500/50 via-transparent to-cyan-400/50" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4 animate-levitate">
        <h1 className="text-white text-7xl md:text-9xl font-black uppercase tracking-wider font-orbitron" style={{textShadow: '0 0 15px rgba(255, 82, 82, 0.8), 0 0 25px rgba(255, 82, 82, 0.6)'}}>
          Ascendium
        </h1>
        <p className="text-white/80 text-xl font-normal leading-normal max-w-3xl md:text-2xl tracking-wide">
          Forging Legends in the Digital Arena. Join the Ascent.
        </p>
        <div className="flex flex-wrap gap-6 justify-center mt-6">
          <button className="group relative flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-16 px-8 bg-transparent text-white text-lg font-bold leading-normal tracking-widest uppercase border-2 border-red-500 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.red.500)]">
            <span className="absolute inset-0 bg-red-500 transition-all duration-300 ease-out transform -translate-x-full group-hover:translate-x-0"></span>
            <span className="relative z-10">Join Us</span>
          </button>
          <button className="group relative flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-16 px-8 bg-transparent text-white text-lg font-bold leading-normal tracking-widest uppercase border-2 border-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.cyan.400)]">
            <span className="absolute inset-0 bg-cyan-400 transition-all duration-300 ease-out transform translate-x-full group-hover:translate-x-0"></span>
            <span className="relative z-10">View Teams</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;