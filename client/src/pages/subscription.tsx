import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Check, Crown, AlertTriangle, Sparkles } from "lucide-react";
import { SEO, JsonLd } from "@/components/seo";

interface PriceRow {
  product_id: string;
  product_name: string;
  product_description: string;
  price_id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string; interval_count: number } | null;
}

const features = [
  "Save projects",
  "Manage queue",
  "Post in forums",
  "Save favorites",
  "Access pattern library",
];

export default function SubscriptionPage() {
  const { user, isAuthenticated, hasActiveSubscription } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: prices, isLoading: pricesLoading } = useQuery<PriceRow[]>({
    queryKey: ["/api/stripe/prices"],
  });

  const isTrialActive =
    user?.subscriptionStatus === "trial" &&
    user?.trialEndsAt &&
    new Date(user.trialEndsAt) > new Date();

  const isTrialExpired =
    user?.subscriptionStatus === "trial" &&
    user?.trialEndsAt &&
    new Date(user.trialEndsAt) <= new Date();

  const isSubscribed = user?.subscriptionStatus === "active";

  const trialEndsDate = user?.trialEndsAt
    ? new Date(user.trialEndsAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId);
    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout-session", { priceId });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    } finally {
      setLoadingPriceId(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await apiRequest("POST", "/api/stripe/customer-portal");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open customer portal:", error);
    }
  };

  const monthlyPrice = prices?.find(
    (p) => p.recurring && p.recurring.interval === "month"
  );
  const yearlyPrice = prices?.find(
    (p) => p.recurring && p.recurring.interval === "year"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Subscription Plans" description="Choose your Quilters Unite plan. Start with a 14-day free trial, then $4.99/month or $49.99/year for full access." path="/subscription" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does Quilters Unite cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Quilters Unite offers a Monthly plan at $4.99/month and a Yearly plan at $49.99/year (save 17%). Both plans include a 14-day free trial."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a free trial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Every new account includes a 14-day free trial with full access to all features including creating projects, adding favorites, managing your queue, and participating in forums."
            }
          },
          {
            "@type": "Question",
            "name": "What can I do without a subscription?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can always browse patterns, blocks, and community projects for free. A subscription is needed to create projects, save favorites, manage your queue, and post in forums."
            }
          },
          {
            "@type": "Question",
            "name": "Can I cancel my subscription?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can cancel your subscription at any time through your account settings. You'll continue to have access until the end of your current billing period."
            }
          }
        ]
      }} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-3">Choose Your Plan</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Unlock all features and take your quilting journey to the next level.
            </p>
          </div>

          {isAuthenticated && isTrialExpired && !isSubscribed && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-destructive font-medium">
                    Your free trial has ended. Subscribe to continue using all features.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {isAuthenticated && isTrialActive && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="flex items-center gap-3 p-4">
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    Your free trial ends on {trialEndsDate}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {isAuthenticated && isSubscribed && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-semibold text-lg">
                        You're subscribed!
                      </p>
                      <p className="text-green-700/80 dark:text-green-300/80 text-sm">
                        You have full access to all features.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleManageSubscription}>
                    Manage Subscription
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {!isSubscribed && (
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card className="relative overflow-hidden">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">Monthly</CardTitle>
                  <CardDescription>Perfect to get started</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div>
                    <span className="text-4xl font-bold">
                      ${monthlyPrice ? (monthlyPrice.unit_amount / 100).toFixed(2) : "4.99"}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>

                  <ul className="space-y-3 text-left">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!isAuthenticated || !monthlyPrice || loadingPriceId !== null}
                    onClick={() => monthlyPrice && handleSubscribe(monthlyPrice.price_id)}
                  >
                    {loadingPriceId === monthlyPrice?.price_id ? "Redirecting..." : "Subscribe"}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground">
                      <Link href="/register" className="underline">Create an account</Link> to subscribe
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-primary">
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg px-3 py-1 text-xs font-semibold">
                    Save 17%
                  </Badge>
                </div>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">Yearly</CardTitle>
                  <CardDescription>Best value</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div>
                    <span className="text-4xl font-bold">
                      ${yearlyPrice ? (yearlyPrice.unit_amount / 100).toFixed(2) : "49.99"}
                    </span>
                    <span className="text-muted-foreground">/yr</span>
                  </div>

                  <ul className="space-y-3 text-left">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!isAuthenticated || !yearlyPrice || loadingPriceId !== null}
                    onClick={() => yearlyPrice && handleSubscribe(yearlyPrice.price_id)}
                  >
                    {loadingPriceId === yearlyPrice?.price_id ? "Redirecting..." : "Subscribe"}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground">
                      <Link href="/register" className="underline">Create an account</Link> to subscribe
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
