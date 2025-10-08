import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Team {
  id: string;
  name: string;
  game: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

interface Player {
  id: string;
  gamertag: string;
  real_name: string | null;
  role_in_team: string | null;
  avatar_url: string | null;
}

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      const [teamResult, playersResult] = await Promise.all([
        supabase.from("teams").select("*").eq("id", id).single(),
        supabase.from("players").select("*").eq("team_id", id),
      ]);

      if (!teamResult.error && teamResult.data) {
        setTeam(teamResult.data);
      }

      if (!playersResult.error && playersResult.data) {
        setPlayers(playersResult.data);
      }

      setLoading(false);
    };

    fetchTeamAndPlayers();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Team not found</h2>
          <Link to="/teams">
            <Button>Back to Teams</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-radial pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <Link to="/teams">
          <Button variant="ghost" className="mb-6 text-white hover:text-red-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h1 className="relative mb-2 text-6xl font-black tracking-tighter text-white md:text-8xl uppercase">
            Team <span className="text-red-500 drop-shadow-[0_0_10px_rgb(234,42,51)]">{team.name}</span>
          </h1>
          <p className="max-w-2xl text-lg font-light text-gray-400">
            {team.description || `Meet the members of Team ${team.name}`}
          </p>
        </div>

        {/* Team Roster */}
        <section className="mb-24">
          <h2 className="mb-10 text-center text-4xl font-bold tracking-tight text-white">
            Team Roster
          </h2>

          {players.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player) => (
                <Link key={player.id} to={`/players/${player.id}`}>
                  <div className="player-card group relative rounded-xl overflow-hidden bg-gray-900/50 border-2 border-gray-800 hover:border-red-500 transition-all duration-300 cursor-pointer">
                    <div className="relative h-64 overflow-hidden">
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.gamertag}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-cyan-400/20 flex items-center justify-center">
                          <span className="text-7xl text-white font-bold">{player.gamertag[0]}</span>
                        </div>
                      )}
                      <div className="overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                        <h3 className="player-name text-2xl font-bold text-white mb-1">{player.gamertag}</h3>
                        {player.role_in_team && (
                          <p className="player-role text-sm text-cyan-400 font-medium uppercase tracking-wider">
                            {player.role_in_team}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg">No players on this team yet.</p>
          )}
        </section>
      </div>

      <style>{`
        .bg-gradient-radial {
          background-image: radial-gradient(circle at top, rgba(234, 42, 51, 0.2), transparent 40%);
        }
        .player-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .player-card:hover {
          transform: scale(1.05);
        }
        .player-card .overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 2rem 1rem 1rem;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .player-card:hover .overlay {
          transform: translateY(0);
        }
        .player-card .player-name {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s, opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s;
        }
        .player-card:hover .player-name {
          transform: translateY(0);
          opacity: 1;
        }
        .player-card .player-role {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s, opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s;
        }
        .player-card:hover .player-role {
          transform: translateY(0);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default TeamDetail;
