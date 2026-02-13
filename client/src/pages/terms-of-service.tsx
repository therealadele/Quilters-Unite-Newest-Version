import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function TermsOfServicePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Terms of Service" description="Review the terms and conditions for using Quilters Unite." path="/terms-of-service" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2" data-testid="heading-terms">Terms of Service</h1>
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
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using Quilters Unite, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2>Description of Service</h2>
              <p>
                Quilters Unite is an online platform for quilters to discover patterns, share projects, connect with other quilters, and manage their quilting activities. Our services include pattern browsing, project tracking, community forums, and related features.
              </p>

              <h2>User Accounts</h2>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h2>User Content</h2>
              <p>
                You retain ownership of content you submit to Quilters Unite. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with our services.
              </p>
              <p>You agree not to post content that:</p>
              <ul>
                <li>Infringes on intellectual property rights</li>
                <li>Is unlawful, harmful, or offensive</li>
                <li>Contains malware or harmful code</li>
                <li>Violates others' privacy</li>
                <li>Is spam or unauthorized advertising</li>
              </ul>

              <h2>Intellectual Property</h2>
              <p>
                Quilters Unite and its original content, features, and functionality are owned by Quilters Unite and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h2>Pattern and Content Rights</h2>
              <p>
                Quilt patterns and designs shared on Quilters Unite remain the property of their respective creators. Users must respect copyright and obtain proper permissions before using or reproducing patterns.
              </p>

              <h2>Purchases and Payments</h2>
              <p>
                Some patterns or features may require payment. All purchases are subject to our refund policy. Prices are subject to change without notice.
              </p>

              <h2>Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Harvest or collect user information without consent</li>
                <li>Use automated systems to access the service without permission</li>
              </ul>

              <h2>Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or us.
              </p>

              <h2>Disclaimer of Warranties</h2>
              <p>
                Our services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Quilters Unite shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>

              <h2>Indemnification</h2>
              <p>
                You agree to indemnify and hold Quilters Unite harmless from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of significant changes. Your continued use of the service after changes constitutes acceptance of the new Terms.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>

              <h2>Contact</h2>
              <p>
                For questions about these Terms of Service, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
