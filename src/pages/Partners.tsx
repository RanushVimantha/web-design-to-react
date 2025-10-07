import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  partner_type: string | null;
}

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("name");

      if (!error && data) {
        setPartners(data);
      }
      setLoading(false);
    };

    fetchPartners();
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
          <p className="text-muted-foreground text-lg">
            Proud to work with industry-leading brands
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {partner.logo_url && (
                  <div className="h-32 flex items-center justify-center mb-4 bg-muted rounded-lg p-4">
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <CardTitle className="flex items-center justify-between">
                  {partner.name}
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </CardTitle>
                {partner.partner_type && (
                  <Badge variant="secondary" className="w-fit">
                    {partner.partner_type}
                  </Badge>
                )}
              </CardHeader>
              {partner.description && (
                <CardContent>
                  <CardDescription>{partner.description}</CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No partners yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners;
