import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trophy, Users, Calendar } from "lucide-react";
import esportsArena from "@/assets/esports-arena.jpg";

interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  prize_pool: number | null;
  status: string | null;
  banner_url: string | null;
  tournament_type: string | null;
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [gameFilter, setGameFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: false });

    if (!error && data) {
      setTournaments(data);
    }
    setLoading(false);
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tournament.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || tournament.status === statusFilter.toLowerCase();
    const matchesGame = gameFilter === "ALL" || tournament.game === gameFilter;
    return matchesSearch && matchesStatus && matchesGame;
  });

  const games = Array.from(new Set(tournaments.map(t => t.game)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Hero Section with Background Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${esportsArena})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-cyan-500/10" />
        
        {/* Animated overlay effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-20 px-4">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-red-500" />
            <span className="text-red-500 uppercase tracking-[0.3em] text-sm font-semibold">Competitive Gaming</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white uppercase tracking-widest text-center font-orbitron">
            Tournaments
          </h1>
          <p className="mt-4 text-white/70 text-lg text-center max-w-2xl">
            Battlegrounds of the elite. Prove your skills and claim glory in our competitive events.
          </p>
          
          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{tournaments.length}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{games.length}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$50K+</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Prize Pools</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-10">
        <main className="flex-1 px-4 sm:px-6 lg:px-16 py-10">
          <div className="max-w-7xl mx-auto">

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  placeholder="SEARCH EVENTS"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="STATUS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="upcoming">UPCOMING</SelectItem>
                  <SelectItem value="ongoing">ONGOING</SelectItem>
                  <SelectItem value="completed">COMPLETED</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder="GAMES" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {games.map(game => (
                    <SelectItem key={game} value={game}>{game}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tournament Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="tournament-card relative rounded-2xl group transition-all duration-500 cursor-pointer"
                  onClick={() => navigate(`/tournaments/${tournament.id}`)}
                >
                  <div className="tournament-card-inner relative overflow-hidden flex flex-col">
                    {/* Tournament Banner */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                      style={{
                        backgroundImage: tournament.banner_url 
                          ? `url(${tournament.banner_url})` 
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(6, 182, 212, 0.5))'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="relative flex flex-col justify-end p-6 h-96 mt-auto">
                      <Badge className="absolute top-6 right-6 bg-red-500/80 text-white border-none">
                        {tournament.status?.toUpperCase() || 'UPCOMING'}
                      </Badge>
                      
                      <h3 className="text-3xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-red-500 font-orbitron">
                        {tournament.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-2">{tournament.game}</p>
                      {tournament.prize_pool && (
                        <p className="text-cyan-400 font-bold text-lg mb-4">
                          ${tournament.prize_pool.toLocaleString()} Prize Pool
                        </p>
                      )}
                      
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                        <button className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30">
                          View Tournament
                        </button>
                        <button className="flex-1 py-2.5 px-4 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-105">
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/60 text-xl">No tournaments found matching your criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .tournament-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: conic-gradient(from 180deg at 50% 50%, rgb(6, 182, 212) 0deg, rgb(239, 68, 68) 180deg, rgb(6, 182, 212) 360deg);
          z-index: 0;
          opacity: 0;
          transition: opacity 500ms;
          border-radius: 1rem;
        }
        .tournament-card:hover::before {
          opacity: 1;
        }
        .tournament-card-inner {
          position: relative;
          z-index: 1;
          background-color: #111;
          border-radius: 0.875rem;
          height: calc(100% - 4px);
          width: calc(100% - 4px);
          margin: 2px;
        }
      `}</style>
    </div>
  );
};

export default Tournaments;
