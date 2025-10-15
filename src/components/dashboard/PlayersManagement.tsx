import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { z } from "zod";

const playerSchema = z.object({
  gamertag: z.string().trim().min(1, "Gamertag is required").max(50, "Gamertag too long"),
  real_name: z.string().trim().max(100, "Name too long").optional(),
  role_in_team: z.string().trim().max(50, "Role too long").optional(),
  bio: z.string().trim().max(1000, "Bio too long").optional(),
  avatar_url: z.string().trim().max(500, "URL too long").optional().refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const url = new URL(val);
        return ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    },
    "Only HTTP/HTTPS URLs are allowed"
  ),
  achievements: z.array(z.object({
    title: z.string().trim().max(100),
    date: z.string().optional(),
    description: z.string().trim().max(500).optional()
  })).optional(),
  gaming_setup: z.object({
    mouse: z.string().trim().max(100).optional(),
    keyboard: z.string().trim().max(100).optional(),
    headset: z.string().trim().max(100).optional(),
    monitor: z.string().trim().max(100).optional()
  }).optional(),
  social_links: z.object({
    twitter: z.string().url().max(200).optional(),
    twitch: z.string().url().max(200).optional(),
    youtube: z.string().url().max(200).optional(),
    instagram: z.string().url().max(200).optional()
  }).optional().refine((val) => {
    if (!val) return true;
    return Object.values(val).every(url => {
      if (!url) return true;
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch { return false; }
    });
  }, "Only HTTP/HTTPS URLs allowed in social links")
});

interface Player {
  id: string;
  gamertag: string;
  real_name: string | null;
  role_in_team: string | null;
  bio: string | null;
  avatar_url: string | null;
  team_id: string | null;
  user_id: string | null;
}

interface Team {
  id: string;
  name: string;
  game: string;
}

const PlayersManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    gamertag: "",
    real_name: "",
    role_in_team: "",
    bio: "",
    avatar_url: "",
    team_id: "",
  });

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes] = await Promise.all([
        supabase.from("players").select("*").order("gamertag"),
        supabase.from("teams").select("id, name, game").order("name")
      ]);

      if (playersRes.error) throw playersRes.error;
      if (teamsRes.error) throw teamsRes.error;

      setPlayers(playersRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = playerSchema.parse(formData);

      const playerData = {
        gamertag: validated.gamertag,
        real_name: validated.real_name || null,
        role_in_team: validated.role_in_team || null,
        bio: validated.bio || null,
        avatar_url: validated.avatar_url || null,
        team_id: formData.team_id || null,
      };

      if (editingPlayer) {
        const { error } = await supabase
          .from("players")
          .update(playerData)
          .eq("id", editingPlayer.id);
        if (error) throw error;
        toast({ title: "Success", description: "Player updated" });
      } else {
        const { error } = await supabase
          .from("players")
          .insert([playerData]);
        if (error) throw error;
        toast({ title: "Success", description: "Player created" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const deletePlayer = async (id: string) => {
    if (!confirm("Delete this player?")) return;

    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Player deleted" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      gamertag: "",
      real_name: "",
      role_in_team: "",
      bio: "",
      avatar_url: "",
      team_id: "",
    });
    setEditingPlayer(null);
  };

  const openEditDialog = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      gamertag: player.gamertag,
      real_name: player.real_name || "",
      role_in_team: player.role_in_team || "",
      bio: player.bio || "",
      avatar_url: player.avatar_url || "",
      team_id: player.team_id || "",
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Players Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlayer ? "Edit Player" : "Add New Player"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="gamertag">Gamertag *</Label>
                <Input
                  id="gamertag"
                  value={formData.gamertag}
                  onChange={(e) => setFormData({ ...formData, gamertag: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <Label htmlFor="real_name">Real Name</Label>
                <Input
                  id="real_name"
                  value={formData.real_name}
                  onChange={(e) => setFormData({ ...formData, real_name: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="role_in_team">Role in Team</Label>
                <Input
                  id="role_in_team"
                  value={formData.role_in_team}
                  onChange={(e) => setFormData({ ...formData, role_in_team: e.target.value })}
                  maxLength={50}
                  placeholder="e.g., Mid Laner, Support, Entry Fragger"
                />
              </div>
              <div>
                <Label htmlFor="team_id">Team</Label>
                <Select value={formData.team_id} onValueChange={(val) => setFormData({ ...formData, team_id: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Team</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.game})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="avatar_url">Avatar URL (HTTP/HTTPS only)</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  maxLength={500}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  maxLength={1000}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingPlayer ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gamertag</TableHead>
              <TableHead>Real Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => {
              const team = teams.find(t => t.id === player.team_id);
              return (
                <TableRow key={player.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{player.gamertag}</TableCell>
                  <TableCell>{player.real_name || "—"}</TableCell>
                  <TableCell>{player.role_in_team || "—"}</TableCell>
                  <TableCell>{team ? `${team.name} (${team.game})` : "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(player)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deletePlayer(player.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayersManagement;
