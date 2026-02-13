import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { SEO } from "@/components/seo";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <SEO title="Sign In" description="Sign in to your Quilters Unite account to access your projects, patterns, and community." path="/login" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <Grid3X3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">Quilters Unite</span>
          </Link>
          <div>
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(error || loginError) && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error || loginError?.message}
              </div>
            )}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
