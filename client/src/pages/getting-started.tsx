import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Heart,
  FolderOpen,
  Users,
  ShoppingBag,
} from "lucide-react";
import { SEO } from "@/components/seo";

const steps = [
  {
    number: 1,
    title: "Create Your Account",
    description:
      "Sign up for a Quilters Unite account to access all features. You can save patterns, track projects, and connect with other quilters.",
    icon: Users,
    href: "/getting-started/create-account",
  },
  {
    number: 2,
    title: "Explore Patterns & Blocks",
    description:
      "Browse our extensive library of quilt patterns and block designs. Filter by difficulty, style, or technique to find your next project.",
    icon: Search,
    href: "/getting-started/explore-patterns",
  },
  {
    number: 3,
    title: "Build Your Queue",
    description:
      "Found a pattern you love? Add it to your Queue to save it for later. Your Queue is your personal wishlist of future projects.",
    icon: Heart,
    href: "/getting-started/build-queue",
  },
  {
    number: 4,
    title: "Start a Project",
    description:
      "Ready to sew? Create a project to track your progress. Add notes, photos, and fabric details as you work through your quilt.",
    icon: FolderOpen,
    href: "/getting-started/start-project",
  },
  {
    number: 5,
    title: "Manage Your Library",
    description:
      "Keep track of patterns you own in your Library. Whether purchased or free, organize all your patterns in one place.",
    icon: BookOpen,
    href: "/getting-started/manage-library",
  },
  {
    number: 6,
    title: "Join the Community",
    description:
      "Connect with fellow quilters in our forums, join groups, and attend virtual or in-person events. Share your work and get inspired!",
    icon: ShoppingBag,
    href: "/getting-started/join-community",
  },
];

export default function GettingStartedPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Getting Started" description="New to Quilters Unite? Learn how to set up your account, find patterns, and start your first project." path="/getting-started" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1
                className="font-serif text-3xl font-bold mb-2"
                data-testid="heading-getting-started"
              >
                {t("gettingStarted.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("gettingStarted.description")}
              </p>
            </div>
            <Link href="/support">
              <Button data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Support
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 mb-12">
            {steps.map((step) => (
              <Link key={step.number} href={step.href}>
                <Card
                  className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                  data-testid={`step-${step.number}`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <step.icon className="h-5 w-5 text-primary" />
                          {step.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <h2 className="font-serif text-2xl font-bold mb-4">
                Ready to Start Quilting and Connecting?
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore our pattern and blocks databases and find your next project today.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/patterns">
                  <Button data-testid="button-browse-patterns">Browse Patterns</Button>
                </Link>
                <Link href="/blocks">
                  <Button variant="outline" data-testid="button-view-blocks">View Blocks</Button>
                </Link>
                <Link href="/community">
                  <Button variant="secondary" data-testid="button-explore-community">Explore the Community</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
