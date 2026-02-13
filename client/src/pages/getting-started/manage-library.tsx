import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function ManageLibraryPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Manage Your Library" description="Learn how to organize your pattern library on Quilters Unite." path="/getting-started/manage-library" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Manage Your Library</h1>
              <p className="text-muted-foreground">
                Keep track of patterns you own in your Library. Whether purchased or free, organize all your patterns in one place.
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
              <h2>What Is the Library?</h2>
              <p>
                Your Library is a personal collection of all the quilt patterns you own. Whether you've purchased a pattern, downloaded a free one, or received one as a gift, your Library keeps everything organized and accessible in one place.
              </p>

              <h2>Adding Patterns to Your Library</h2>
              <p>
                Patterns are added to your Library in several ways:
              </p>
              <ul>
                <li><strong>Purchased Patterns</strong> — When you buy a pattern on Quilters Unite, it's automatically added to your Library.</li>
                <li><strong>Free Patterns</strong> — Download free patterns and they'll appear in your Library.</li>
                <li><strong>Manual Addition</strong> — Add patterns you own from other sources to keep everything in one place.</li>
              </ul>

              <h2>Accessing Your Library</h2>
              <p>
                Your Library is located in your <Link href="/notebook/library" className="text-primary hover:underline">Notebook</Link> under the Library tab. From there you can:
              </p>
              <ul>
                <li><strong>View all owned patterns</strong> — See your complete collection at a glance.</li>
                <li><strong>Search your collection</strong> — Quickly find a specific pattern when you're ready to use it.</li>
                <li><strong>Access pattern files</strong> — Download your purchased patterns whenever you need them.</li>
              </ul>

              <h2>Library vs. Queue vs. Favorites</h2>
              <p>
                Understanding the difference helps you stay organized:
              </p>
              <ul>
                <li><strong>Library</strong> — Patterns you <em>own</em>. These are yours to use anytime.</li>
                <li><strong>Queue</strong> — Patterns you <em>want to make</em>. Your future project wishlist.</li>
                <li><strong>Favorites</strong> — Everything you <em>admire</em> under one spot - patterns, blocks, community projects, quilt shops, events, groups. Bookmarked for inspiration.</li>
              </ul>

              <h2>Keeping Your Library Organized</h2>
              <ul>
                <li>Add patterns to your Library as soon as you acquire them so nothing gets lost.</li>
                <li>Use your Library as a starting point when planning new projects.</li>
                <li>Review your Library periodically — you might rediscover a pattern you forgot about!</li>
              </ul>

              <h2>What's Next?</h2>
              <p>
                Ready to connect with other quilters? Learn how to <Link href="/getting-started/join-community" className="text-primary hover:underline">join the community</Link> and get inspired!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
