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
import { Plus, Edit, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { z } from "zod";

const partnerSchema = z.object({
  name: z.string().trim().min(1, "Partner name is required").max(100, "Name too long"),
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
  website_url: z.string().trim().max(500, "URL too long").optional().refine(
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
  partner_type: z.string().trim().min(1, "Partner type is required").max(50, "Type too long"),
});

interface Partner {
  id: string;
  name: string;
  partner_type: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  created_at: string;
}

const PARTNER_TYPES = ["sponsor", "media", "technology", "community"];

const PartnersManagement = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    partner_type: "sponsor",
    description: "",
    logo_url: "",
    website_url: "",
  });

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch partners");
      console.error(error);
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        partner_type: partner.partner_type || "sponsor",
        description: partner.description || "",
        logo_url: partner.logo_url || "",
        website_url: partner.website_url || "",
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: "",
        partner_type: "sponsor",
        description: "",
        logo_url: "",
        website_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = partnerSchema.parse(formData);
      
      const payload = {
        name: validatedData.name,
        partner_type: validatedData.partner_type,
        description: validatedData.description || null,
        logo_url: validatedData.logo_url || null,
        website_url: validatedData.website_url || null,
      };

      if (editingPartner) {
        const { error } = await supabase
          .from("partners")
          .update(payload)
          .eq("id", editingPartner.id);

        if (error) {
          toast.error("Failed to update partner");
        } else {
          toast.success("Partner updated successfully");
          setIsDialogOpen(false);
          fetchPartners();
        }
      } else {
        const { error } = await supabase
          .from("partners")
          .insert([payload]);

        if (error) {
          toast.error("Failed to create partner");
        } else {
          toast.success("Partner created successfully");
          setIsDialogOpen(false);
          fetchPartners();
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Validation failed");
      }
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete partner");
    } else {
      toast.success("Partner deleted");
      fetchPartners();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sponsor": return "bg-primary/20 text-primary border-primary/50";
      case "media": return "bg-accent/20 text-accent border-accent/50";
      case "technology": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "community": return "bg-green-500/20 text-green-500 border-green-500/50";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="glass-card border-border animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Partners & Sponsors</CardTitle>
            <CardDescription>Manage your organization's partners and sponsors</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchPartners} variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:rotate-180">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => openDialog()} className="transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No partners yet. Add your first partner!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id} className="border-border hover:bg-muted/50 transition-colors duration-200">
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(partner.partner_type)} variant="outline">
                        {partner.partner_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{partner.description}</TableCell>
                    <TableCell>
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(partner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePartner(partner.id)}
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
                <DialogTitle>{editingPartner ? "Edit Partner" : "Create New Partner"}</DialogTitle>
                <DialogDescription>
                  {editingPartner ? "Update partner information" : "Add a new partner or sponsor"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Partner Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Red Bull"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner_type">Partner Type *</Label>
                  <select
                    id="partner_type"
                    value={formData.partner_type}
                    onChange={(e) => setFormData({ ...formData, partner_type: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {PARTNER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the partnership..."
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
                  <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  maxLength={500}
                />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPartner ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PartnersManagement;
