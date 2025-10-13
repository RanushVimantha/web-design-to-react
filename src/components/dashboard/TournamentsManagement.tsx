import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { z } from "zod";

const tournamentSchema = z.object({
  name: z.string().trim().min(1, "Tournament name is required").max(100, "Name too long"),
  game: z.string().trim().min(1, "Game is required").max(50, "Game name too long"),
  description: z.string().trim().max(3000, "Description too long").optional(),
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
  start_date: z.string().trim().min(1, "Start date is required"),
  end_date: z.string().trim().optional(),
  prize_pool: z.string().trim().refine(
    (val) => !val || val === "" || (!isNaN(Number(val)) && Number(val) >= 0),
    "Prize pool must be a positive number"
  ).optional(),
  status: z.enum(["upcoming", "ongoing", "completed"]),
});

interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  prize_pool: number | null;
  banner_url: string | null;
  created_at: string;
}

const GAMES = ["League of Legends", "Dota 2", "Valorant", "CS:GO", "Overwatch", "Rocket League"];
const STATUSES = ["upcoming", "ongoing", "completed"];

const TournamentsManagement = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
    prize_pool: "",
    banner_url: "",
  });

  const fetchTournaments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      toast.error("Failed to fetch tournaments");
      console.error(error);
    } else {
      setTournaments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const openDialog = (tournament?: Tournament) => {
    if (tournament) {
      setEditingTournament(tournament);
      setFormData({
        name: tournament.name,
        game: tournament.game,
        description: tournament.description || "",
        start_date: tournament.start_date.split('T')[0],
        end_date: tournament.end_date ? tournament.end_date.split('T')[0] : "",
        status: tournament.status || "upcoming",
        prize_pool: tournament.prize_pool?.toString() || "",
        banner_url: tournament.banner_url || "",
      });
    } else {
      setEditingTournament(null);
      setFormData({
        name: "",
        game: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "upcoming",
        prize_pool: "",
        banner_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      game: formData.game,
      description: formData.description || null,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      status: formData.status,
      prize_pool: formData.prize_pool ? parseFloat(formData.prize_pool) : null,
      banner_url: formData.banner_url || null,
    };

    if (editingTournament) {
      const { error } = await supabase
        .from("tournaments")
        .update(payload)
        .eq("id", editingTournament.id);

      if (error) {
        toast.error("Failed to update tournament");
      } else {
        toast.success("Tournament updated successfully");
        setIsDialogOpen(false);
        fetchTournaments();
      }
    } else {
      const { error } = await supabase
        .from("tournaments")
        .insert([payload]);

      if (error) {
        toast.error("Failed to create tournament");
      } else {
        toast.success("Tournament created successfully");
        setIsDialogOpen(false);
        fetchTournaments();
      }
    }
  };

  const deleteTournament = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;

    const { error } = await supabase
      .from("tournaments")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete tournament");
    } else {
      toast.success("Tournament deleted");
      fetchTournaments();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "ongoing": return "bg-green-500/20 text-green-500 border-green-500/50";
      case "completed": return "bg-muted text-muted-foreground border-muted";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="glass-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Tournaments Management</CardTitle>
            <CardDescription>Create and manage esports tournaments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchTournaments} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tournament
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tournaments yet. Create your first tournament!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((tournament) => (
                  <TableRow key={tournament.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium">{tournament.name}</TableCell>
                    <TableCell>{tournament.game}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tournament.status)} variant="outline">
                        {tournament.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tournament.prize_pool 
                        ? `$${tournament.prize_pool.toLocaleString()}` 
                        : "-"}
                    </TableCell>
                    <TableCell>{new Date(tournament.start_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(tournament)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTournament(tournament.id)}
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
          <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTournament ? "Edit Tournament" : "Create New Tournament"}</DialogTitle>
                <DialogDescription>
                  {editingTournament ? "Update tournament information" : "Add a new tournament"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tournament Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Summer Championship 2025"
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
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                  <Input
                    id="prize_pool"
                    type="number"
                    value={formData.prize_pool}
                    onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the tournament..."
                    rows={3}
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
                  {editingTournament ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TournamentsManagement;
