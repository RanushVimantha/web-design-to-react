import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Twitter, Twitch, Youtube, Instagram, Trophy } from "lucide-react";

interface Player {
  id: string;
  gamertag: string;
  real_name: string | null;
  bio: string | null;
  role_in_team: string | null;
  avatar_url: string | null;
  achievements: any;
  gaming_setup: any;
  social_links: any;
  team_id: string | null;
}

interface Team {
  id: string;
  name: string;
  game: string;
}

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerAndTeam = async () => {
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();

      if (!playerError && playerData) {
        setPlayer(playerData);

        if (playerData.team_id) {
          const { data: teamData } = await supabase
            .from("teams")
            .select("*")
            .eq("id", playerData.team_id)
            .single();

          if (teamData) setTeam(teamData);
        }
      }

      setLoading(false);
    };

    fetchPlayerAndTeam();
  }, [id]);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "twitch":
        return <Twitch className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Player not found</h2>
          <Link to="/teams">
            <Button>Back to Teams</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <Link to={team ? `/teams/${team.id}` : "/teams"}>
          <Button variant="ghost" className="mb-6 text-white hover:text-red-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {team ? team.name : "Teams"}
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-8 border-2 border-red-500/30 bg-gradient-to-br from-red-950/20 to-cyan-950/20 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {player.avatar_url ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-cyan-400 blur-xl opacity-50"></div>
                <img
                  src={player.avatar_url}
                  alt={player.gamertag}
                  className="relative w-48 h-48 rounded-full object-cover border-4 border-white/10"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500/20 to-cyan-400/20 flex items-center justify-center border-4 border-white/10">
                <span className="text-7xl text-white font-bold">{player.gamertag[0]}</span>
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                {player.gamertag}
              </h1>
              {player.real_name && (
                <p className="text-2xl text-gray-300 mb-4">{player.real_name}</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                {player.role_in_team && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50 px-4 py-1">
                    {player.role_in_team}
                  </Badge>
                )}
                {team && (
                  <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/50 px-4 py-1">
                    {team.game}
                  </Badge>
                )}
              </div>
              {player.bio && (
                <p className="text-gray-400 text-lg max-w-2xl">{player.bio}</p>
              )}

              {player.social_links && Object.keys(player.social_links).length > 0 && (
                <div className="mt-6 flex gap-3 justify-center md:justify-start">
                  {Object.entries(player.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 group"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          {player.achievements && Array.isArray(player.achievements) && player.achievements.length > 0 && (
            <div className="rounded-xl bg-gray-900/50 backdrop-blur-sm p-8 border border-red-500/30 animate-pulse">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="h-8 w-8 text-red-500" />
                Achievements
              </h2>
              <div className="space-y-4">
                {player.achievements.map((achievement: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-black/30 border border-white/5 hover:border-red-500/30 transition-all"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0 animate-pulse"></div>
                    <span className="text-gray-300">
                      {typeof achievement === 'string' ? achievement : achievement.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaming Setup */}
          {player.gaming_setup && Object.keys(player.gaming_setup).length > 0 && (
            <div className="rounded-xl bg-gray-900/50 backdrop-blur-sm p-8 border border-cyan-400/30 animate-pulse [animation-delay:0.5s]">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Gaming Setup
              </h2>
              <div className="space-y-4">
                {Object.entries(player.gaming_setup).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex gap-4 p-4 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-400/30 transition-all"
                  >
                    <dt className="font-bold capitalize text-cyan-400 min-w-[120px]">
                      {key.replace(/_/g, " ")}:
                    </dt>
                    <dd className="text-gray-300 flex-1">{value as string}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
