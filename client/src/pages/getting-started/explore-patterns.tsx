import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function ExplorePatternsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Explore Patterns" description="Learn how to browse and filter quilt patterns on Quilters Unite." path="/getting-started/explore-patterns" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Explore Patterns & Blocks</h1>
              <p className="text-muted-foreground">
                Browse our extensive database of quilt patterns and block designs. Filter by difficulty, style, or technique to find your next project.
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
              <h2>Discovering Patterns</h2>
              <p>
                Our pattern database features designs from quilters of all skill levels. Whether you're looking for a simple beginner-friendly quilt or a complex, show-stopping masterpiece, you'll find it here.
              </p>

              <h2>Browsing the Pattern Database</h2>
              <p>
                Visit the <Link href="/patterns" className="text-primary hover:underline">Patterns page</Link> to start browsing. Each pattern listing includes:
              </p>
              <ul>
                <li><strong>Preview Images</strong> — See photos of the finished quilt and design details.</li>
                <li><strong>Difficulty Level</strong> — Patterns are rated from Beginner to Advanced so you can find the right challenge.</li>
                <li><strong>Quilt Size</strong> — Know exactly what size the finished quilt will be before you start.</li>
                <li><strong>Technique</strong> — Find patterns that match your preferred quilting techniques like piecing, appliqué, paper piecing, and more.</li>
                <li><strong>Price</strong> — Some patterns are free, while others are available for purchase from independent designers.</li>
              </ul>

              <h2>Exploring the Blocks Database</h2>
              <p>
                Blocks are the building units of quilts. Visit the <Link href="/blocks" className="text-primary hover:underline">Blocks page</Link> to explore individual block designs that you can combine to create unique quilts.
              </p>
              <ul>
                <li><strong>Traditional Blocks</strong> — Classic designs like Log Cabin, Flying Geese, and Nine Patch.</li>
                <li><strong>Modern Blocks</strong> — Contemporary designs with bold shapes and negative space.</li>
                <li><strong>Foundation Paper Piecing</strong> — Precision blocks created using paper templates.</li>
                <li><strong>Appliqué</strong> — Blocks with intricate pieces hand or machine sewn onto a background.</li>
              </ul>

              <h2>Using Filters</h2>
              <p>
                Narrow down your search using our filtering options:
              </p>
              <ul>
                <li><strong>Difficulty</strong> — Beginner, Intermediate, or Advanced</li>
                <li><strong>Style</strong> — Traditional, Modern, Art Quilts, and more</li>
                <li><strong>Technique</strong> — Piecing, Appliqué, Paper Piecing, Whole Cloth, etc.</li>
                <li><strong>Size</strong> — From small wall hangings to king-size bed quilts</li>
              </ul>

              <h2>Pattern Details</h2>
              <p>
                Click on any pattern to view its full detail page. Here you'll find comprehensive information including the designer's notes, fabric requirements, supply lists, and reviews from other quilters who have made the pattern.
              </p>

              <h2>What's Next?</h2>
              <p>
                Found a pattern you love? Learn how to <Link href="/getting-started/build-queue" className="text-primary hover:underline">add it to your Queue</Link> so you never lose track of it!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
