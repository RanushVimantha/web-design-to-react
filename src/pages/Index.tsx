import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Partners from '@/components/Partners';
import Rosters from '@/components/Rosters';
import TournamentSchedule from '@/components/TournamentSchedule';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-black text-white font-space-grotesk">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Advantages />
        <Partners />
        <Rosters />
        <TournamentSchedule />
      </main>
      <Footer />
    </div>
  );
};

export default Index;