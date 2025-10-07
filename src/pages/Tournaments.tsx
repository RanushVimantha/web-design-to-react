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
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tournaments</h1>
          <p className="text-muted-foreground text-lg">
            Follow our journey through competitive gaming
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {tournament.banner_url && (
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img
                      src={tournament.banner_url}
                      alt={tournament.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="md:flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl mb-2">{tournament.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{tournament.game}</Badge>
                          <Badge variant={getStatusColor(tournament.status)}>
                            {tournament.status || "upcoming"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tournament.description && (
                      <CardDescription className="mb-4">{tournament.description}</CardDescription>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(tournament.start_date), "MMM dd, yyyy")}
                          {tournament.end_date &&
                            ` - ${format(new Date(tournament.end_date), "MMM dd, yyyy")}`}
                        </span>
                      </div>
                      {tournament.prize_pool && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>Prize Pool: ${tournament.prize_pool.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">No tournaments yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
