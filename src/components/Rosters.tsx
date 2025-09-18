
const Rosters = () => {
  const rosters = [
    {
      game: "Valorant",
      description: "Precision, Strategy, and Unrelenting Domination.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALeeWoWxdDJD2qoBvnPfTFNw5idvWcFy-81defjK8evhwzrQ3Fup9iq4q28vSGGzb-wU9q0Zke2HcL3mcTT9SWaPFvsHkpSlJPJTcMGOqiIDB1UVFjQAobFinqKvLazK3JYRwUxab0MjW1GN0tSzRRQxJGllxr9D9L1Q6YzpxwyCMX8KJwRehTier3uBzFOaVF2t86GoOFZjmsP_OFxfZtzd8qUpWdzZv6rsBLvHV87IumeKP2WhSty6i3aI8UdFy_Of8H8J0cIek"
    },
    {
      game: "League of Legends",
      description: "Masters of the Rift, rewriting the meta.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9mggNuvci-ij8dqfishuGwQKG0Q1C6Y7_f9FnLxodSURbC3yWPRXQNFZ-mi1ANJ4pZrFH6eLOEEItB_y49Xh29Z16KhLWSbIMrYFx12Chz-88s34OxTvPCrq_4QJYk7x3EZ8Tf5e_KQMqBgyIFjoHLwmYeFoSO2HUhpe1Pem1HTdmXKecPuqWLzAtzfrDng5acfNco5P0TsBaIGAYiYIMogk4pc3U7ZKzNrlHqt0lguSOVFvmS--5GO_lIw0GnERY3Xz7TOSuOXc"
    },
    {
      game: "Dota 2",
      description: "Unpredictable strategies, undeniable results.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqZ6-xagMFJeX6wWH1e3bwka5AdwxpJIZ9d4Re1k9Riqhhb1Lp4te6K7A2-ePCqEVaGUoDluiuj8ZZhpFH2dB18-spm0u1fLFth2jslaP4DGjYDhEsXZ6Gheq5KFeIN5EPzxAW8FnAe8JzV2j17tNSWzuPQjO0Zk6QDMAodbXAYv5c6b9X-3i9HzRkjn2F4LkXtwiTTXtHNqeKdfBFlvA47NkPJ5tBhlzMmNxrhWYeyTx8nRKjilSVolu6rdjqoM8sL3qGYM81cPc"
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