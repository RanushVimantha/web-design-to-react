import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, MessageSquare, Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters")
});

const RATE_LIMIT_KEY = 'last_contact_submission';
const RATE_LIMIT_MS = 60000; // 1 minute

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Email Us</CardTitle>
              <CardDescription>
                Send us an email and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>General Inquiries</CardTitle>
              <CardDescription>
                Questions about partnerships, sponsorships, or media requests
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
