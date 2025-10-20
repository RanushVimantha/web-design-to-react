import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, RefreshCw, Users, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  tournament_id: string;
  user_id: string | null;
  team_id: string | null;
  registration_type: string;
  status: string;
  created_at: string;
  tournaments: { name: string; game: string };
  profiles?: { full_name: string; email: string };
  teams_competitive?: { name: string; tag: string };
}

const TournamentRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tournament_registrations")
      .select(`
        *,
        tournaments(name, game),
        profiles(full_name, email),
        teams_competitive(name, tag)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRegistrations(data as any);
    } else if (error) {
      if (import.meta.env.DEV) {
        console.error("Fetch registrations error:", error);
      }
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("tournament_registrations")
      .update({ status })
      .eq("id", id);

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Update registration error:", error);
      }
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Registration ${status}` });
      fetchRegistrations();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "withdrawn":
        return <Badge className="bg-gray-500 text-white">Withdrawn</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
    }
  };

  const filteredRegistrations = registrations.filter(
    reg => statusFilter === "all" || reg.status === statusFilter
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tournament Registrations</CardTitle>
            <CardDescription>Manage tournament registration requests</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchRegistrations} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tournament</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{reg.tournaments.name}</p>
                    <p className="text-sm text-muted-foreground">{reg.tournaments.game}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {reg.registration_type === "solo" ? (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{reg.profiles?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{reg.profiles?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <p className="font-medium">[{reg.teams_competitive?.tag}] {reg.teams_competitive?.name}</p>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{reg.registration_type.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(reg.status)}</TableCell>
                <TableCell>{format(new Date(reg.created_at), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  {reg.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => updateStatus(reg.id, "approved")}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(reg.id, "rejected")}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No registrations found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentRegistrations;
