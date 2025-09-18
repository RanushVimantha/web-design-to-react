
const Advantages = () => {
  const advantages = [
    {
      title: "Pro-Tier Training",
      description: "Hone your skills with elite coaching, data-driven analysis, and state-of-the-art facilities.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0ndaFsw_HQox1d-u0eObcWbX-e8U5Aeu3Z8A6fsOVB7-IC5IlngAsPu9_ENN0qmNjpe1hWgYt94fg0UhWsbSQQmn8DRKEzeChuaKUIxLn_AiKD1VuTDGK-34BH0PfPpf-0sNrVGTZww2SRVFM-1dY3eULUABm5_TyeQjqsdJd6E-KG7XQZ0jXgwSKWHfH55n7YaMYU69Z2BVTt2wrSLFDZ7AzR8U2t8OL0sZT8riqcJ1pXgQIlAOpuWBpySNYC-2N10wef714jOs",
      hoverColor: "red"
    },
    {
      title: "Global Stage",
      description: "Compete in premier international tournaments and make your mark on the world of esports.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTT5v0NDxSmvep0nIhAlukmlUYMYV749d5e7n4WVMG5kT4h8CFtLLiG8DDUNphbAY9kYNBODvj6ypQBBaPuXFPoqrC1l0rjMK5EUwi4OsJ_QmLbetXmbpjKJz3Um-9HcmRbWaEPQVcp9ObSHsE8cODVrBh_NxhD3YPjYYCwZex6KhYJaikVm2PQb9Z3hG0rSQE3GsNV9FlpoTS2dyV_ZFzHhenKGJqxaYyJ_rQOP_pLdgbIAocNY2IAfz2dZKJXOKxJf_4q_XYCA4",
      hoverColor: "cyan"
    },
    {
      title: "Career Growth",
      description: "We invest in our players' futures, providing brand-building and professional development support.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8HBpWd3Iewks2aPdmfP-UlZFnFimjthN3uq9hwrvnfNsqio9bWcfgFpx6HRdnHMi_EbatCgaouYFBgFQ0RTEadBTYycDfKpnaLIXMcndzmI14Uz8kRFZHJ-5283DFvcMWp0gIQxH2gGHcLC9SF1oC2kuEJfcvxQ7LrnEcMcKaudQ93FDJOhKvgRGBjma8qXuzSXQ_k062yLGmsZ5V3qcynxT3p0Q6Ntqtjs50uNBiRxqgzsCE39AS6_giLG2Q21RNDRUXIyWk4pE",
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
              className={`group relative flex flex-col gap-6 rounded-lg bg-white/5 p-8 border border-white/10 transition-all duration-300 hover:border-${advantage.hoverColor === 'red' ? 'red' : 'cyan-400'}-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${advantage.hoverColor === 'red' ? 'red' : 'cyan-400'}-500/10`}
            >
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-${advantage.hoverColor === 'red' ? 'red' : 'cyan-400'}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} />
              <div className="relative z-10">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md mb-6"
                  style={{ 
                    backgroundImage: `url(${advantage.image})`,
                    clipPath: 'polygon(0 0, 100% 0, 100% 90%, 85% 100%, 0 100%, 0% 50%)'
                  }}
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