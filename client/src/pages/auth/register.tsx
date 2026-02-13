import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { SEO } from "@/components/seo";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register, isRegistering, registerError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("quilter");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({ email, password, firstName, status });
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <SEO title="Create Account" description="Join Quilters Unite and start your 14-day free trial. Discover patterns, share projects, and connect with quilters." path="/register" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <Grid3X3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">Quilters Unite</span>
          </Link>
          <div>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Start your 14-day free trial today</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(error || registerError) && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error || registerError?.message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">
                <div className="flex items-start space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="quilter" id="quilter" className="mt-0.5" />
                  <div className="space-y-1">
                    <Label htmlFor="quilter" className="font-medium cursor-pointer">Quilter</Label>
                    <p className="text-sm text-muted-foreground">I love making quilts and exploring patterns</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="designer" id="designer" className="mt-0.5" />
                  <div className="space-y-1">
                    <Label htmlFor="designer" className="font-medium cursor-pointer">Designer</Label>
                    <p className="text-sm text-muted-foreground">I design and sell quilt patterns</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
