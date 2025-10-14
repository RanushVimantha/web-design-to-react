import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100, "Name too long"),
  game: z.string().trim().min(1, "Game is required").max(50, "Game name too long"),
  description: z.string().trim().max(2000, "Description too long").optional(),
  logo_url: z.string().trim().max(500, "URL too long").optional().refine(
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
  banner_url: z.string().trim().max(500, "URL too long").optional().refine(
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
});

interface Team {
  id: string;
  name: string;
  game: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
}

const GAMES = ["League of Legends", "Dota 2", "Valorant", "CS:GO", "Overwatch", "Rocket League"];

const TeamsManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    logo_url: "",
    banner_url: "",
  });

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch teams");
      console.error(error);
    } else {
      setTeams(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openDialog = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        game: team.game,
        description: team.description || "",
        logo_url: team.logo_url || "",
        banner_url: team.banner_url || "",
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: "",
        game: "",
        description: "",
        logo_url: "",
        banner_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = teamSchema.parse(formData);

      const payload = {
        name: validated.name,
        game: validated.game,
        description: validated.description || null,
        logo_url: validated.logo_url || null,
        banner_url: validated.banner_url || null,
      };

      if (editingTeam) {
        const { error } = await supabase
          .from("teams")
          .update(payload)
          .eq("id", editingTeam.id);

        if (error) throw error;
        toast.success("Team updated successfully");
      } else {
        const { error } = await supabase
          .from("teams")
          .insert([payload]);

        if (error) throw error;
        toast.success("Team created successfully");
      }
      
      setIsDialogOpen(false);
      fetchTeams();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Operation failed");
      }
    }
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete team");
    } else {
      toast.success("Team deleted");
      fetchTeams();
    }
  };

  return (
    <Card className="glass-card border-border animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Teams Management</CardTitle>
            <CardDescription>Create and manage your esports teams</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchTeams} variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:rotate-180">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => openDialog()} className="transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No teams yet. Create your first team!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id} className="border-border hover:bg-muted/50 transition-colors duration-200">
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.game}</TableCell>
                    <TableCell className="max-w-xs truncate">{team.description}</TableCell>
                    <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(team)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTeam ? "Edit Team" : "Create New Team"}</DialogTitle>
                <DialogDescription>
                  {editingTeam ? "Update team information" : "Add a new team to your organization"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Ascendium Legends"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="game">Game *</Label>
                  <select
                    id="game"
                    value={formData.game}
                    onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a game</option>
                    {GAMES.map((game) => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the team..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
                maxLength={500}
              />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner_url">Banner URL</Label>
              <Input
                id="banner_url"
                value={formData.banner_url}
                onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                placeholder="https://example.com/banner.png"
                maxLength={500}
              />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTeam ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TeamsManagement;
