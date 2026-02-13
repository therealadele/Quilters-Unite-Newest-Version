import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckCircle } from "lucide-react";
import { SEO } from "@/components/seo";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Subscription Confirmed" description="Your subscription is active. Welcome to Quilters Unite!" path="/subscription/success" noindex />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold">Subscription Activated!</h1>
              <p className="text-muted-foreground">
                You now have full access to all features. Happy quilting!
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/notebook">Go to Notebook</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
