import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function StartProjectPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Start a Project" description="Learn how to create and track quilting projects on Quilters Unite." path="/getting-started/start-project" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Start a Project</h1>
              <p className="text-muted-foreground">
                Ready to sew? Create a project to track your progress. Add notes, photos, and fabric details as you work through your quilt.
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
              <h2>Creating a New Project</h2>
              <p>
                A project is your personal record of making a quilt. It's where you document your journey from start to finish — choosing fabrics, cutting, piecing, quilting, and binding.
              </p>

              <h2>How to Start a Project</h2>
              <ol>
                <li>Navigate to your <Link href="/notebook" className="text-primary hover:underline">Notebook</Link> and select the Projects tab.</li>
                <li>Click <strong>"New Project"</strong> to open the project creation form.</li>
                <li>Fill in the project details including the pattern name, quilt size, and status.</li>
                <li>Add photos to showcase your work as you progress.</li>
                <li>Click <strong>"Create Project"</strong> to save it to your Notebook.</li>
              </ol>

              <h2>Project Details You Can Track</h2>
              <ul>
                <li><strong>Project Name</strong> — Give your project a memorable name.</li>
                <li><strong>Pattern Used</strong> — Link to the pattern you're following.</li>
                <li><strong>Quilt Size</strong> — Baby, Lap, Twin, Double/Full, Queen, or King.</li>
                <li><strong>Status</strong> — Track where you are: Not Started, In Progress, Finished, or Frogged.</li>
                <li><strong>Start & Finish Dates</strong> — Record when you began and completed your quilt.</li>
                <li><strong>Photos</strong> — Upload up to 10 photos showing your progress and finished quilt.</li>
                <li><strong>Notes</strong> — Add personal notes about modifications, fabric choices, or lessons learned.</li>
              </ul>

              <h2>Project Status Options</h2>
              <ul>
                <li><strong>Not Started</strong> — You've planned the project but haven't begun cutting or sewing yet.</li>
                <li><strong>In Progress</strong> — You're actively working on this quilt.</li>
                <li><strong>Finished</strong> — The quilt is complete! Time to celebrate.</li>
                <li><strong>Frogged</strong> — You've decided to take the project apart (it happens to everyone!).</li>
              </ul>

              <h2>Sharing Your Projects</h2>
              <p>
                Your projects can be shared with the community. Other quilters can view your work, leave comments, and find inspiration from your creations. Visit the <Link href="/projects" className="text-primary hover:underline">Projects gallery</Link> to see what others are making.
              </p>

              <h2>Tips for Great Project Pages</h2>
              <ul>
                <li>Add photos at different stages — fabric selection, cutting, piecing, quilting, and the final result.</li>
                <li>Include notes about any modifications you made to the pattern.</li>
                <li>Mention the fabrics you used so others can recreate your look.</li>
                <li>Update your status as you progress so you can look back on your quilting timeline.</li>
              </ul>

              <h2>What's Next?</h2>
              <p>
                Learn how to <Link href="/getting-started/manage-library" className="text-primary hover:underline">manage your pattern library</Link> to keep all your patterns organized in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
