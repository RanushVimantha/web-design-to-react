import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Trophy, Users, Clock, Award } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

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
  team_size: number | null;
  max_participants: number | null;
  registration_start: string | null;
  registration_end: string | null;
}

interface Registration {
  id: string;
  status: string;
  registration_type: string;
  user_id: string | null;
  team_id: string | null;
}

interface Team {
  id: string;
  name: string;
  tag: string;
  is_verified: boolean;
}

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTournamentDetails();
    }
  }, [id, user]);

  const fetchTournamentDetails = async () => {
    // Fetch tournament
    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", id)
      .single();

    if (tournamentError || !tournamentData) {
      toast({ title: "Error", description: "Tournament not found", variant: "destructive" });
      navigate("/tournaments");
      return;
    }

    setTournament(tournamentData);

    if (user) {
      // Check user verification
      const { data: profileData } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("user_id", user.id)
        .single();

      setIsVerified(profileData?.is_verified || false);

      // Fetch user's teams
      if (tournamentData.tournament_type === "team") {
        const { data: teamsData } = await supabase
          .from("teams_competitive")
          .select("*")
          .eq("captain_id", user.id)
          .eq("game", tournamentData.game);

        setUserTeams(teamsData || []);
      }

      // Check existing registration
      const { data: regData } = await supabase
        .from("tournament_registrations")
        .select("*")
        .eq("tournament_id", id)
        .or(`user_id.eq.${user.id},team_id.in.(${userTeams.map(t => t.id).join(",")})`)
        .maybeSingle();

      setRegistration(regData);
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to register", variant: "destructive" });
      navigate("/auth");
      return;
    }

    if (!isVerified) {
      toast({ 
        title: "Verification Required", 
        description: "You must be verified to register for tournaments", 
        variant: "destructive" 
      });
      return;
    }

    if (tournament?.tournament_type === "team") {
      if (userTeams.length === 0) {
        toast({ 
          title: "No Teams", 
          description: "You need to create a verified team to register", 
          variant: "destructive" 
        });
        return;
      }
      setShowRegisterDialog(true);
    } else {
      await registerForTournament("solo", null);
    }
  };

  const registerForTournament = async (type: string, teamId: string | null) => {
    setRegistering(true);

    const registrationData: any = {
      tournament_id: id,
      registration_type: type,
      status: "pending"
    };

    if (type === "solo") {
      registrationData.user_id = user?.id;
    } else {
      registrationData.team_id = teamId;
    }

    const { error } = await supabase
      .from("tournament_registrations")
      .insert(registrationData);

    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Registration submitted successfully!" });
      setShowRegisterDialog(false);
      fetchTournamentDetails();
    }

    setRegistering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tournament) return null;

  const canRegister = !registration && tournament.status === "upcoming";
  const registrationOpen = tournament.registration_start && tournament.registration_end &&
    new Date() >= new Date(tournament.registration_start) &&
    new Date() <= new Date(tournament.registration_end);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-64 -left-64 w-[40rem] h-[40rem] bg-red-500/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute -bottom-64 -right-64 w-[40rem] h-[40rem] bg-cyan-400/20 rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]"></div>
      </div>

      <div className="relative z-10 pt-24 pb-10">
        {/* Hero Banner */}
        <div 
          className="relative h-96 bg-cover bg-center"
          style={{ 
            backgroundImage: tournament.banner_url 
              ? `url(${tournament.banner_url})` 
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(6, 182, 212, 0.5))'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-10">
            <div className="max-w-7xl mx-auto">
              <Badge className="mb-4 bg-red-500 text-white border-none text-lg px-4 py-1">
                {tournament.status?.toUpperCase() || 'UPCOMING'}
              </Badge>
              <h1 className="text-6xl font-bold text-white mb-4 font-orbitron">{tournament.name}</h1>
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(tournament.start_date), "MMM dd, yyyy")}</span>
                </div>
                {tournament.prize_pool && (
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Trophy className="h-5 w-5" />
                    <span>${tournament.prize_pool.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{tournament.tournament_type === "team" ? `Team (${tournament.team_size})` : "Solo"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/5 border-white/10">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-red-500">Overview</TabsTrigger>
                  <TabsTrigger value="rules" className="data-[state=active]:bg-red-500">Rules</TabsTrigger>
                  <TabsTrigger value="participants" className="data-[state=active]:bg-red-500">Participants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6 text-white/80">
                      <p>{tournament.description || "Competitive gaming tournament. Join and prove your skills!"}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rules" className="mt-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6 text-white/80">
                      <ul className="list-disc list-inside space-y-2">
                        <li>All participants must be verified before registration</li>
                        {tournament.tournament_type === "team" && (
                          <>
                            <li>Teams must have exactly {tournament.team_size} verified members</li>
                            <li>All team members must be verified</li>
                          </>
                        )}
                        <li>Follow the official game rules and regulations</li>
                        <li>Sportsmanship and fair play are mandatory</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="participants" className="mt-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6 text-white/80">
                      <p>Participant list will be available soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  {registration ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Registration Status</span>
                        <Badge className={
                          registration.status === "approved" ? "bg-green-500" :
                          registration.status === "rejected" ? "bg-red-500" :
                          "bg-yellow-500"
                        }>
                          {registration.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm">
                        Your registration has been submitted and is awaiting approval.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white font-orbitron">Register Now</h3>
                      {!user ? (
                        <Button onClick={() => navigate("/auth")} className="w-full bg-red-500 hover:bg-red-600">
                          Login to Register
                        </Button>
                      ) : !isVerified ? (
                        <div className="text-white/60 text-sm">
                          <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                          <p className="text-center">You must be verified to register for tournaments</p>
                        </div>
                      ) : !canRegister ? (
                        <p className="text-white/60 text-sm text-center">Registration is closed</p>
                      ) : !registrationOpen ? (
                        <p className="text-white/60 text-sm text-center">Registration not yet open</p>
                      ) : (
                        <Button onClick={handleRegister} className="w-full bg-red-500 hover:bg-red-600">
                          Register for Tournament
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tournament Info */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-cyan-400 mt-1" />
                    <div>
                      <p className="text-white/60 text-sm">Registration Period</p>
                      <p className="text-white font-semibold">
                        {tournament.registration_start 
                          ? format(new Date(tournament.registration_start), "MMM dd, yyyy")
                          : "TBA"}
                      </p>
                    </div>
                  </div>
                  {tournament.max_participants && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-white/60 text-sm">Max Participants</p>
                        <p className="text-white font-semibold">{tournament.max_participants}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Team Selection Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Select Your Team</DialogTitle>
            <DialogDescription>
              Choose a verified team to register for this tournament
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {userTeams.filter(t => t.is_verified).map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    [{team.tag}] {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => registerForTournament("team", selectedTeamId)}
              disabled={!selectedTeamId || registering}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {registering ? "Registering..." : "Confirm Registration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentDetail;
