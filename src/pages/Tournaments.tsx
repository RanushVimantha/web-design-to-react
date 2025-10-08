import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, DollarSign } from "lucide-react";
import { format } from "date-fns";

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
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchTournaments();
  }, []);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "ongoing":
        return "default";
      case "upcoming":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="relative pt-48 pb-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)' }}>
        <div className="px-10 flex flex-col items-center text-center">
          <h1 className="text-white text-8xl font-bold leading-tight tracking-tighter max-w-4xl uppercase drop-shadow-[0_0_10px_rgb(255,0,0)]">
            Tournament Hub
          </h1>
          <p className="text-white/70 text-2xl mt-6 max-w-3xl font-light">
            Where Legends Are Forged and Champions Rise.
          </p>
        </div>
      </div>

      <div className="px-10 w-full mx-auto py-20">
        <div className="flex flex-col gap-16">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-white">
                <span className="text-cyan-400 drop-shadow-[0_0_10px_rgb(0,191,255)]">UPCOMING</span> TOURNAMENTS
              </h2>
              <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/50 px-4 py-2 text-lg">
                {tournaments.filter(t => t.status === 'upcoming').length} Events
              </Badge>
            </div>

            <div className="space-y-6">
              {tournaments.filter(t => t.status === 'upcoming').map((tournament) => (
                <div
                  key={tournament.id}
                  className="tournament-list-item group relative rounded-lg p-6 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                    {tournament.banner_url && (
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={tournament.banner_url}
                          alt={tournament.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {tournament.name}
                        </h3>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          {tournament.status || "upcoming"}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400 text-sm">{tournament.description || "Competitive tournament"}</p>
                      
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(tournament.start_date), "MMM dd, yyyy")}
                            {tournament.end_date &&
                              ` - ${format(new Date(tournament.end_date), "MMM dd, yyyy")}`}
                          </span>
                        </div>
                        
                        {tournament.prize_pool && (
                          <div className="flex items-center gap-2 text-cyan-400 font-bold">
                            <Trophy className="h-4 w-4" />
                            <span>${tournament.prize_pool.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                          {tournament.game}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tournaments.filter(t => t.status === 'completed').length > 0 && (
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">
                <span className="text-red-500 drop-shadow-[0_0_10px_rgb(255,0,0)]">PAST</span> TOURNAMENTS
              </h2>

              <div className="space-y-6">
                {tournaments.filter(t => t.status === 'completed').map((tournament) => (
                  <div
                    key={tournament.id}
                    className="tournament-list-item group relative rounded-lg p-6 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                      {tournament.banner_url && (
                        <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={tournament.banner_url}
                            alt={tournament.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-bold text-white">{tournament.name}</h3>
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">
                            Completed
                          </Badge>
                        </div>
                        
                        <p className="text-gray-400 text-sm">{tournament.description || "Past tournament"}</p>
                        
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(tournament.start_date), "MMM dd, yyyy")}
                            </span>
                          </div>
                          
                          {tournament.prize_pool && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Trophy className="h-4 w-4" />
                              <span>${tournament.prize_pool.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No tournaments yet. Check back soon!</p>
          </div>
        )}
      </div>

      <style>{`
        .tournament-list-item {
          background: linear-gradient(90deg, rgba(10, 10, 10, 0.8), #0a0a0a);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .tournament-list-item:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgb(0, 191, 255), transparent);
          transition: left 0.5s ease;
        }
        .tournament-list-item:hover:before {
          left: 100%;
        }
        .tournament-list-item:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(0, 191, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Tournaments;
