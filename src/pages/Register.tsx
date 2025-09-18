import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send data to your registration API
    console.log("Registering:", { name, email, password });
    // navigate("/dashboard") on success, for example
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <Card className="w-full max-w-md bg-neutral-900 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-neutral-800 text-white focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-neutral-800 text-white focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-neutral-800 text-white focus-visible:ring-0"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              Register
            </Button>
            <p className="text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 hover:underline focus:outline-none"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
