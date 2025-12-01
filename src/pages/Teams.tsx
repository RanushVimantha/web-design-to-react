import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import teamsHero from "@/assets/teams-hero.jpg";

interface Team {
  id: string;
  name: string;
  game: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");

      if (!error && data) {
        setTeams(data);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${teamsHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-cyan-500/10" />
        
        {/* Animated effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-20 px-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-red-500" />
            <span className="text-red-500 uppercase tracking-[0.3em] text-sm font-semibold">Elite Squads</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white uppercase tracking-widest text-center font-orbitron">
            Our Teams
          </h1>
          <p className="mt-4 text-white/70 text-lg text-center max-w-2xl">
            Explore the diverse teams within Ascendium E-Sports, each with its unique identity and competitive focus.
          </p>
          
          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{teams.length}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">5+</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">Players</div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <Link key={team.id} to={`/teams/${team.id}`}>
                <div className={`team-card group relative overflow-hidden rounded-lg border-2 border-transparent transition-all duration-500 ${index % 2 === 0 ? 'team-card-red' : 'team-card-blue'}`}>
                  <div className="card-content p-6 h-full">
                    {team.banner_url ? (
                      <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
                        <img
                          src={team.banner_url}
                          alt={team.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 mb-6 rounded-lg bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center">
                        {team.logo_url && (
                          <img
                            src={team.logo_url}
                            alt={`${team.name} logo`}
                            className="w-24 h-24 object-contain"
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-4">
                      {team.logo_url && !team.banner_url && (
                        <img
                          src={team.logo_url}
                          alt={`${team.name} logo`}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                          {team.game}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {team.description || "Join us as we compete at the highest level"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No teams yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .team-card {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          transition: all 0.5s ease-in-out;
          border: 2px solid transparent;
        }
        .team-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--tw-gradient-stops));
          z-index: 1;
          transition: opacity 0.5s ease-in-out;
          opacity: 0;
        }
        .team-card:hover:before {
          opacity: 1;
        }
        .team-card-red {
          --tw-gradient-from: #ef4444;
          --tw-gradient-to: #3b82f6;
        }
        .team-card-blue {
          --tw-gradient-from: #3b82f6;
          --tw-gradient-to: #ef4444;
        }
        .team-card .card-content {
          position: relative;
          z-index: 2;
          background-color: #0a0a0a;
          margin: 2px;
          height: calc(100% - 4px);
          width: calc(100% - 4px);
          transition: transform 0.5s ease-in-out;
        }
        .team-card:hover .card-content {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default Teams;
