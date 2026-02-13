import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function JoinCommunityPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Join the Community" description="Learn how to connect with other quilters on Quilters Unite." path="/getting-started/join-community" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Join the Community</h1>
              <p className="text-muted-foreground">
                Connect with fellow quilters in our forums, join groups, and attend virtual or in-person events. Share your work and get inspired!
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
              <h2>Welcome to the Quilting Community</h2>
              <p>
                Quilters Unite is more than a pattern library — it's a vibrant community of quilters who love to share, learn, and inspire each other. Here's how you can get involved.
              </p>

              <h2>Forums</h2>
              <p>
                Our <Link href="/community/forums" className="text-primary hover:underline">forums</Link> are the heart of community discussion. Join conversations about:
              </p>
              <ul>
                <li><strong>General Quilting</strong> — Chat about all things quilting, from fabric choices to finishing techniques.</li>
                <li><strong>Pattern Help</strong> — Ask questions and get advice when you're stuck on a pattern.</li>
                <li><strong>Show & Tell</strong> — Share your finished quilts and works-in-progress with the community.</li>
                <li><strong>Tips & Tutorials</strong> — Learn new techniques and share your quilting knowledge.</li>
                <li><strong>Fabric & Supplies</strong> — Discuss your favorite fabrics, tools, and where to find the best deals.</li>
              </ul>

              <h2>Groups</h2>
              <p>
                <Link href="/community/groups" className="text-primary hover:underline">Groups</Link> bring quilters together around shared interests. Join existing groups or create your own! Groups are great for:
              </p>
              <ul>
                <li>Quilt-alongs where members work on the same pattern together</li>
                <li>Local quilting meetups and guilds</li>
                <li>Technique-specific discussions (paper piecing, hand quilting, etc.)</li>
                <li>Themed challenges and swaps</li>
              </ul>

              <h2>Events</h2>
              <p>
                Stay connected through <Link href="/community/events" className="text-primary hover:underline">events</Link> — both virtual and in-person. Events include:
              </p>
              <ul>
                <li><strong>Virtual Sew-Alongs</strong> — Sew together from the comfort of your home.</li>
                <li><strong>Quilt Shows</strong> — View and display quilts at juried and open shows.</li>
                <li><strong>Workshops</strong> — Learn new skills with guided instruction.</li>
                <li><strong>Retreats</strong> — Multi-day quilting getaways with fellow enthusiasts.</li>
              </ul>

              <h2>Messaging</h2>
              <p>
                Use the <Link href="/community/messages" className="text-primary hover:underline">messaging</Link> feature to have private conversations with other quilters. It's perfect for:
              </p>
              <ul>
                <li>Asking another quilter about their project</li>
                <li>Coordinating meetups or swaps</li>
                <li>Getting one-on-one advice</li>
              </ul>

              <h2>Finding People</h2>
              <p>
                Visit the <Link href="/community/people" className="text-primary hover:underline">People directory</Link> to discover quilters in the community. You can add friends, follow their projects, and stay up-to-date with their latest creations.
              </p>

              <h2>Community Guidelines</h2>
              <p>
                We want Quilters Unite to be a welcoming, supportive space for everyone. Please review our <Link href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</Link> to help us maintain a positive environment.
              </p>

              <h2>Get Started!</h2>
              <p>
                Head over to the <Link href="/community" className="text-primary hover:underline">Community page</Link> to explore forums, find groups, and connect with quilters who share your passion!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
