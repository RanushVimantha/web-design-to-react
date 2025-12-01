import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Mail, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50, "Name too long"),
  tag: z.string().trim().min(2, "Tag must be at least 2 characters").max(10, "Tag too long"),
  game: z.string().min(1, "Game is required"),
  description: z.string().trim().max(500, "Description too long").optional().or(z.literal("")),
  logo_url: z.string().trim().max(500, "URL too long").optional().or(z.literal("")),
});

const inviteEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long").toLowerCase(),
});

interface Team {
  id: string;
  name: string;
  tag: string;
  game: string;
  description: string | null;
  logo_url: string | null;
  is_verified: boolean;
  created_at: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  is_verified: boolean;
  profiles: { full_name: string; is_verified: boolean };
}

const MyTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    game: "",
    description: "",
    logo_url: "",
  });

  const GAMES = ["Valorant", "League of Legends", "Dota 2", "CS:GO", "Apex Legends", "Overwatch"];

  useEffect(() => {
    fetchTeams();
  }, [user]);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("teams_competitive")
      .select("*")
      .eq("captain_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTeams(data);
      if (data.length > 0 && !selectedTeam) {
        setSelectedTeam(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchTeamMembers = async (teamId: string) => {
    const { data, error } = await supabase
      .from("team_members")
      .select(`
        id,
        user_id,
        role,
        is_verified,
        profiles!inner(full_name, is_verified)
      `)
      .eq("team_id", teamId);

    if (!error && data) {
      setMembers(data as any);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const validated = teamSchema.parse(formData);

      const teamData = {
        name: validated.name,
        tag: validated.tag,
        game: validated.game,
        description: validated.description || null,
        logo_url: validated.logo_url || null,
        captain_id: user?.id,
      };

      const { data, error } = await supabase
        .from("teams_competitive")
        .insert([teamData])
        .select()
        .single();

      if (error) throw error;

      // Add captain as member
      await supabase.from("team_members").insert({
        team_id: data.id,
        user_id: user?.id,
        role: "captain",
        is_verified: true, // Captain auto-verified
      });

      toast({ title: "Success", description: "Team created successfully!" });
      setShowCreateDialog(false);
      setFormData({ name: "", tag: "", game: "", description: "", logo_url: "" });
      fetchTeams();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleInviteMember = async () => {
    if (!selectedTeam || !inviteEmail) return;

    try {
      const validated = inviteEmailSchema.parse({ email: inviteEmail });
      
      // Check for existing pending invitation
      const { data: existing } = await supabase
        .from("team_invitations")
        .select("id")
        .eq("team_id", selectedTeam.id)
        .eq("invited_user_email", validated.email)
        .eq("status", "pending")
        .maybeSingle();

      if (existing) {
        toast({ title: "Error", description: "Invitation already sent to this email", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from("team_invitations")
        .insert({
          team_id: selectedTeam.id,
          invited_by: user?.id,
          invited_user_email: validated.email,
        });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Invitation sent!" });
        setShowInviteDialog(false);
        setInviteEmail("");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Member removed" });
      if (selectedTeam) fetchTeamMembers(selectedTeam.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-64 -left-64 w-[40rem] h-[40rem] bg-red-500/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute -bottom-64 -right-64 w-[40rem] h-[40rem] bg-cyan-400/20 rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]"></div>
      </div>

      <div className="relative z-10 pt-24 pb-10 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white font-orbitron">My Teams</h1>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">Create Team</Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Create a competitive team for tournaments</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Team Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div>
                    <Label>Team Tag</Label>
                    <Input
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="e.g., ASC"
                    />
                  </div>
                  <div>
                    <Label>Game</Label>
                    <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select game" />
                      </SelectTrigger>
                      <SelectContent>
                        {GAMES.map(game => (
                          <SelectItem key={game} value={game}>{game}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Team description"
                    />
                  </div>
                  <Button onClick={handleCreateTeam} className="w-full bg-red-500 hover:bg-red-600">
                    Create Team
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {teams.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-white/40" />
                <p className="text-white/60 mb-4">You don't have any teams yet</p>
                <Button onClick={() => setShowCreateDialog(true)} className="bg-red-500 hover:bg-red-600">
                  Create Your First Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team List */}
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className={`cursor-pointer transition-all ${
                      selectedTeam?.id === team.id
                        ? "bg-red-500/20 border-red-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-white">[{team.tag}] {team.name}</span>
                        {team.is_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-white/60">{team.game}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Team Details */}
              {selectedTeam && (
                <div className="lg:col-span-2">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-2xl font-orbitron">
                            [{selectedTeam.tag}] {selectedTeam.name}
                          </CardTitle>
                          <CardDescription className="text-white/60 mt-2">
                            {selectedTeam.description || "No description"}
                          </CardDescription>
                        </div>
                        <Badge className={selectedTeam.is_verified ? "bg-green-500" : "bg-yellow-500"}>
                          {selectedTeam.is_verified ? "VERIFIED" : "UNVERIFIED"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Members Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Team Members
                          </h3>
                          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-cyan-400 hover:bg-cyan-500 text-black">
                                <Mail className="h-4 w-4 mr-2" />
                                Invite
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card">
                              <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>Enter the email of the user you want to invite</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Input
                                  type="email"
                                  placeholder="user@example.com"
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                />
                                <Button onClick={handleInviteMember} className="w-full bg-cyan-400 hover:bg-cyan-500 text-black">
                                  Send Invitation
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-2">
                          {members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                            >
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-white font-semibold">{member.profiles.full_name}</p>
                                </div>
                                {member.role === "captain" && (
                                  <Badge className="bg-red-500 text-white">Captain</Badge>
                                )}
                                {member.profiles.is_verified ? (
                                  <Badge className="bg-green-500 text-white">Verified</Badge>
                                ) : (
                                  <Badge className="bg-yellow-500 text-black">Unverified</Badge>
                                )}
                              </div>
                              {member.role !== "captain" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {!selectedTeam.is_verified && (
                        <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                          <p className="text-yellow-200 text-sm">
                            <Shield className="h-4 w-4 inline mr-2" />
                            All team members must be verified for the team to be marked as verified.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeams;
