import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenLine, Clock } from "lucide-react";
import { SEO, JsonLd } from "@/components/seo";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Choosing the Perfect Fabric Palette",
    excerpt: "Selecting fabrics is one of the most exciting — and sometimes overwhelming — parts of starting a new quilt. Here are five tried-and-true tips to help you build a cohesive palette every time.",
    author: "Sarah Mitchell",
    date: "2026-02-05",
    dateDisplay: "February 5, 2026",
    category: "Tips & Tricks",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Beginner's Guide to Free-Motion Quilting",
    excerpt: "Free-motion quilting opens up a world of creative possibilities. If you've been sticking to straight-line quilting and want to branch out, this guide will walk you through the basics.",
    author: "Emily Chen",
    date: "2026-01-28",
    dateDisplay: "January 28, 2026",
    category: "Tutorials",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The History of Log Cabin Quilts",
    excerpt: "The Log Cabin block is one of the most beloved and enduring patterns in quilting history. Discover its origins, symbolism, and the many variations quilters have created over the centuries.",
    author: "Martha Avery",
    date: "2026-01-20",
    dateDisplay: "January 20, 2026",
    category: "History",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "How to Press Seams: Open vs. To the Side",
    excerpt: "The great pressing debate! Both methods have their place in quilting. Learn when to press seams open, when to press to the side, and how each choice affects your finished quilt.",
    author: "Rachel Kim",
    date: "2026-01-14",
    dateDisplay: "January 14, 2026",
    category: "Tips & Tricks",
    readTime: "3 min read",
  },
  {
    id: 5,
    title: "Spotlight: Modern Improv Quilting",
    excerpt: "Improvisational quilting throws out the rules and embraces spontaneity. Meet three quilters who are pushing the boundaries of modern improv and learn how to get started yourself.",
    author: "Jamie Okafor",
    date: "2026-01-07",
    dateDisplay: "January 7, 2026",
    category: "Inspiration",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "Organizing Your Quilting Space on a Budget",
    excerpt: "You don't need a dedicated sewing room to stay organized. These budget-friendly storage ideas will help you make the most of whatever space you have — from a corner desk to a full studio.",
    author: "Linda Torres",
    date: "2025-12-30",
    dateDisplay: "December 30, 2025",
    category: "Lifestyle",
    readTime: "4 min read",
  },
];

const categories = ["All", "Tips & Tricks", "Tutorials", "History", "Inspiration", "Lifestyle"];

export default function BlogPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Blog" description="Tips, tutorials, quilting history, and inspiration from the Quilters Unite community." path="/community/blog" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Quilters Unite Blog",
        "url": "https://quiltersunite.com/community/blog",
        "description": "Tips, tutorials, quilting history, and inspiration from the Quilters Unite community.",
        "publisher": {
          "@type": "Organization",
          "name": "Quilters Unite"
        },
        "blogPost": blogPosts.map((post) => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "url": `https://quiltersunite.com/community/blog/${post.id}`,
          "author": { "@type": "Person", "name": post.author },
          "datePublished": post.date,
          "articleSection": post.category
        }))
      }} />
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <PenLine className="h-8 w-8 text-primary" />
                    <h1 className="font-serif text-4xl font-bold">Blog</h1>
                  </div>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    Tips, tutorials, and stories from the quilting community.
                  </p>
                </div>
                <Link href="/community">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={cat === "All" ? "default" : "outline"}
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <article key={post.id}>
                  <Card className="hover-elevate cursor-pointer transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-serif">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed mb-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {post.author}</span>
                        <time dateTime={post.date}>{post.dateDisplay}</time>
                      </div>
                    </CardContent>
                  </Card>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
