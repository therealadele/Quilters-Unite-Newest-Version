import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function BuildQueuePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Build Your Queue" description="Learn how to save patterns to your queue for future projects." path="/getting-started/build-queue" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Build Your Queue</h1>
              <p className="text-muted-foreground">
                Found a pattern you love? Add it to your Queue to save it for later. Your Queue is your personal wishlist of future projects.
              </p>
            </div>
            <Link href="/getting-started">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Getting Started
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="py-8 prose prose-sm max-w-none dark:prose-invert">
              <h2>What Is the Queue?</h2>
              <p>
                The Queue is your personal wishlist of quilting projects you want to make in the future. Think of it as a "to-make" list — a place to save all the patterns that catch your eye so you can come back to them when you're ready to start a new project.
              </p>

              <h2>Adding Patterns to Your Queue</h2>
              <p>
                Adding a pattern to your Queue is simple:
              </p>
              <ol>
                <li>Browse the <Link href="/patterns" className="text-primary hover:underline">Patterns</Link> or <Link href="/blocks" className="text-primary hover:underline">Blocks</Link> pages to find designs you love.</li>
                <li>Open the pattern detail page by clicking on it.</li>
                <li>Click the <strong>"Add to Queue"</strong> button to save it to your list.</li>
                <li>The pattern will now appear in your Notebook under the Queue tab.</li>
              </ol>

              <h2>Managing Your Queue</h2>
              <p>
                Your Queue lives in your <Link href="/notebook/queue" className="text-primary hover:underline">Notebook</Link>. From there, you can:
              </p>
              <ul>
                <li><strong>View all queued patterns</strong> — See everything you've saved at a glance.</li>
                <li><strong>Remove items</strong> — Changed your mind? Remove patterns from your Queue anytime.</li>
                <li><strong>Start a project</strong> — When you're ready to begin, convert a queued pattern into an active project.</li>
              </ul>

              <h2>Queue vs. Favorites vs. Library</h2>
              <p>
                Quilters Unite gives you several ways to organize patterns. Here's how they differ:
              </p>
              <ul>
                <li><strong>Queue</strong> — Patterns you plan to make in the future. Your "to-do" list.</li>
                <li><strong>Favorites</strong> — Patterns you love and want to bookmark, whether or not you plan to make them.</li>
                <li><strong>Library</strong> — Patterns you own, either purchased or downloaded for free.</li>
              </ul>

              <h2>Tips for Using Your Queue</h2>
              <ul>
                <li>Add patterns freely — there's no limit to how many you can queue!</li>
                <li>Review your Queue regularly to keep it organized and relevant.</li>
                <li>Use your Queue to plan your next project before buying fabric and supplies.</li>
              </ul>

              <h2>What's Next?</h2>
              <p>
                Ready to begin quilting? Learn how to <Link href="/getting-started/start-project" className="text-primary hover:underline">start a project</Link> and track your progress!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
