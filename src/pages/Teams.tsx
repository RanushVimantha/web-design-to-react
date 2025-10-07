import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Teams</h1>
          <p className="text-muted-foreground text-lg">
            Meet the elite competitors representing Ascendium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.id} to={`/teams/${team.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {team.banner_url && (
                  <div className="h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={team.banner_url}
                      alt={team.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {team.logo_url && (
                      <img
                        src={team.logo_url}
                        alt={`${team.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <CardTitle>{team.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {team.game}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {team.description || "Join us as we compete at the highest level"}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No teams yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
