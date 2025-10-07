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
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link to="/teams">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Button>
        </Link>

        {team.banner_url && (
          <div className="h-64 mb-8 overflow-hidden rounded-lg">
            <img src={team.banner_url} alt={team.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mb-8 flex items-center gap-6">
          {team.logo_url && (
            <img src={team.logo_url} alt={`${team.name} logo`} className="w-24 h-24 rounded-lg" />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
            <Badge variant="secondary" className="text-lg">
              {team.game}
            </Badge>
          </div>
        </div>

        {team.description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{team.description}</p>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">Roster</h2>
          {players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <Link key={player.id} to={`/players/${player.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {player.avatar_url ? (
                          <img
                            src={player.avatar_url}
                            alt={player.gamertag}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-2xl">{player.gamertag[0]}</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg">{player.gamertag}</h3>
                          {player.real_name && (
                            <p className="text-sm text-muted-foreground">{player.real_name}</p>
                          )}
                          {player.role_in_team && (
                            <Badge variant="outline" className="mt-1">
                              {player.role_in_team}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No players on this team yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
