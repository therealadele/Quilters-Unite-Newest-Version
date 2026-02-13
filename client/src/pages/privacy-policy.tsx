import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Privacy Policy" description="Read our privacy policy to understand how Quilters Unite collects, uses, and protects your personal information." path="/privacy-policy" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2" data-testid="heading-privacy">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
            <Link href="/support">
              <Button data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Support
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="py-8 prose prose-sm max-w-none dark:prose-invert">
              <h2>Introduction</h2>
              <p>
                Quilters Unite ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Register for an account</li>
                <li>Create or share quilting projects</li>
                <li>Participate in community forums</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>
                When you access our website, we may automatically collect certain information about your device and usage, including your IP address, browser type, operating system, and browsing patterns.
              </p>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about updates and features</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Protect against unauthorized access and abuse</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with third parties only in the following circumstances:
              </p>
              <ul>
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>

              <h2>Your Rights</h2>
              <p>Depending on your location, you may have rights to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to certain processing</li>
                <li>Data portability</li>
              </ul>

              <h2>Cookies</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
