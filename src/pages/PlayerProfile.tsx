import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Twitter, Twitch, Youtube, Instagram } from "lucide-react";

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
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to={team ? `/teams/${team.id}` : "/teams"}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {team ? team.name : "Teams"}
          </Button>
        </Link>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {player.avatar_url ? (
                <img
                  src={player.avatar_url}
                  alt={player.gamertag}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-5xl">{player.gamertag[0]}</span>
                </div>
              )}

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{player.gamertag}</h1>
                {player.real_name && (
                  <p className="text-xl text-muted-foreground mb-3">{player.real_name}</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {player.role_in_team && <Badge variant="secondary">{player.role_in_team}</Badge>}
                  {team && <Badge>{team.game}</Badge>}
                </div>
                {player.bio && <p className="text-muted-foreground">{player.bio}</p>}
              </div>
            </div>

            {player.social_links && Object.keys(player.social_links).length > 0 && (
              <div className="mt-6 flex gap-3 justify-center md:justify-start">
                {Object.entries(player.social_links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {getSocialIcon(platform)}
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {player.achievements && Array.isArray(player.achievements) && player.achievements.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {player.achievements.map((achievement: any, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{typeof achievement === 'string' ? achievement : achievement.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {player.gaming_setup && Object.keys(player.gaming_setup).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Gaming Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                {Object.entries(player.gaming_setup).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="font-medium capitalize">{key.replace(/_/g, " ")}:</dt>
                    <dd className="text-muted-foreground">{value as string}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
