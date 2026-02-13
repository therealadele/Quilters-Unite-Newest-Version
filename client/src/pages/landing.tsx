import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3X3, Ruler, Users, BookOpen, Heart, Scissors, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO, JsonLd } from "@/components/seo";

export default function LandingPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SEO description="Join Quilters Unite — discover quilt patterns, share projects, and connect with a worldwide quilting community. Start your 14-day free trial today." path="/" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Quilters Unite",
        "url": "https://quiltersunite.com",
        "description": "Your home for quilting patterns, projects, and community.",
        "sameAs": [
          "https://instagram.com",
          "https://facebook.com",
          "https://pinterest.com"
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Quilters Unite",
        "url": "https://quiltersunite.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://quiltersunite.com/patterns?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }} />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Grid3X3 className="h-4 w-4" />
                <span>{t('landing.joinBadge')}</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                {t('landing.heroTitle')}
                <span className="block text-primary">{t('landing.heroTitleAccent')}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                {t('landing.heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="gap-2" data-testid="cta-get-started">
                  <Link href="/register">
                    {t('landing.getStarted')}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="cta-explore">
                  <Link href="/patterns">
                    {t('landing.explorePatterns')}
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{t('landing.noCreditCard')}</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 flex items-center justify-center">
                        <Grid3X3 className="h-16 w-16 text-rose-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                        <Ruler className="h-12 w-12 text-amber-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 flex items-center justify-center">
                        <Scissors className="h-12 w-12 text-teal-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-violet-500/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('landing.featuresDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card className="group hover-elevate border-0 bg-background">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{t('landing.featurePatternDb')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.featurePatternDbDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-0 bg-background">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">{t('landing.featureBlockDb')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.featureBlockDbDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-0 bg-background">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-rose-500" />
                </div>
                <h3 className="font-semibold text-lg">{t('landing.featureProjectTracking')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.featureProjectTrackingDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-0 bg-background">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="font-semibold text-lg">{t('landing.featureFavorites')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.featureFavoritesDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-0 bg-background">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-violet-500" />
                </div>
                <h3 className="font-semibold text-lg">{t('landing.featureCommunity')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.featureCommunityDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-0 bg-background">
              <CardContent className="p-6 space-y-3">
                <div className="h-11 w-11 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-teal-500" />
                </div>
                <h3 className="font-semibold text-lg">{t('landing.featureLibrary')}</h3>
                <p className="text-muted-foreground">
                  {t('landing.featureLibraryDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-primary-foreground/80 mb-4 max-w-xl mx-auto">
            {t('landing.ctaDescription')}
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="cta-join">
            <Link href="/register">
              {t('landing.ctaButton')}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Grid3X3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">{t('common.appName')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.allRightsReserved', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
