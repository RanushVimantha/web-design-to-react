import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  verification_status: string;
  verification_date: string | null;
  created_at: string;
}

const UserVerifications = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProfiles(data);
    } else if (error) {
      if (import.meta.env.DEV) {
        console.error("Fetch profiles error:", error);
      }
    }
    setLoading(false);
  };

  const updateVerificationStatus = async (userId: string, status: string, isVerified: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        verification_status: status,
        is_verified: isVerified,
        verification_date: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Update verification error:", error);
      }
      toast({ title: "Error", description: "Failed to update verification status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `User ${status === "verified" ? "verified" : "rejected"}` });
      fetchProfiles();
    }
  };

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified) {
      return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
    }
    if (status === "rejected") {
      return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    }
    return <Badge className="bg-yellow-500 text-black"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

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
            <CardTitle>User Verifications</CardTitle>
            <CardDescription>Manage user verification requests</CardDescription>
          </div>
          <Button onClick={fetchProfiles} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.full_name}</TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{getStatusBadge(profile.verification_status, profile.is_verified)}</TableCell>
                <TableCell>{format(new Date(profile.created_at), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {!profile.is_verified && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => updateVerificationStatus(profile.user_id, "verified", true)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateVerificationStatus(profile.user_id, "rejected", false)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {profile.is_verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateVerificationStatus(profile.user_id, "pending", false)}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {profiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserVerifications;
