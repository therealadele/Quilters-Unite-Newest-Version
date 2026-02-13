import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { XCircle } from "lucide-react";
import { SEO } from "@/components/seo";

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Subscription Cancelled" description="Your subscription checkout was cancelled." path="/subscription/cancel" noindex />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
            <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold">Subscription Cancelled</h1>
              <p className="text-muted-foreground">
                You can still subscribe anytime to unlock all features.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/subscription">Back to Pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
