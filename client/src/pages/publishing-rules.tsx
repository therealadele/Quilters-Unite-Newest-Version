import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, AlertTriangle, Shield, FileText } from "lucide-react";
import { SEO } from "@/components/seo";

export default function PublishingRulesPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Publishing Rules" description="Guidelines for publishing patterns on Quilters Unite." path="/patterns/publishing-rules" />
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/patterns/new">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-semibold">Rules for Adding Patterns & Blocks</h1>
              <p className="text-muted-foreground">
                Please read these guidelines before submitting content
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Copyright & Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Quilters Unite respects the intellectual property rights of pattern designers and creators. 
                  By adding a pattern or block to our database, you agree to the following terms:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>No Piracy:</strong> Do not upload, share, or distribute copyrighted pattern or block 
                    instructions, diagrams, or templates without explicit permission from the designer or copyright holder.
                  </li>
                  <li>
                    <strong>No Reselling:</strong> Do not list patterns or blocks for sale that you did not 
                    design yourself. Only the original designer or authorized distributors may sell patterns.
                  </li>
                  <li>
                    <strong>Respect Designer Rights:</strong> Pattern designs are protected intellectual property. 
                    Copying, modifying, or redistributing patterns without permission is a violation of copyright law.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Guidelines for Patterns You Did Not Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you are adding a pattern or block to the database that you did not create, please follow these guidelines:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Limited Photos:</strong> You may include a cover shot image and fabric requirements only.
                  </li>
                  <li>
                    <strong>No Instructions:</strong> Do not post completion instructions, cutting diagrams, 
                    assembly steps, or any content that would allow someone to create the pattern or block without purchasing it.
                  </li>
                  <li>
                    <strong>Provide Source:</strong> Always include a link to where the pattern or block can be legitimately purchased or obtained from the original designer.
                  </li>
                  <li>
                    <strong>Credit the Designer:</strong> Always include the designer's name and give proper attribution.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Violations & Enforcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Violations of these rules may result in:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Immediate removal of the infringing content. We review all content as it is published.</li>
                  <li>Suspension or termination of your account.</li>
                  <li>Legal action in cases of serious copyright infringement.</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-4">
                  If you believe your copyright has been violated, please contact us immediately through our 
                  support page to file a complaint.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
