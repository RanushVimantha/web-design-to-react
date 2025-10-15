import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Trophy, Target } from "lucide-react";
import { z } from "zod";

const recruitSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  position: z.string().min(1, "Position is required").max(100, "Position must be less than 100 characters"),
  coverLetter: z.string().trim().min(1, "Cover letter is required").max(5000, "Cover letter must be less than 5000 characters"),
  resumeUrl: z.string().trim().max(500, "URL must be less than 500 characters").optional().refine(
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
  )
});

const positions = [
  "Pro Player (Valorant)",
  "Streamer / Content Creator",
  "Team Analyst",
  "Community Moderator",
  "Coach",
  "Manager",
  "Social Media Manager",
  "Video Editor",
  "Graphic Designer",
];

const RATE_LIMIT_KEY = 'last_recruitment_submission';
const RATE_LIMIT_MS = 60000; // 1 minute

const Recruit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    position: "",
    coverLetter: "",
    resumeUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check rate limit
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmission && Date.now() - parseInt(lastSubmission) < RATE_LIMIT_MS) {
      toast.error('Please wait before submitting again');
      setIsLoading(false);
      return;
    }

    // Validate input data
    const result = recruitSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("recruitment_applications").insert({
      full_name: result.data.fullName,
      email: result.data.email,
      position: result.data.position,
      cover_letter: result.data.coverLetter,
      resume_url: result.data.resumeUrl || null,
    });

    if (error) {
      toast.error("Failed to submit application. Please try again.");
    } else {
      toast.success("Application submitted successfully! We'll review it and get back to you.");
      setFormData({ fullName: "", email: "", position: "", coverLetter: "", resumeUrl: "" });
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-red-950/10 to-cyan-950/10 pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-1/4 left-0 h-1/2 w-1/2 rounded-full bg-red-500/10 blur-[150px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 right-0 h-1/2 w-1/2 rounded-full bg-cyan-400/10 blur-[150px] animate-pulse [animation-delay:4s]"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,0,51,0.5)] mb-4">
            BECOME LEGENDARY
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-300">
            Ascendium is on the hunt for the next generation of esports talent. We're not just building a team, we're forging a legacy. If you have the drive, the skill, and the passion to compete at the highest level, your journey starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left side - Open Positions & Why Ascendium */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-black/30 p-6 backdrop-blur-md border border-red-500/30 animate-pulse">
              <h3 className="mb-4 text-3xl font-bold text-white">Open Positions</h3>
              <div className="space-y-4">
                {positions.slice(0, 4).map((position) => (
                  <div
                    key={position}
                    className="flex items-center justify-between rounded-lg bg-gray-900/50 p-4 transition-all duration-300 hover:bg-gray-800/70 hover:shadow-[0_0_15px_rgb(239,68,68)]"
                  >
                    <div>
                      <p className="font-semibold text-white">{position}</p>
                      <p className="text-sm text-gray-400">
                        {position.includes("Player") ? "Competitive Roster" : 
                         position.includes("Streamer") ? "Brand Ambassador" :
                         position.includes("Analyst") ? "Strategy & Performance" : "Discord & Socials"}
                      </p>
                    </div>
                    <button className="flex h-10 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-bold text-white transition-transform duration-300 hover:scale-105">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-red-500/80 to-cyan-400/80 p-6 text-center backdrop-blur-md">
              <Users className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold text-white mb-3">Why Ascendium?</h3>
              <p className="text-white/90">
                Join a family dedicated to excellence. We provide top-tier resources, a supportive community, and the platform to elevate your career. We don't just play games; we define them.
              </p>
            </div>
          </div>

          {/* Right side - Application Form */}
          <div className="lg:col-span-3 rounded-xl bg-black/30 p-8 backdrop-blur-md border border-cyan-400/30 animate-pulse [animation-delay:0.5s]">
            <h3 className="mb-6 text-3xl font-bold text-white text-center">Submit Your Application</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <Input
                    id="fullName"
                    placeholder=" "
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="peer w-full rounded-md border-2 border-gray-700 bg-transparent p-3 text-white placeholder-transparent transition-colors focus:border-cyan-400"
                  />
                  <Label
                    htmlFor="fullName"
                    className="absolute left-3 -top-2.5 bg-black/30 px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400"
                  >
                    Full Name
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="peer w-full rounded-md border-2 border-gray-700 bg-transparent p-3 text-white placeholder-transparent transition-colors focus:border-cyan-400"
                  />
                  <Label
                    htmlFor="email"
                    className="absolute left-3 -top-2.5 bg-black/30 px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400"
                  >
                    Email Address
                  </Label>
                </div>
              </div>

              <div className="relative">
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                  required
                >
                  <SelectTrigger className="w-full rounded-md border-2 border-gray-700 bg-transparent p-3 text-white transition-colors focus:border-cyan-400">
                    <SelectValue placeholder="Select Position..." />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    {positions.map((position) => (
                      <SelectItem key={position} value={position} className="text-white">
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label className="absolute left-3 -top-2.5 bg-black/30 px-1 text-sm text-cyan-400">
                  Position Applying For
                </Label>
              </div>

              <div className="relative">
                <Input
                  id="resumeUrl"
                  type="url"
                  placeholder=" "
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  className="peer w-full rounded-md border-2 border-gray-700 bg-transparent p-3 text-white placeholder-transparent transition-colors focus:border-cyan-400"
                />
                <Label
                  htmlFor="resumeUrl"
                  className="absolute left-3 -top-2.5 bg-black/30 px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400"
                >
                  Resume/Portfolio URL (Optional)
                </Label>
              </div>

              <div className="relative">
                <Textarea
                  id="coverLetter"
                  placeholder=" "
                  rows={8}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required
                  className="peer w-full rounded-md border-2 border-gray-700 bg-transparent p-3 text-white placeholder-transparent transition-colors focus:border-cyan-400 min-h-28"
                />
                <Label
                  htmlFor="coverLetter"
                  className="absolute left-3 -top-2.5 bg-black/30 px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400"
                >
                  Why You?
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-cyan-400 py-3 text-base font-bold text-black shadow-[0_0_20px_rgb(34,211,238)] transition-all duration-300 hover:scale-[1.02] hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgb(239,68,68)]"
              >
                {isLoading ? "Submitting..." : "Send It"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruit;
