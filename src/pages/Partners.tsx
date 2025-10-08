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
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-400 drop-shadow-[0_0_8px_rgba(234,42,51,0.5)]">
            Our Partners & Sponsors
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            We are proud to collaborate with industry leaders and innovators who share our passion for esports and community.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8 relative inline-block text-white">
            <span className="relative z-10">Premium Partners</span>
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-red-500"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.filter(p => p.partner_type === 'premium').map((partner) => (
              <div
                key={partner.id}
                className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-radial opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                {partner.logo_url && (
                  <div className="w-full h-48 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${partner.logo_url})` }}></div>
                )}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{partner.description || "Official partner"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8 relative inline-block text-white">
            <span className="relative z-10">Official Sponsors</span>
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-cyan-400"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.filter(p => p.partner_type === 'sponsor').map((partner) => (
              <div
                key={partner.id}
                className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/20 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-radial opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                {partner.logo_url && (
                  <div className="w-full h-48 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${partner.logo_url})` }}></div>
                )}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{partner.description || "Official sponsor"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-8 relative inline-block text-white">
            <span className="relative z-10">Community Supporters</span>
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-red-500"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.filter(p => !p.partner_type || p.partner_type === 'community').map((partner) => (
              <div
                key={partner.id}
                className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-radial opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                {partner.logo_url && (
                  <div className="w-full h-48 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${partner.logo_url})` }}></div>
                )}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{partner.description || "Community supporter"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No partners yet. Check back soon!</p>
          </div>
        )}
      </div>

      <style>{`
        .bg-gradient-radial {
          background-image: radial-gradient(circle at top left, rgba(234, 42, 51, 0.3) 0%, transparent 30%), radial-gradient(circle at bottom right, rgba(0, 178, 255, 0.3) 0%, transparent 30%);
        }
      `}</style>
    </div>
  );
};

export default Partners;
