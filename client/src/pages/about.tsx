import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, Target } from "lucide-react";
import { SEO } from "@/components/seo";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="About Us" description="Learn about Quilters Unite — our mission to connect quilters worldwide and celebrate the art of quilting." path="/about" />
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-2">
                <h1 className="font-serif text-4xl font-bold">About Quilters Unite</h1>
                <Link href="/support">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Support
                  </Button>
                </Link>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                A community built by quilters, for quilters.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <Card>
                <CardContent className="py-8 prose prose-sm max-w-none dark:prose-invert">
                  <h2>Our Story</h2>
                  <p>
                    Quilters Unite was born from a simple idea: quilters deserve a dedicated online home where they can discover patterns, share their projects, and connect with fellow makers who share their passion for the craft.
                  </p>
                  <p>
                    Whether you're cutting your very first fabric squares or you've been quilting for decades, our platform is designed to support you at every stage of your creative journey. We believe quilting is more than a hobby — it's a tradition that connects generations, cultures, and communities around the world.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-serif text-lg font-semibold">Our Mission</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      To create the most welcoming and comprehensive online platform for quilters worldwide — a place to discover inspiration, organize projects, and celebrate the art of quilting together.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-serif text-lg font-semibold">Our Vision</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A world where every quilter — from beginner to master — has the tools, community, and inspiration they need to bring their creative visions to life, one stitch at a time.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="py-8 prose prose-sm max-w-none dark:prose-invert">
                  <h2>What We Offer</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 not-prose mt-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Pattern & Block Library</h4>
                        <p className="text-muted-foreground text-sm">Browse thousands of quilt patterns and blocks, from traditional favorites to modern designs, with detailed filtering and search.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Project Tracking</h4>
                        <p className="text-muted-foreground text-sm">Keep all your quilting projects organized in your personal notebook. Track progress, add notes, and share finished quilts with the community.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-accent font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Community & Forums</h4>
                        <p className="text-muted-foreground text-sm">Connect with quilters around the globe through forums, groups, and events. Ask questions, share tips, and find your quilting tribe.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-accent font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Designer Profiles</h4>
                        <p className="text-muted-foreground text-sm">Pattern designers can showcase their work with enhanced profiles, link to their shops, and build a following within the community.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-8 prose prose-sm max-w-none dark:prose-invert">
                  <h2>Our Values</h2>
                  <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">Inclusivity</h4>
                      <p className="text-muted-foreground text-xs">Every quilter is welcome here, regardless of skill level, style, or background. We celebrate the rich diversity of our community.</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">Community First</h4>
                      <p className="text-muted-foreground text-xs">Everything we build is guided by feedback from quilters. This platform exists to serve you and grow with your needs.</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">Creativity</h4>
                      <p className="text-muted-foreground text-xs">We honor the artistry in every quilt. From traditional piecing to modern improvisational work, all forms of quilting creativity are celebrated.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-8 text-center">
                  <h2 className="font-serif text-2xl font-bold mb-3">Join Our Community</h2>
                  <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                    Whether you're here to find your next pattern, share a finished quilt, or simply connect with other quilters, we're glad you're here.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Link href="/register">
                      <Button>Create an Account</Button>
                    </Link>
                    <Link href="/patterns">
                      <Button variant="outline">Browse Patterns</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
