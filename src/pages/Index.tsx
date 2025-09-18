// src/pages/Index.tsx

import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import Partners from "@/components/Partners";
import Rosters from "@/components/Rosters";
import TournamentSchedule from "@/components/TournamentSchedule";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Hero />
      <Advantages />
      <Partners />
      <Rosters />
      <TournamentSchedule />
      <Footer />
    </>
  );
};

export default Index;
