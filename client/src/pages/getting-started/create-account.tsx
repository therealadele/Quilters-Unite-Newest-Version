import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo";

export default function CreateAccountPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Create Your Account"
        description="Step-by-step guide to creating your Quilters Unite account."
        path="/getting-started/create-account"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">
                Create Your Account
              </h1>
              <p className="text-muted-foreground">
                Sign up for a Quilters Unite account to access all features. You
                can save and purchase patterns, track projects, create a pattern
                library, and connect with other quilters.
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
              <h2>Why Create an Account?</h2>
              <p>
                A Quilters Unite account unlocks the full potential of our
                platform. While you can browse and purchase patterns and blocks
                without an account, signing up gives you access to powerful
                features that enhance your quilting experience. After the 14-day
                trial period, choose from a low montly fee or a one-time annual
                fee.
              </p>

              <h2>Quilters - What You Get with an Account</h2>
              <ul>
                <li>
                  <strong>Favorites</strong> — Save your favorite patterns,
                  blocks, events, groups, quilt shops and community projects for
                  easy access later.
                </li>
                <li>
                  <strong>Track Your Projects</strong> — Create detailed project
                  pages to document your quilting journey with photos, notes,
                  and progress updates.
                </li>
                <li>
                  <strong>Build a Pattern Library</strong> — Organize all your
                  purchased and free patterns in one convenient location.
                </li>
                <li>
                  <strong>Connect with Quilters</strong> — Join forums,
                  participate in groups, attend events, and message fellow
                  quilters from around the world.
                </li>
                <li>
                  <strong>Personal Queue</strong> — Keep a wishlist of patterns
                  you want to make next so you never lose track of inspiration.
                </li>
              </ul>

              <h2>Designers - What You Get with an Account</h2>
              <ul>
                <li>
                  <strong>International Community of Quilters</strong> — Be
                  discovered by quilters from around the globe who are craving
                  to be inspired and share in their love of quilting.
                </li>
                <li>
                  <strong>Connect with Quilters</strong> — Join forums,
                  participate in groups, attend events, host events, and
                  interact with fellow quilters from around the world.
                </li>
                <li>
                  <strong>Designer Profile</strong> — Complete your Designer
                  Profile so that fellow quilters can get to know you and your
                  library of designs.
                </li>
                <li>
                  <strong>Low Sales Fee</strong> — Platforms like Etsy can take
                  up to 15% of your sale once transaction fees, listing fees,
                  payment processing fees, ad fees, and currency conversion fees
                  are deducted. <strong>We charge 10%.</strong> If you list a pattern for $20,
                  you receive $18. It's that simple.
                </li>
                <li>
                  <strong>Weekly Payouts</strong> — Payments are sent to your
                  Stripe account each Monday.
                </li>
                <li>
                  <strong>Connect with Quilters</strong> — Join forums,
                  participate in groups, attend events, host events, and message
                  fellow quilters from around the world.
                </li>
                <li>
                  <strong>Sales Dashboard</strong> — See what patterns people
                  are viewing from your collection and what quilters are buying.
                </li>
              </ul>

              <h2>How to Sign Up</h2>
              <ol>
                <li>
                  Click the <strong>"Sign In"</strong> button in the top right
                  corner of any page.
                </li>
                <li>
                  You'll be directed to create your account using your
                  credentials.
                </li>
                <li>
                  Once signed in, your profile is automatically created and you
                  can start exploring!
                </li>
              </ol>

              <h2>Setting Up Your Profile</h2>
              <p>
                After creating your account, take a moment to personalize your
                profile. You can add a profile picture, write a short bio about
                your quilting interests, and let others know what types of
                quilting you enjoy.
              </p>

              <h2>Account Features at a Glance</h2>
              <ul>
                <li>
                  <strong>Notebook</strong> — Your personal quilting hub with
                  Projects, Queue, Favorites, and Library tabs.
                </li>
                <li>
                  <strong>Community Access</strong> — Full access to forums,
                  groups, events, messaging, and the people directory.
                </li>
                <li>
                  <strong>Pattern Submissions</strong> — Share your own patterns
                  and block designs with the community.
                </li>
                <li>
                  <strong>Project Sharing</strong> — Showcase your finished
                  quilts and works-in-progress.
                </li>
              </ul>

              <h2>Need Help?</h2>
              <p>
                If you run into any issues creating your account, please visit
                our{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact page
                </Link>{" "}
                and we'll be happy to assist you.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
